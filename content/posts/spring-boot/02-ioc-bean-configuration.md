---
slug: spring-boot-02
order: 2
category: spring-boot
categoryLabel: Spring Boot
title: "IoC, Bean, Configuration — 의존성 주입"
summary: "IoC 컨테이너가 Bean을 조립하는 방식을 이해하고, 생성자 주입과 타입 세이프 설정으로 의존성을 구성한다."
publishedAt: 2023-10-13
tags: ["spring-boot"]
---

# IoC, Bean, Configuration — 의존성 주입

> 요약: IoC 컨테이너가 Bean을 조립하는 방식을 이해하고, 생성자 주입과 타입 세이프 설정으로 의존성을 구성한다.

---

## 1. 왜 IoC인가

**IoC(Inversion of Control)** 는 객체 생성과 생명주기 제어권을 프레임워크가 갖는 것이다. **DI(Dependency Injection)** 는 그 구현 방식으로, 필요한 의존성을 외부에서 넣어 준다.

직접 `new`로 조립하면 테스트에서 구현을 바꾸기 어렵다. Spring은 **Bean**—컨테이너가 만들고 주입하는 객체—으로 그래프를 짠다.

---

## 2. Bean이 되는 방법

직접 만든 클래스는 스테레오타입, 외부 라이브러리 객체는 `@Bean`이 기본이다.

| 방식 | 언제 |
|------|------|
| `@Component` / `@Service` / `@Repository` / `@Controller` | 우리가 작성한 클래스 |
| `@Bean` + `@Configuration` | 생성 과정이 있거나 남이 만든 타입 |
| `@ConfigurationProperties` | 설정값을 타입으로 바인딩 |
| Auto-configuration | starter가 조건에 맞으면 등록 |

```java
@Service
public class OrderService {
    private final OrderRepository orderRepository;
    private final PaymentClient paymentClient;

    public OrderService(OrderRepository orderRepository, PaymentClient paymentClient) {
        this.orderRepository = orderRepository;
        this.paymentClient = paymentClient;
    }
}
```

생성자가 하나면 `@Autowired`는 생략한다.

---

## 3. 주입 방식

생성자 주입이 기본선이다. `final`로 불변이고, 순환 의존성은 기동 시점에 드러나며, 테스트에서 목을 넣기 쉽다.

```java
@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
}
```

`@Autowired` 필드 주입은 테스트와 불변성이 약하다. Setter는 정말 선택적 의존성일 때만 쓴다.

---

## 4. `@Configuration`과 `@Bean`

한 줄 정의: 설정 클래스는 **조립 공장**이고, `@Bean` 메서드 반환값이 컨테이너에 등록된다.

```java
@Configuration
public class AppConfig {

    @Bean
    Clock clock() {
        return Clock.systemUTC();
    }

    @Bean
    ObjectMapper objectMapper() {
        return JsonMapper.builder()
                .addModule(new JavaTimeModule())
                .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS)
                .build();
    }
}
```

기본 `@Configuration`은 CGLIB 프록시로 `@Bean` 메서드 간 호출을 싱글톤으로 맞춘다. `@Bean`끼리 서로 호출하지 않으면 `@Configuration(proxyBeanMethods = false)`(Lite)가 기동에 유리하다.

---

## 5. 스코프

| Scope | 의미 |
|-------|------|
| `singleton` (기본) | 컨테이너당 하나 |
| `prototype` | 조회마다 새 인스턴스 |
| `request` / `session` | HTTP 요청·세션당 하나 |

서비스·리포지토리는 거의 항상 singleton이다. **요청 상태를 필드로 두지 않는다.** 두면 스레드끼리 데이터가 섞인다.

```java
@Bean
@Scope("prototype")
ReportBuilder reportBuilder() {
    return new ReportBuilder();
}
```

---

## 6. 조건부 Bean

환경마다 구현을 바꾸려면 조건 어노테이션을 쓴다. 로컬에서만 가짜 클라이언트를 쓰는 전형적인 패턴이다.

```java
@Bean
@ConditionalOnProperty(name = "app.mail.enabled", havingValue = "true")
MailSender mailSender(MailProperties props) {
    return new SmtpMailSender(props);
}

@Bean
@ConditionalOnMissingBean(MailSender.class)
MailSender noopMailSender() {
    return new NoopMailSender();
}
```

`@Profile("!prod")`, `@ConditionalOnClass`, `@ConditionalOnWebApplication`도 같은 계열이다.

```java
@Service
@Profile("!prod")
public class FakePaymentClient implements PaymentClient { }
```

---

## 7. `@ConfigurationProperties`

URL·타임아웃을 코드에 쓰지 않는다. Boot 3에서는 **record + `@ConfigurationProperties`** 가 맞다.

```java
@ConfigurationProperties(prefix = "app.payment")
public record PaymentProperties(
        String baseUrl,
        Duration timeout,
        int maxRetries
) {}
```

```yaml
app:
  payment:
    base-url: https://pay.example.com
    timeout: 3s
    max-retries: 2
```

```java
@Configuration
@EnableConfigurationProperties(PaymentProperties.class)
public class PaymentConfig {

    @Bean
    PaymentClient paymentClient(PaymentProperties props, RestClient.Builder builder) {
        return new HttpPaymentClient(builder.baseUrl(props.baseUrl()).build(), props);
    }
}
```

IDE 자동완성은 `spring-boot-configuration-processor`를 annotation processor로 넣으면 된다.

---

## 8. 포트로 의존성 끊기

구현체가 아니라 **인터페이스(포트)** 에 의존하면 테스트에서 구현만 바꾸면 된다.

```java
public interface NotificationPort {
    void send(String to, String message);
}

@Service
public class EmailNotificationAdapter implements NotificationPort { }
```

---

## 9. 순환 의존성과 생명주기

Boot 3는 순환 참조를 기본적으로 허용하지 않는다. 공통 로직을 제3 서비스로 빼거나 `ApplicationEventPublisher`로 결합을 낮춘다. `@Lazy`는 최후 수단이다.

기동·종료 훅은 `@PostConstruct` / `@PreDestroy` 또는 `@Bean(initMethod, destroyMethod)`다. 파일·스레드 풀처럼 닫을 자원이 있으면 destroy를 빠뜨리지 않는다.

```java
@Bean(initMethod = "start", destroyMethod = "stop")
MyWorker myWorker() {
    return new MyWorker();
}
```

---

## 10. 흔한 실수

| 실수 | 대안 |
|------|------|
| 필드 `@Autowired` | 생성자 + `final` |
| yml 값을 `@Value`로 흩뿌리기 | `@ConfigurationProperties` |
| 서비스에 요청 상태 필드 | 메서드 인자·요청 스코프 |
| 순환을 `@Lazy`로 숨기기 | 설계 분리 |
| `@Component`와 `@Bean`으로 같은 타입을 두 번 등록 | 하나만 |

---

## 연습

1. `AppProperties` record로 `app.greeting`을 읽어 API로 반환한다.
2. `Clock` Bean을 등록하고, 테스트에서는 고정 `Clock`으로 교체한다.
3. `local` 프로필에서만 동작하는 `DevBanner`를 만든다.
