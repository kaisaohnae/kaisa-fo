---
slug: spring-boot-07
order: 7
category: spring-boot
categoryLabel: Spring Boot
title: "Observability — Actuator, Micrometer, OpenTelemetry"
summary: "Actuator와 OpenTelemetry로 헬스·메트릭·트레이스를 붙여, 느린 지점과 장애 지점을 관측한다."
publishedAt: 2025-12-19
tags: ["spring-boot"]
---

# Observability — Actuator, Micrometer, OpenTelemetry

> 요약: Actuator와 OpenTelemetry로 헬스·메트릭·트레이스를 붙여, 느린 지점과 장애 지점을 관측한다.

---

## 1. 왜 관측인가

**Observability(관측 가능성)** 는 로그·메트릭·트레이스만으로 “왜 느리고 어디서 깨졌는지”를 답할 수 있는 상태다.

| 기둥 | 질문 |
|------|------|
| Logs | 무슨 일이 있었나 |
| Metrics | 얼마나, 얼마나 자주 |
| Traces | 이 요청의 시간이 어디에 쓰였나 |

Boot 3는 **Micrometer Observation API**로 메트릭과 트레이스를 같은 계측에서 뽑는다. **Micrometer**는 벤더에 치우치지 않는 메트릭 파사드다.

---

## 2. Actuator

한 줄 정의: **Actuator**는 헬스·메트릭·정보 같은 운영 엔드포인트를 HTTP로 연다.

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

```yaml
management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics,prometheus
  endpoint:
    health:
      show-details: when_authorized
      probes:
        enabled: true
  server:
    port: 8081
```

| Path | 용도 |
|------|------|
| `/actuator/health` | 생존·준비 요약 |
| `/actuator/health/liveness` | k8s liveness |
| `/actuator/health/readiness` | k8s readiness |
| `/actuator/prometheus` | Prometheus 스크레이프 |
| `/actuator/info` | 빌드·앱 정보 |

운영에서는 별도 포트와 인증으로 막는다. `include: '*'`는 힙덤프까지 노출하기 쉽다.

---

## 3. Health Indicator

외부 결제망처럼 앱이 떠 있어도 트래픽을 받으면 안 되는 의존성은 readiness에 넣을지 팀 정책으로 정한다. 헬스마다 외부 ping을 치면 헬스 자체가 장애가 된다.

```java
@Component
public class PaymentGatewayHealthIndicator implements HealthIndicator {

    private final PaymentClient client;

    public PaymentGatewayHealthIndicator(PaymentClient client) {
        this.client = client;
    }

    @Override
    public Health health() {
        try {
            client.ping();
            return Health.up().withDetail("payment", "reachable").build();
        } catch (Exception e) {
            return Health.down(e).build();
        }
    }
}
```

---

## 4. 메트릭과 Observation

Prometheus 레지스트리를 붙이면 `/actuator/prometheus`로 나간다.

```xml
<dependency>
  <groupId>io.micrometer</groupId>
  <artifactId>micrometer-registry-prometheus</artifactId>
</dependency>
```

HTTP 서버·`RestClient`·DataSource는 Boot가 기본 계측한다. 비즈니스 카운터는 직접 심는다.

```java
@Service
public class CheckoutService {

    private final Counter checkoutCounter;
    private final Timer checkoutTimer;

    public CheckoutService(MeterRegistry registry) {
        this.checkoutCounter = registry.counter("checkout.completed");
        this.checkoutTimer = registry.timer("checkout.latency");
    }

    public void checkout(Order order) {
        checkoutTimer.record(() -> {
            // 유스케이스
            checkoutCounter.increment();
        });
    }
}
```

Observation은 메트릭과 트레이스를 한 구간으로 묶는다. 카디널리티가 높은 값(userId, 주문번호)을 태그로 넣으면 시계열이 폭발한다.

```java
Observation.createNotStarted("order.create", observationRegistry)
        .lowCardinalityKeyValue("type", "online")
        .observe(() -> orderService.create(request));
```

---

## 5. OpenTelemetry

한 줄 정의: **OpenTelemetry(OTel)** 는 트레이스·메트릭·로그를 보내는 공개 표준이다. Micrometer Tracing이 OTel 브리지로 스팬을 내보내고, Collector가 Jaeger·Tempo 등으로 넘긴다.

```xml
<dependency>
  <groupId>io.micrometer</groupId>
  <artifactId>micrometer-tracing-bridge-otel</artifactId>
</dependency>
<dependency>
  <groupId>io.opentelemetry</groupId>
  <artifactId>opentelemetry-exporter-otlp</artifactId>
</dependency>
```

```yaml
management:
  tracing:
    sampling:
      probability: 1.0
  otlp:
    tracing:
      endpoint: http://localhost:4318/v1/traces

logging:
  pattern:
    level: "%5p [${spring.application.name:},%X{traceId:-},%X{spanId:-}]"
```

운영 샘플링은 0.05~0.2부터 본다. 전 요청 트레이스는 비용이 크다. 로그에 `traceId`가 있으면 티켓·로그·트레이스를 같은 요청으로 잇는다.

| 환경 | probability |
|------|-------------|
| local | 1.0 |
| staging | 0.5~1.0 |
| prod | 0.05~0.2 |

---

## 6. 구조화 로그

운영 로그는 JSON이 검색·알람에 유리하다. Logback encoder 또는 Log4j2 JSON layout을 쓴다.

남길 것: timestamp, level, service, env, traceId, spanId, 내부 userId, 제한된 스택.  
남기지 말 것: 비밀번호, 토큰, 카드번호, 주민번호, 개인정보 원문.

---

## 7. 알람 최소선

- `http.server.requests` p99 급증
- `hikaricp.connections.pending`이 지속
- 5xx 비율
- readiness 실패
- JVM GC·힙, Tomcat 큐

대시보드는 RED(Rate, Errors, Duration)와 의존성 지연, 그리고 `order.created` 같은 비즈니스 카운터를 같이 본다.

---

## 8. 흔한 실수

| 실수 | 대안 |
|------|------|
| Actuator `*` 노출 | 화이트리스트 + 별도 포트 |
| userId를 메트릭 태그 | low cardinality만 |
| prod 샘플링 1.0 | 트래픽에 맞게 낮춤 |
| 로그에 토큰·PII | 마스킹 |
| 기술 메트릭만 | 비즈니스 카운터 |

---

## 연습

1. Actuator + Prometheus registry로 `/actuator/prometheus`를 확인한다.
2. `order.created` 카운터를 추가한다.
3. 로그 패턴에 `traceId`를 넣는다.
4. (선택) OTel Collector + Jaeger로 스팬을 본다.
