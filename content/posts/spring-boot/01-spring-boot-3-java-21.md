---
slug: spring-boot-01
order: 1
category: spring-boot
categoryLabel: Spring Boot
title: "Spring Boot 3와 Java 21 시작하기"
summary: "Java 21과 Spring Boot 3.x로 프로젝트를 세팅하고, 자동 구성·프로파일·record 같은 기본선을 잡는다."
publishedAt: 2023-01-09
tags: ["spring-boot"]
---

# Spring Boot 3와 Java 21 시작하기

> 요약: Java 21과 Spring Boot 3.x로 프로젝트를 세팅하고, 자동 구성·프로파일·record 같은 기본선을 잡는다.

---

## 1. 왜 지금 Spring Boot인가

Spring Boot는 **관례 기반(Convention over Configuration)** 으로 기동한다. 자주 쓰는 기능은 starter 의존성으로 붙이고, 나머지는 기본값을 따른다.

Boot 3의 전제:

| 항목 | Boot 2.x | Boot 3.x |
|------|----------|----------|
| Java | 8+ | **17 필수, 21이 실무 기본선** |
| 패키지 | `javax.*` | **`jakarta.*`** |
| 서블릿 | 4 | 5/6 |
| Native | 실험 | GraalVM Native 정식 |
| 관측 | Micrometer 1.x | Observation API + OpenTelemetry |

Jakarta는 Java EE가 Eclipse 재단으로 옮기며 패키지 이름이 바뀐 것이다. Boot 3 코드와 의존성은 `jakarta.validation`, `jakarta.persistence`처럼 **`jakarta.*`만** 쓴다.

실무 기본선은 **Java 21 LTS + Spring Boot 3.4+** 다.

---

## 2. 프로젝트 생성

[start.spring.io](https://start.spring.io)에서 Java 21, Jar, 최신 3.x를 고른다. 최소 의존성은 Spring Web, Validation, Actuator면 충분하다. JPA·DB 드라이버는 영속성이 필요할 때 추가한다.

```bash
curl https://start.spring.io/starter.zip \
  -d type=maven-project \
  -d language=java \
  -d bootVersion=3.4.5 \
  -d javaVersion=21 \
  -d dependencies=web,validation,actuator \
  -o demo.zip
```

Lombok은 팀 합의 후에만 넣는다. record와 생성자 주입이면 없어도 된다.

---

## 3. 디렉터리

패키지를 `controller/service/repository`로만 나누면 기능이 커질수록 파일이 흩어진다. **도메인과 어댑터**를 기준으로 두는 편이 유지보수에 유리하다.

```
src/main/java/com/example/demo/
├── DemoApplication.java
├── config/
├── domain/
├── application/
├── adapter/web/
├── adapter/persistence/
└── common/
src/main/resources/
├── application.yml
├── application-local.yml
├── application-prod.yml
└── db/migration/
```

---

## 4. `@SpringBootApplication`

한 줄 정의: **설정 클래스 + 자동 구성 + 컴포넌트 스캔**을 한 어노테이션으로 묶은 진입점이다.

```java
@SpringBootApplication
public class DemoApplication {
    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }
}
```

- `@SpringBootConfiguration` — 이 클래스가 설정이다
- `@EnableAutoConfiguration` — classpath에 있는 starter를 조건에 맞게 켠다
- `@ComponentScan` — 이 패키지 이하만 스캔한다

자동 구성 목록은 `META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports`에 있다. 메인 클래스를 `com.example.demo` 밖에 두면 스캔 범위가 비는 것이 흔한 실수다.

---

## 5. `application.yml`

설정은 YAML + 프로파일 + 환경변수로 나눈다. 시크릿은 파일에 넣지 않는다.

```yaml
spring:
  application:
    name: demo
  profiles:
    active: local

server:
  port: 8080

management:
  endpoints:
    web:
      exposure:
        include: health,info
  endpoint:
    health:
      probes:
        enabled: true

logging:
  level:
    root: INFO
    com.example.demo: DEBUG
```

Actuator는 운영 상태(헬스·메트릭)를 HTTP로 노출하는 모듈이다. 로컬에서 `health`만 열고, 운영 노출 범위는 나중에 줄인다.

| 파일 | 용도 |
|------|------|
| `application.yml` | 공통 |
| `application-local.yml` | 로컬 DB, 상세 로그 |
| `application-test.yml` | 테스트 |
| `application-prod.yml` | 운영. 비밀번호는 `${DB_PASSWORD}` |

---

## 6. Java 21에서 바로 쓰는 문법

### Record

DTO·설정값처럼 **불변 데이터**에 맞다. getter·`equals`를 직접 만들지 않는다.

```java
public record CreateUserRequest(String email, String name) {}
public record UserResponse(Long id, String email, String name) {}
```

### Sealed + pattern matching

결과가 몇 가지로 닫혀 있으면 컴파일러가 분기를 검사한다.

```java
public sealed interface PaymentResult
        permits PaymentResult.Success, PaymentResult.Failed {
    record Success(String transactionId) implements PaymentResult {}
    record Failed(String reason) implements PaymentResult {}
}

String message = switch (result) {
    case PaymentResult.Success s -> "OK: " + s.transactionId();
    case PaymentResult.Failed f -> "FAIL: " + f.reason();
};
```

### Virtual Threads

한 줄 정의: OS 스레드에 1:1로 묶이지 않는 **가벼운 스레드**로, JDBC·HTTP처럼 기다리는 I/O 비용을 낮춘다.

```yaml
spring:
  threads:
    virtual:
      enabled: true
```

Boot 3.2+에서 Tomcat 요청 처리에 붙는다. CPU 연산이 병목인 작업은 기적이 없고, DB 커넥션 풀 한도는 그대로다.

---

## 7. 첫 API

```java
@RestController
@RequestMapping("/api/hello")
public class HelloController {

    @GetMapping
    public Map<String, String> hello() {
        return Map.of("message", "Hello, Spring Boot 3");
    }
}
```

```bash
./mvnw spring-boot:run
curl http://localhost:8080/api/hello
```

Gradle은 `./gradlew bootRun`, 패키징은 `bootJar` 후 `java -jar`다.

---

## 8. 흔한 실수

| 실수 | 결과 |
|------|------|
| `javax.*` import | 컴파일·런타임 불일치 |
| 메인 클래스를 루트 패키지 밖에 둠 | Bean 스캔 누락 |
| 운영 yml에 DB 비밀번호 | 저장소 유출 |
| `show-sql`만 켜고 끝 | 바인딩 값·N+1을 못 봄 |
| Virtual Threads만 켜고 풀 크기 무시 | DB가 먼저 죽는다 |

---

## 연습

1. start.spring.io로 Web + Validation + Actuator 프로젝트를 만든다.
2. `GET /api/health-demo`를 record 응답으로 추가한다.
3. `local` / `prod` 프로파일을 나누고, prod 로그는 INFO로 둔다.
4. `/actuator/health`가 200인지 확인한다.
