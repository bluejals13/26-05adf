# Security Package

JWT 기반 인증/인가를 처리하는 패키지.

---

# 구조

```text id="yjlwm2"
security
├── CustomUserPrincipal.java
├── JwtAuthenticationFilter.java
└── SecurityConfig.java
```

---

# 인증 흐름

```text id="j8g3al"
Client Request
    ↓
JwtAuthenticationFilter
    ↓
JWT 검증
    ↓
SecurityContext 저장
    ↓
Controller
```

---

# 1. CustomUserPrincipal

인증된 사용자 정보를 저장하는 객체.

## 역할

* 로그인 사용자 식별
* SecurityContext 내부 저장

## 필드

| Field  | Type |
| ------ | ---- |
| userId | Long |

## 예시

```java id="jq1u4q"
CustomUserPrincipal principal =
    new CustomUserPrincipal(userId);
```

---

# 2. JwtAuthenticationFilter

JWT 인증을 처리하는 필터.

## 주요 기능

| 기능                      | 설명                 |
| ----------------------- | ------------------ |
| Authorization Header 확인 | Bearer Token 추출    |
| JWT 검증                  | 토큰 유효성 확인          |
| 사용자 인증 등록               | SecurityContext 저장 |
| 인증 제외 처리                | `/api/auth/**` 허용  |

## 처리 흐름

```text id="mckv2d"
Request
  ↓
Bearer Token 확인
  ↓
JWT validate()
  ↓
Authentication 생성
  ↓
SecurityContext 저장
```

---

# 3. SecurityConfig

Spring Security 설정 클래스.

## 주요 설정

| 설정                | 설명            |
| ----------------- | ------------- |
| csrf.disable()    | CSRF 비활성화     |
| STATELESS         | 세션 미사용        |
| requestMatchers() | 인증 제외 URL     |
| addFilterBefore() | JWT Filter 등록 |
| PasswordEncoder   | BCrypt 사용     |

## JWT Filter 등록

```java id="hwlyzn"
.addFilterBefore(
    jwtAuthenticationFilter,
    UsernamePasswordAuthenticationFilter.class
)
```

---

# PasswordEncoder

```java id="m7o1g6"
@Bean
public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
}
```

---

# Build

```bash id="ldp52u"
./gradlew clean build
```

# Run

```bash id="06bw1u"
./gradlew bootRun
```
