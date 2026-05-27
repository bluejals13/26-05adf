# 백엔드

## 사용 패키지 버전

```bash

├── user
│   ├── controller
│   │   └── UserController.java
│   │
│   ├── service
│   │   └── UserService.java
│   │
│   ├── repository
│   │   └── UserRepository.java
│   │
│   ├── entity
│   │   └── User.java
│   │
│   ├── dto
│   │   ├── SignupRequest.java
│   │   ├── LoginRequest.java
│   │   ├── UserResponse.java
│   │   └── UpdatePasswordRequest.java
│   │
│   └── exception
│       ├── DuplicateUserException.java
│       └── UserNotFoundException.java

# 나중에 보안으로 모듈화 준비 중 (나중에 jwt Resolver 추가)

 ├── jwt
 │    └── JwtProvider
 ├── security
 │    ├── JwtAuthenticationFilter
 │    ├── CustomUserPrincipal
 │    └── SecurityConfig

# 빼거나 따로 쓰거나

├── PageController.java

```


## 1. 도커파일
```bash
# 빌드 환경
FROM gradle:8.1-jdk17 AS build
WORKDIR /app
COPY . .

RUN chmod +x gradlew
RUN ./gradlew build --no-daemon

# 실행 환경
FROM eclipse-temurin:17-jre AS runtime
WORKDIR /app
COPY --from=build /app/build/libs/*.jar app.jar

EXPOSE 8080

# non-root user
RUN addgroup --system app && adduser --system --ingroup app app

USER app

# JVM 옵션
ENTRYPOINT ["java",
"-XX:+UseContainerSupport",
"-XX:MaxRAMPercentage=75",
"-jar",
"app.jar"]
```
이미지 크기 Gradle 리셋
보안 향상	Build Tool 제거
운영 최적화	Runtime 전용
캐시 효율	Layer 분리


## 2. 빌드.gradle 의존성
```bash
# Actuator + Prometheus 의존성
implementation 'org.springframework.boot:spring-boot-starter-actuator'
implementation 'io.micrometer:micrometer-registry-prometheus'

# Validation 의존성
implementation 'org.springframework.boot:spring-boot-starter-validation'
```
모니터링 및 "서버 상태를 관측 가능"
DTO Validation 으로 관리


## 3. 도커-컴포즈.yml 에서 백엔드 env 설정
```bash
    environment:
      JWT_SECRET: ${JWT_SECRET}
      JWT_EXPIRATION: ${JWT_EXPIRATION}
      SPRING_DATASOURCE_URL: ${SPRING_MYSQL_URL}
      SPRING_DATASOURCE_USERNAME: ${MYSQL_USER}
      SPRING_DATASOURCE_PASSWORD: ${MYSQL_PASSWORD}

  healthcheck:
      test: ["CMD-SHELL", "curl -f http://localhost:8080/actuator/health || exit 1"]
      interval: 10s
      timeout: 5s
      retries: 5
```
도커컴포즈 environ > 로 환경변수 화


## 4. 앱.yml 에서
```bash
spring:
  application:
    name: demo

  datasource:
    url: ${SPRING_DATASOURCE_URL}
    username: ${SPRING_DATASOURCE_USERNAME}
    password: ${SPRING_DATASOURCE_PASSWORD}

  jpa:
    hibernate:
      ddl-auto: update

    show-sql: true

jwt:
  secret: ${JWT_SECRET}
  expiration: ${JWT_EXPIRATION:3600000}

management:
  endpoints:
    web:
      exposure:
        include: prometheus,health,info
```
compose service name. > Docker DNS
profile , ddl-자동 : 수정 or validate 로 일반 , dev , prod 으로 파일 나눔
