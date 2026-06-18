현재 `docker-compose.yml` 기준으로 보면 실제 DEV 환경은 다음 컨테이너들로 구성됩니다.

* nginx
* backend (Spring Boot APMS)
* mysql
* redis
* prometheus
* grafana
* node-exporter
* cadvisor

그리고 Frontend는 현재 compose 상에서 주석 처리되어 있으며, nginx 내부에서 React Build 정적 파일을 서빙하는 구조로 보입니다. ([GitHub][1])

포트 및 역할을 기준으로 APMS 문서 스타일에 맞춰 작성하면 아래 형태가 가장 읽기 좋습니다.

---

# APMS Dev Environment Container Architecture

## Container Overview

| Container     | Role                | Description                          |
| ------------- | ------------------- | ------------------------------------ |
| nginx         | Gateway             | Reverse Proxy 및 SPA 정적 파일 제공         |
| backend       | Application         | Spring Boot 기반 APMS API 서버           |
| mysql         | Database            | 사용자, 권한, 감사 로그 저장                    |
| redis         | Cache / Token Store | Refresh Token, Blacklist, Session 저장 |
| prometheus    | Monitoring          | 메트릭 수집                               |
| grafana       | Monitoring UI       | 대시보드 시각화                             |
| node-exporter | Host Metrics        | 서버 리소스 수집                            |
| cadvisor      | Container Metrics   | Docker 컨테이너 메트릭 수집                   |

---

# Network Topology

```text
Browser
   │
   ▼
Nginx
   │
   ├────────► React SPA
   │
   └────────► Backend API
                     │
          ┌──────────┴─────────┐
          ▼                    ▼
       MySQL                Redis

Backend
   │
   ▼
Spring Actuator
   │
   ▼
Prometheus
   │
   ▼
Grafana

node-exporter
cadvisor
   │
   ▼
Prometheus
```

---

# Nginx Container

## 역할

APMS 전체 서비스의 단일 진입점(Gateway)

## 책임

| 기능              | 설명                       |
| --------------- | ------------------------ |
| Reverse Proxy   | API 요청 전달                |
| Static Serving  | React Build 파일 제공        |
| Routing         | Frontend / Backend 분기    |
| SSL Entry Point | Cloudflare 연동 시 HTTPS 종단 |
| Security Header | 보안 헤더 설정 가능              |
| Rate Limiting   | API 요청 제한 가능             |

## 요청 흐름

```text
https://apms.example.com

        ↓

      Nginx

        ↓

/api/*
        ↓
     Backend

/*
        ↓
 React Build
```

---

# Backend Container

## Container

```text
backend
```

## 역할

APMS 핵심 비즈니스 서버

## 주요 모듈

| Domain         | Responsibility |
| -------------- | -------------- |
| auth           | 인증             |
| iam            | 사용자/권한         |
| audit          | 감사 로그          |
| monitoring     | 운영 모니터링        |
| common         | 공통 모듈          |
| infrastructure | Redis 및 외부 연동  |

---

## Backend API 구성

### Auth

| API                    | 설명     |
| ---------------------- | ------ |
| POST /api/auth/login   | 로그인    |
| POST /api/auth/logout  | 로그아웃   |
| POST /api/auth/refresh | 토큰 재발급 |

### User

| API                          | 설명     |
| ---------------------------- | ------ |
| GET /api/users               | 사용자 조회 |
| GET /api/users/{id}          | 상세 조회  |
| POST /api/users              | 사용자 생성 |
| PUT /api/users/{id}          | 사용자 수정 |
| PATCH /api/users/{id}/status | 상태 변경  |

### Role

| API                    | 설명    |
| ---------------------- | ----- |
| GET /api/roles         | 역할 목록 |
| POST /api/roles        | 역할 생성 |
| PUT /api/roles/{id}    | 역할 수정 |
| DELETE /api/roles/{id} | 역할 삭제 |

### Permission

| API                          | 설명    |
| ---------------------------- | ----- |
| GET /api/permissions         | 권한 목록 |
| POST /api/permissions        | 권한 생성 |
| PUT /api/permissions/{id}    | 권한 수정 |
| DELETE /api/permissions/{id} | 권한 삭제 |

### Menu

| API                    | 설명    |
| ---------------------- | ----- |
| GET /api/menus         | 메뉴 조회 |
| POST /api/menus        | 메뉴 생성 |
| PUT /api/menus/{id}    | 메뉴 수정 |
| DELETE /api/menus/{id} | 메뉴 삭제 |

### Audit

| API                    | 설명       |
| ---------------------- | -------- |
| GET /api/audit/logs    | 감사 로그 조회 |
| GET /api/audit/history | 변경 이력 조회 |

---

# Redis Container

## 역할

인증 상태 저장소

## 저장 데이터

| Key              | Value          |
| ---------------- | -------------- |
| refresh:{userId} | Refresh Token  |
| blacklist:{jti}  | 폐기 JWT         |
| session:{userId} | Active Session |
| cache:user:{id}  | 사용자 캐시         |

## 인증 구조

```text
Login
   ↓
Refresh Token 발급
   ↓
Redis 저장

API 요청
   ↓
JWT 검증
   ↓
Redis Blacklist 확인
   ↓
Redis Active Session 확인
```

---

# MySQL Container

## 역할

영속 데이터 저장

## 주요 테이블

| Table            | Description |
| ---------------- | ----------- |
| users            | 사용자         |
| roles            | 역할          |
| permissions      | 권한          |
| user_roles       | 사용자-역할      |
| role_permissions | 역할-권한       |
| menus            | 메뉴          |
| audit_logs       | 감사 로그       |

---

# Monitoring Stack

## Prometheus

### 역할

메트릭 수집

### 수집 대상

| Target        | Metrics           |
| ------------- | ----------------- |
| Backend       | JVM               |
| Backend       | Request Count     |
| Backend       | Response Time     |
| Node Exporter | CPU               |
| Node Exporter | Memory            |
| cAdvisor      | Container Metrics |

---

## Grafana

### 역할

운영 대시보드

### Dashboard

| Dashboard | 목적           |
| --------- | ------------ |
| JVM       | Backend 상태   |
| Redis     | Redis 상태     |
| MySQL     | DB 상태        |
| Docker    | Container 상태 |
| Host      | 서버 상태        |

---

## Node Exporter

### 역할

Host 수준 모니터링

수집 항목

```text
CPU
Memory
Disk
Network
Load Average
```

---

## cAdvisor

### 역할

Docker 모니터링

수집 항목

```text
Container CPU
Container Memory
Container Network
Container I/O
```

---

# Frontend Container Structure

현재는 nginx 정적 서빙 구조를 기준으로 설명

## Frontend Auth Architecture

| Layer        | Responsibility |
| ------------ | -------------- |
| Zustand      | Access Token   |
| React Query  | User State     |
| Auth Service | Login / Logout |
| Route Guard  | 접근 제어          |
| RBAC         | 권한 계산          |

---

## Frontend API Flow

```text
Login Page
      │
      ▼
auth.service.login()
      │
      ▼
Backend Auth API
      │
      ▼
JWT 발급
      │
      ▼
Zustand 저장
      │
      ▼
GET /users/me
      │
      ▼
React Query Cache
      │
      ▼
Route Guard
      │
      ▼
Page Render
```

---

# APMS Dev Container Summary

| Layer                | Container     | Responsibility     |
| -------------------- | ------------- | ------------------ |
| Edge                 | Nginx         | Reverse Proxy      |
| Frontend             | React         | UI                 |
| Application          | Backend       | APMS Domain        |
| Cache                | Redis         | Token / Session    |
| Database             | MySQL         | Persistent Data    |
| Metrics              | Prometheus    | Metrics Collection |
| Dashboard            | Grafana       | Visualization      |
| Host Monitoring      | Node Exporter | Server Metrics     |
| Container Monitoring | cAdvisor      | Docker Metrics     |

이 형태가 포트폴리오·기술문서·면접 설명용으로 가장 실무적인 수준이며, IAM/Auth 아키텍처와 SRE 구조도를 자연스럽게 연결할 수 있는 문서 구성입니다.

[1]: https://github.com/bluejals13/26-05adf/blob/main/APMS.SR/dev/docker-compose.yml "26-05adf/APMS.SR/dev/docker-compose.yml at main · bluejals13/26-05adf · GitHub"
