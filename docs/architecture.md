


# architecture.md

## 1. Overview

본 프로젝트는 **React + Spring Boot 기반의 웹 애플리케이션**으로, Docker 기반 컨테이너 환경에서 실행되도록 설계하였다.

Nginx를 Reverse Proxy로 사용하여 프론트엔드와 백엔드 요청을 처리하며, Redis를 이용해 JWT Refresh Token을 관리한다. 또한 GitHub Actions를 활용하여 CI/CD 파이프라인을 구축하였으며, Prometheus와 Grafana를 이용해 애플리케이션 및 인프라를 모니터링한다.

### Tech Stack

| Layer            | Technology                   |
| ---------------- | ---------------------------- |
| Frontend         | React, Vite                  |
| Backend          | Spring Boot, Spring Security |
| Database         | MySQL                        |
| Cache            | Redis                        |
| Reverse Proxy    | Nginx                        |
| Container        | Docker, Docker Compose       |
| CI/CD            | GitHub Actions               |
| Monitoring       | Prometheus, Grafana          |
| Future Extension | Kubernetes                   |



# 2. Architecture Diagram

```text
                      Browser
                          │
                          ▼
                    Nginx Reverse Proxy
                 ┌────────┴────────┐
                 ▼                 ▼
          React (Static)     Spring Boot API
                                    │
                    ┌───────────────┴───────────────┐
                    ▼                               ▼
                  MySQL                           Redis
                                                  │
                                           Refresh Token

        ┌───────────────────────────────────────────────┐
        │                 Prometheus                    │
        │        (Spring Boot / Nginx Metrics)          │
        └──────────────────────┬────────────────────────┘
                               ▼
                           Grafana
```



# 3. Component Overview

| Component       | Responsibility           |
| --------------- | ------------------------ |
| React           | 사용자 인터페이스 및 API 호출       |
| Spring Boot     | REST API 및 비즈니스 로직 처리    |
| Spring Security | 인증 및 인가 처리               |
| MySQL           | 영속 데이터 저장                |
| Redis           | Refresh Token 및 캐시 관리    |
| Nginx           | Reverse Proxy 및 정적 파일 제공 |
| Docker          | 애플리케이션 컨테이너화             |
| Docker Compose  | 개발 및 운영 환경 서비스 관리        |
| Prometheus      | 메트릭 수집                   |
| Grafana         | 모니터링 대시보드                |



# 4. Request Flow

## Login

```text
Browser
    │
    ▼
React
    │
    ▼
Nginx
    │
    ▼
Spring Security
    │
AuthenticationManager
    │
UserDetailsService
    │
MySQL
    │
사용자 인증 성공
    │
JWT Access Token 발급
    │
Refresh Token 생성 및 Redis 저장
    │
Client
```

## API Request

```text
Browser
    │
Access Token
    │
    ▼
Nginx
    │
    ▼
JWT Authentication Filter
    │
    ▼
Controller
    │
Service
    │
Repository
    │
MySQL
```



# 5. Authentication Flow

```text
             Login
               │
               ▼
   Access Token + Refresh Token 발급
               │
               ▼
        API 요청 (Access Token)
               │
               ▼
      Access Token 만료 여부 확인
               │
        ┌──────┴──────┐
        │             │
      No            Yes
        │             │
        ▼             ▼
     요청 처리   Refresh Token 검증
                     │
                  Redis 조회
                     │
        ┌────────────┴────────────┐
        │                         │
     유효함                   유효하지 않음
        │                         │
        ▼                         ▼
새 Access Token 발급          로그인 요청
```

### Design Rationale

* Access Token은 JWT 기반 Stateless 인증 방식으로 Redis나 DB 저장 없이 검증된다
* Refresh Token은 JWT 기반이지만 Redis에 저장된 JTI를 기준으로 세션처럼 상태를 관리한다
* Access Token은 완전 Stateless JWT이고, Refresh Token은 Redis 기반 JTI 검증으로 Stateful 세션처럼 동작하는 하이브리드 인증 구조다.
* Spring Security Filter를 통해 모든 요청에 대해 인증을 선처리하였다.
* 인증 실패 및 토큰 만료를 Filter 단계에서 처리하여 Controller의 책임을 최소화하였다.



# 6. Deployment Flow

Deployment is handled via Docker Compose and GitHub Actions.
Detailed flow is described in deployment.md.



# 7. Design Decisions

| Decision             | Reason                    |
| -------------------- | ------------------------- |
| JWT                  | Stateless 인증 구조           |
| Spring Security      | 인증 및 인가 처리                |
| Redis                | Refresh Token 저장 및 캐시     |
| Nginx                | Reverse Proxy 및 정적 리소스 제공 |
| Docker               | 실행 환경 일관성 확보              |
| Docker Compose       | 서비스 통합 배포                 |
| GitHub Actions       | CI/CD 자동화                 |
| Prometheus & Grafana | 운영 환경 모니터링                |
| Kubernetes           | 향후 수평 확장을 고려한 구조          |



# 8. Common Failure Points

| Issue                 | Description            |
| --------------------- | ---------------------- |
| JWT Refresh Loop      | Access Token 재발급 무한 반복 |
| Spring Security 403   | 권한 설정 오류               |
| Redis Connection      | Redis 연결 실패            |
| Nginx 502 Bad Gateway | 백엔드 서비스 장애             |
| Docker Network        | 컨테이너 간 네트워크 설정 오류      |



# 9. Related Documents

* deployment.md
* security.md
* monitoring.md
* docker.md
* troubleshooting/




