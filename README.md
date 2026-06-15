# SRE Skeleton Project - Containerized Full-Stack Service Platform

## Overview

React(Vite) + Spring Boot + MySQL 기반 웹 서비스를 Docker Compose 환경에서 통합 운영하며, Nginx Reverse Proxy, Redis Cache, Prometheus/Grafana 모니터링, GitHub Actions 기반 CI/CD를 적용한 DevOps/SRE 포트폴리오 프로젝트입니다.

본 프로젝트는 단순한 CRUD 애플리케이션 구현을 넘어, 실제 서비스 운영 환경을 고려하여 배포 자동화, 모니터링, 네트워크 구성, 컨테이너 기반 운영 구조를 직접 설계하고 구축하는 것을 목표로 하였습니다.

---

# Project Goals

| 목표          | 내용                                     |
| ----------- | -------------------------------------- |
| 분리 아키텍처 구성  | Frontend / Backend / Database 분리 구조 설계 |
| 통합 운영 환경    | Docker Compose 기반 컨테이너 통합 실행 환경 구축     |
| 인증/인가       | JWT 기반 인증 및 권한 관리 시스템 적용               |
| 캐시/토큰 저장소   | Redis를 활용한 캐싱 및 토큰 저장 관리               |
| 트래픽 라우팅     | Nginx Reverse Proxy 기반 서비스 라우팅 구성      |
| CI/CD 자동화   | GitHub Actions 기반 배포 및 빌드 자동화          |
| CDN / HTTPS | Cloudflare를 활용한 CDN 및 SSL(HTTPS) 적용    |
| 모니터링        | Prometheus / Grafana 기반 시스템 모니터링 구축    |


---

# Architecture

Browser
↓
Cloudflare CDN / Edge
↓
Nginx Reverse Proxy
├── React Frontend
└── Spring Boot API
│
├── MySQL
└── Redis

Spring Actuator
↓
Prometheus
↓
Grafana

node-exporter
cAdvisor

---

# Tech Stack

| 영역                | 기술                                                    |
| ----------------- | ----------------------------------------------------- |
| Frontend          | React, TypeScript, Vite                               |
| Backend           | Spring Boot, Spring Security, JPA, JWT Authentication |
| DB                | MySQL 8                                               |
| Cache             | Redis 7                                               |
| Proxy             | Nginx                                                 |
| Infra             | Docker, Docker Compose, WSL                           |
| Monitoring        | Prometheus, Grafana                                   |
| Metrics           | Spring Actuator                                       |
| Host Metrics      | node-exporter                                         |
| Container Metrics | cAdvisor                                              |
| DevOps            | Git, GitHub Actions, Cloudflare                       |


---

# Key Design Decisions

## Authentication & Authorization

### 적용 내용

* JWT Access Token 기반 인증
* JWT Refresh Token 기반 재발급 구조
* Redis 기반 Refresh Token 저장 및 검증
* Redis Token Blacklist 적용
* JWT JTI(Unique Token ID) 기반 토큰 식별
* Redis Active Session(JTI) 관리
* Single Session 정책 적용 (중복 로그인 방지)
* 강제 로그아웃 지원
* Refresh Token 타입 검증
* Spring Security 기반 RBAC(Role-Based Access Control)

### 인증 흐름

1. 로그인 성공 시 Access Token / Refresh Token 발급
2. Refresh Token을 Redis에 저장
3. Access Token의 JTI를 Redis Active Session에 저장
4. 요청 시 JWT 서명 및 유효성 검증
5. Redis Blacklist 여부 확인
6. Active Session(JTI) 검증
7. 검증 성공 시 SecurityContext에 인증 정보 저장

### 기대 효과

* Stateless 인증 구조 구현
* 서버 확장 시 세션 공유 문제 제거
* Redis 기반 토큰 무효화 지원
* 강제 로그아웃 구현 가능
* 이전 로그인 세션 자동 무효화
* 탈취된 Access Token 사용 위험 감소
* Refresh Token 재검증을 통한 보안 강화
* 인증 서버 수평 확장 용이


---

## Containerized Deployment

각 서비스를 독립 컨테이너로 분리하여 운영

* frontend
* backend
* mysql
* redis
* nginx
* prometheus
* grafana

### 기대 효과

* 환경 일관성 확보
* 배포 단순화
* 서비스 독립성 향상

---

## Monitoring

Spring Actuator를 활용하여 애플리케이션 메트릭을 수집하고, Prometheus를 통해 저장 및 Grafana Dashboard로 시각화

수집 대상:

* JVM Memory
* CPU Usage
* Request Count
* Response Time
* Container Metrics
* Host Metrics

---

## CI/CD Pipeline

Git Push
↓
GitHub Actions
↓
Application Build
↓
Docker Image Build
↓
Docker Compose Deploy

### 기대 효과

* 반복 작업 자동화
* 배포 오류 감소
* 운영 효율 향상

---

## Cloudflare Integration

* CDN Cache
* HTTPS
* DNS Management
* Edge Network

### 기대 효과

* 응답 속도 향상
* 보안 강화
* 글로벌 접근성 향상

---

# Troubleshooting Examples

## JWT Token Expiration

문제

* Access Token 만료 시 사용자 인증 실패

해결

* Refresh Token 재발급 구조 적용
* Redis 기반 토큰 관리

---

## Service Startup Dependency

문제

* Backend가 DB보다 먼저 실행

해결

* Docker Healthcheck
* depends_on + service_healthy 적용

---

# Service Components

| Service       | Description             |
| ------------- | ----------------------- |
| nginx         | Reverse Proxy           |
| frontend      | React Application       |
| backend       | Spring Boot API         |
| mysql         | Primary Database        |
| redis         | Cache Server            |
| prometheus    | Metrics Collection      |
| grafana       | Visualization Dashboard |
| node-exporter | Host Metrics            |
| cadvisor      | Container Metrics       |

---

# Future Improvements

* Loki 기반 로그 수집
* Alertmanager 기반 장애 알림
* Kubernetes 환경 확장
* GitOps 기반 운영 자동화
* Blue-Green Deployment 적용

---

# What I Learned

본 프로젝트를 통해 단순 애플리케이션 개발뿐 아니라,

* 서비스 아키텍처 설계
* 컨테이너 기반 운영
* 모니터링 구축
* CI/CD 자동화
* CDN 및 네트워크 구성

등 실제 운영 환경에 필요한 DevOps/SRE 역량을 경험할 수 있었습니다.


# JWT + HS256

## Session이 아닌가 
- 확장성을 고려하기 위해서 동시에 redis 와 db 의 부하율 고려

## RS256이 아닌지 (선택 이유까지)
- 키 관리 복잡도보다 단순성과 운영 편의성이 더 중요하기에 이며,
- 일반적인 기업은 금융권의 수준 보안은 오히려 최적화에 지장이 생긴다
- 운영 복잡도 대비 이득이 크지 않음


# 토큰 redis, Refresh, Blacklist 부분

## Redis
- 응답 속도, db 부하 감소
- 리프레시 로 인증 계열 시간 검수

## Refresh Token
- 로그인 상태 관리
- “로그아웃 / 강제 만료” 등 로직 검수용 ttl

## Blacklist
- jwt 폐기 난해함 > 토큰 탈취 시 대응
- JTI 저장 이후 Blacklist 등록 으로 각 계정 jwt 검수 가능

-- 이로써 Redis 는 상태 저장소의 역할을 담당 시킬 수 있다(향후 조절 가능)
--> 고객 별 보안 수준 고도화 가능


# Spring Security

## 인증(Authentication)
- JWT Filter에서 처리
- PrincipalCustom 식별 및 보안Config 저장

## 인가(Authorization)
- Role 기반 접근 제어 (RBAC)
- URL / Method 단위 권한 체크 및 API 사용 허가

## 구조 분리 정리
Filter 레벨: 인증
Security Layer: 인가


# 트레이드오프

## Redis vs DB
| 항목     | Redis | DB     |
| ------ | ----- | ------ |
| 속도     | 빠름    | 느림     |
| TTL 지원 | O     | X      |
| 사용 목적  | 세션/토큰 | 영구 데이터 |

## JWT vs Session
| 항목   | JWT       | Session  |
| ---- | --------- | -------- |
| 상태   | Stateless | Stateful |
| 확장성  | 높음        | 낮음       |
| 로그아웃 | 어려움       | 쉬움       |

## Docker vs K8s (왜 아직 안 썼는지 포함)
- 빠른 구성과 개발 편의성 , 운영 복잡도 낮음
- 오버엔지니어링 , 클러스터 운영 필요 없음
-> 확장 시에는 K8s 호환성 고려 풀상태 db, redis, lgtm /으로 db 마이그레이션 및 pod crash 문제 고려

## Nginx 역할
- Reverse Proxy
- 정적 파일 서빙 (React build)
- API 라우팅 (/api → backend)
- SSL termination (Cloudflare와 함께)
-> 즉 “단일 진입점 Gateway 역할”

# 장애 시나리오

## Redis down
- Blacklist 체크 불가 > 즉시 인증 실패 처리
- 로그인 상태 관리 불가 > Redis 복구 후 재로그인 유도
-> “보안 > 가용성”

## DB slow
- Redis 캐시로 read 부하 감소
- connection pool tuning
- slow query index 최적화

## Token 탈취
- Access Token short TTL
- Redis JTI
-> "탈취되어도 오래 못 쓰게 휘발성으로 설계”

## API 폭주
- Nginx rate limiting
- Redis caching
- Spring thread pool 제한
- stateless 확장 가능 구조
-> 현재 비즈니스 서비스 에서 가장 큰 수정없이 이어서 자연스럽게 대응 처리 가능
