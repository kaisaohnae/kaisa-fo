---
slug: spring-boot-05
order: 5
category: spring-boot
categoryLabel: Spring Boot
title: "Spring Security 6 — 인증·인가·OAuth2·JWT"
summary: "SecurityFilterChain으로 API 인증·인가를 구성하고, JWT와 OAuth2 Resource Server를 구분해서 쓴다."
publishedAt: 2025-02-26
tags: ["spring-boot"]
---

# Spring Security 6 — 인증·인가·OAuth2·JWT

> 요약: SecurityFilterChain으로 API 인증·인가를 구성하고, JWT와 OAuth2 Resource Server를 구분해서 쓴다.

---

## 1. 왜 Security 6인가

**인증(Authentication)** 은 누구인지 확인하는 것이고, **인가(Authorization)** 는 그 주체가 이 요청을 해도 되는지 판단하는 것이다.

Security 6는 `WebSecurityConfigurerAdapter`를 없애고 **`SecurityFilterChain` Bean**으로 체인을 선언한다. `antMatchers`는 `requestMatchers`로 바뀌었다. 메서드 보안은 `@EnableMethodSecurity`다.

JSON API는 세션 쿠키가 기본값이 아니다. CSRF·세션 정책을 API 기준으로 다시 정한다.

---

## 2. 세션 없는 API 골격

한 줄 정의: `SecurityFilterChain`은 요청이 컨트롤러에 닿기 전 **필터 순서와 허용 규칙**을 조립하는 설정이다.

```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(sm ->
                sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/actuator/health", "/api/auth/**",
                        "/v3/api-docs/**", "/swagger-ui/**")
                    .permitAll()
                .requestMatchers(HttpMethod.GET, "/api/posts/**").permitAll()
                .anyRequest().authenticated()
            )
            .httpBasic(Customizer.withDefaults());

        return http.build();
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```

**CSRF(Cross-Site Request Forgery)** 는 브라우저가 쿠키를 자동으로 보낼 때 위조 요청을 막는 보호다. 쿠키 세션이 없으면 보통 끈다. 쿠키 기반 로그인 웹앱에서 끄면 구멍이 난다.

비밀번호는 `PasswordEncoder`로만 저장한다. `httpBasic`은 데모용이다.

---

## 3. UserDetailsService

한 줄 정의: 로그인 식별자(이메일 등)로 **사용자와 권한**을 로드하는 포트다.

```java
@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserAccountRepository repository;

    public CustomUserDetailsService(UserAccountRepository repository) {
        this.repository = repository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserAccount account = repository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException(username));
        return User.builder()
                .username(account.getEmail())
                .password(account.getPasswordHash())
                .roles(account.getRole().name())
                .build();
    }
}
```

`.roles(...)`는 `ROLE_` 접두사를 붙인다. DB에 이미 `ROLE_USER`로 저장했다면 `.authorities(...)`를 쓴다.

---

## 4. JWT

한 줄 정의: **JWT(JSON Web Token)** 는 서명된 JSON 클레임이다. 서버가 세션을 저장하지 않고, 클라이언트가 `Authorization: Bearer`로 보낸다.

흐름: `POST /api/auth/login` → access(+ refresh) → 필터가 검증 → `SecurityContext`에 `Authentication`.

```java
public String createAccessToken(String subject, Collection<String> roles) {
    Instant now = Instant.now();
    return Jwts.builder()
            .subject(subject)
            .claim("roles", roles)
            .issuedAt(Date.from(now))
            .expiration(Date.from(now.plus(15, ChronoUnit.MINUTES)))
            .signWith(secretKey)
            .compact();
}
```

Access는 5~15분, Refresh는 HttpOnly 쿠키 또는 안전한 저장소에 두고 회전한다. 서명 키는 환경변수다. 라이브러리는 `jjwt` 또는 `spring-security-oauth2-jose`(Nimbus)다.

```java
@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtTokenProvider tokenProvider;

    public JwtAuthFilter(JwtTokenProvider tokenProvider) {
        this.tokenProvider = tokenProvider;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String token = resolveBearer(request);
        if (token != null && tokenProvider.valid(token)) {
            Authentication auth = tokenProvider.toAuthentication(token);
            SecurityContextHolder.getContext().setAuthentication(auth);
        }
        filterChain.doFilter(request, response);
    }
}
```

필터는 `UsernamePasswordAuthenticationFilter` 앞에 넣는다. 만료·서명 실패를 삼키고 통과시키면 익명으로 보호 자원에 닿는다.

자체 파서보다 **Authorization Server가 발급한 JWT를 Resource Server로 검증**하는 편이 안전하다.

---

## 5. 메서드 인가

URL 매처만으로는 리소스 소유권을 표현하기 어렵다.

```java
@PreAuthorize("hasRole('ADMIN')")
@DeleteMapping("/{id}")
public void delete(@PathVariable Long id) { }

@PreAuthorize("#email == authentication.name or hasRole('ADMIN')")
@GetMapping("/me/{email}")
public UserResponse me(@PathVariable String email) { }
```

소유권 검사는 서비스에서도 한 번 더 한다. 경로 변수만 믿으면 IDOR가 난다.

---

## 6. OAuth2 Resource Server / Login

**OAuth2 Resource Server**는 Keycloak·Auth0·Cognito·Spring Authorization Server가 준 JWT를 표준으로 검증한다.

```yaml
spring:
  security:
    oauth2:
      resourceserver:
        jwt:
          issuer-uri: https://auth.example.com/realms/demo
```

```java
http.oauth2ResourceServer(oauth2 -> oauth2.jwt(Customizer.withDefaults()));
```

브라우저 소셜 로그인은 OAuth2 Login(클라이언트)이다. API 서버의 Bearer 검증과 역할이 다르다.

```yaml
spring:
  security:
    oauth2:
      client:
        registration:
          google:
            client-id: ${GOOGLE_CLIENT_ID}
            client-secret: ${GOOGLE_CLIENT_SECRET}
            scope: openid, profile, email
```

---

## 7. CORS와 운영

SPA가 다른 오리진이면 `CorsConfigurationSource`를 명시한다. `*` origin과 `allowCredentials`는 브라우저가 거부한다.

```java
@Bean
CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration config = new CorsConfiguration();
    config.setAllowedOrigins(List.of("https://app.example.com"));
    config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE"));
    config.setAllowedHeaders(List.of("*"));
    config.setAllowCredentials(true);
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/api/**", config);
    return source;
}
```

Actuator는 `health` 외 노출을 줄이고 인증한다. 로그인에는 rate limit을 둔다.

---

## 8. 테스트와 흔한 실수

```java
@WebMvcTest(controllers = UserController.class)
@Import(SecurityConfig.class)
class UserControllerSecurityTest {

    @Autowired MockMvc mockMvc;

    @Test
    @WithMockUser(roles = "USER")
    void userCannotDelete() throws Exception {
        mockMvc.perform(delete("/api/users/1"))
                .andExpect(status().isForbidden());
    }
}
```

| 실수 | 대안 |
|------|------|
| CSRF를 쿠키 세션 웹에서 disable | 토큰/쿠키 설정 유지 |
| JWT를 localStorage에만 장기 보관 | 짧은 TTL + refresh 회전 |
| URL permit만 하고 소유권 미검사 | `@PreAuthorize` + 서비스 가드 |
| Swagger·Actuator 전부 permitAll | 운영에서 제한 |
| 평문 비밀번호 | BCrypt |

---

## 연습

1. `/api/public/**`만 허용하고 나머지는 인증 필수로 둔다.
2. 회원가입 시 BCrypt로 저장한다.
3. JWT 필터 또는 Resource Server `issuer-uri`로 Bearer를 검증한다.
4. `@PreAuthorize`로 ADMIN 전용 삭제를 만든다.
