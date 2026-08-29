---
slug: spring-boot-03
order: 3
category: spring-boot
categoryLabel: Spring Boot
title: "REST API 설계 — Validation, Problem Details, RestClient"
summary: "검증·Problem Details·RestClient로 REST API의 계약과 에러 응답, 외부 호출을 일관되게 만든다."
publishedAt: 2024-05-13
tags: ["spring-boot"]
---

# REST API 설계 — Validation, Problem Details, RestClient

> 요약: 검증·Problem Details·RestClient로 REST API의 계약과 에러 응답, 외부 호출을 일관되게 만든다.

---

## 1. 컨트롤러는 HTTP 어댑터다

컨트롤러는 요청을 파싱·검증하고 애플리케이션 서비스를 호출한 뒤, 상태 코드와 본문만 매핑한다. 비즈니스 규칙은 서비스에 둔다.

```java
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UserResponse create(@Valid @RequestBody CreateUserRequest request) {
        return userService.create(request);
    }

    @GetMapping("/{id}")
    public UserResponse get(@PathVariable Long id) {
        return userService.get(id);
    }
}
```

엔티티를 그대로 응답하지 않는다. 영속성 모델과 API 계약은 별개다.

```java
public record CreateUserRequest(
        @NotBlank @Email String email,
        @NotBlank @Size(max = 50) String name
) {}

public record UserResponse(Long id, String email, String name) {}
```

---

## 2. Bean Validation

한 줄 정의: **`jakarta.validation` 제약으로 입력 형태를 선언**하고, `@Valid`가 붙은 시점에 검사한다. 의존성은 `spring-boot-starter-validation`이다.

| 어노테이션 | 용도 |
|-----------|------|
| `@NotNull` / `@NotBlank` | 필수 |
| `@Email` | 이메일 |
| `@Size` / `@Min` / `@Max` | 길이·범위 |
| `@Pattern` | 정규식 |
| `@Valid` | 중첩 객체 |
| `@Validated` | 그룹·메서드 파라미터 |

쿼리 파라미터 검증은 클래스에 `@Validated`가 있어야 동작한다.

```java
@Validated
@RestController
public class UserController {

    @GetMapping
    public Page<UserResponse> search(
            @RequestParam @Min(0) int page,
            @RequestParam @Min(1) @Max(100) int size) {
        return userService.search(page, size);
    }
}
```

`@NotNull`은 공백 문자열을 통과시킨다. 문자열 필수는 `@NotBlank`다.

---

## 3. 상태 코드

| 상황 | 코드 |
|------|------|
| 조회 성공 | 200 |
| 생성 | 201 + `Location` |
| 본문 없는 성공 | 204 |
| 검증 실패 | 400 |
| 인증 필요 | 401 |
| 권한 없음 | 403 |
| 없음 | 404 |
| 중복 등 충돌 | 409 |
| 서버 오류 | 500 |

```java
@PostMapping
public ResponseEntity<UserResponse> create(@Valid @RequestBody CreateUserRequest request) {
    UserResponse created = userService.create(request);
    URI location = URI.create("/api/users/" + created.id());
    return ResponseEntity.created(location).body(created);
}
```

---

## 4. Problem Details

한 줄 정의: **RFC 7807** 형식의 에러 본문이다. `type`, `title`, `status`, `detail`과 확장 필드로 클라이언트가 분기한다. Boot 3 / Framework 6의 `ProblemDetail`이 이 계약이다.

```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(UserNotFoundException.class)
    ResponseEntity<ProblemDetail> handleNotFound(UserNotFoundException ex) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(
                HttpStatus.NOT_FOUND, ex.getMessage());
        problem.setTitle("User Not Found");
        problem.setProperty("userId", ex.getUserId());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(problem);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    ResponseEntity<ProblemDetail> handleValidation(MethodArgumentNotValidException ex) {
        ProblemDetail problem = ProblemDetail.forStatus(HttpStatus.BAD_REQUEST);
        problem.setTitle("Validation Failed");
        problem.setProperty("errors", ex.getBindingResult().getFieldErrors().stream()
                .map(fe -> Map.of("field", fe.getField(), "message", fe.getDefaultMessage()))
                .toList());
        return ResponseEntity.badRequest().body(problem);
    }
}
```

```json
{
  "type": "about:blank",
  "title": "Validation Failed",
  "status": 400,
  "errors": [
    { "field": "email", "message": "must be a well-formed email address" }
  ]
}
```

메시지 문자열만 제각각 내려주면 프론트가 필드 단위로 표시하기 어렵다.

---

## 5. 버전·페이지네이션

중소규모는 URL 버전(`/api/v1/users`)이 운영하기 쉽다. 필드 추가만 하고, 깨지는 변경은 새 버전으로 둔다.

```java
@GetMapping
public Page<UserResponse> list(Pageable pageable) {
    return userService.list(pageable);
}
```

```
GET /api/users?page=0&size=20&sort=createdAt,desc
```

외부 공개 API는 `items` / `page` / `total`처럼 팀 봉투를 따로 정하는 경우가 많다. `size` 상한을 두지 않으면 한 번에 전체를 끌어가는 요청이 나온다.

---

## 6. RestClient

한 줄 정의: Boot 3.2+의 **동기 HTTP 클라이언트**다. `RestTemplate`은 유지보수 모드에 가깝고, 리액티브면 `WebClient`다.

```java
@Configuration
public class HttpClientConfig {

    @Bean
    RestClient paymentRestClient(RestClient.Builder builder, PaymentProperties props) {
        JdkClientHttpRequestFactory factory = new JdkClientHttpRequestFactory();
        factory.setReadTimeout(Duration.ofSeconds(3));
        return builder
                .baseUrl(props.baseUrl())
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .requestFactory(factory)
                .build();
    }
}
```

```java
public PaymentResponse charge(ChargeRequest request) {
    return paymentRestClient.post()
            .uri("/charges")
            .body(request)
            .retrieve()
            .onStatus(HttpStatusCode::is4xxClientError, (req, res) -> {
                throw new PaymentRejectedException("payment rejected");
            })
            .body(PaymentResponse.class);
}
```

타임아웃 없는 클라이언트는 스레드와 커넥션을 붙잡는다. 재시도는 멱등한 호출에만 붙인다.

---

## 7. JSON·OpenAPI

```yaml
spring:
  jackson:
    default-property-inclusion: non_null
    serialization:
      write-dates-as-timestamps: false
    time-zone: Asia/Seoul
```

날짜는 ISO-8601 (`OffsetDateTime`)을 쓴다. 문서화는 `springdoc-openapi-starter-webmvc-ui`로 `/swagger-ui.html`, `/v3/api-docs`를 연다. 운영에서는 인증 뒤에 두거나 끈다.

비밀번호·토큰은 응답 DTO에 넣지 않는다. 생성·결제 API는 Idempotency-Key를 검토한다.

---

## 8. 흔한 실수

| 실수 | 대안 |
|------|------|
| 엔티티 직접 노출 | record DTO |
| `@NotNull`로 문자열 필수 | `@NotBlank` |
| 예외마다 다른 JSON 모양 | `ProblemDetail` |
| RestTemplate 신규 코드 | `RestClient` |
| 타임아웃 없음 | connect/read 명시 |

---

## 연습

1. `POST /api/products`에 Bean Validation과 201 Created를 붙인다.
2. 없는 상품은 `ProblemDetail` 404로 반환한다.
3. `RestClient`로 공개 API를 호출하는 서비스를 만든다.
4. springdoc으로 계약을 확인한다.
