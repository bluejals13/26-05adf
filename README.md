

# Production-Inspired Full-Stack DevOps Platform



## 1. Overview

본 프로젝트는 React와 Spring Boot 기반의 웹 서비스를 개발하고,
Spring Security 기반 JWT 인증과 RBAC(Role-Based Access Control)를 구현한
풀스택 프로젝트입니다.

서비스는 Docker Compose 환경으로 통합 구성하였으며,
Nginx Reverse Proxy, Redis 기반 Refresh Token 관리,
GitHub Actions CI/CD, Prometheus·Grafana 모니터링을 적용하여
운영 환경까지 고려한 구조를 구현했습니다.



## 2. Tech Stack

| Layer | Technology |
|--------|------------|
| Backend | Spring Boot, Spring Security, Spring Data JPA |
| Authentication | JWT, RBAC |
| Frontend | React, Vite |
| Database | MySQL |
| Cache | Redis |
| Reverse Proxy | Nginx |
| Container | Docker, Docker Compose |
| CI/CD | GitHub Actions |
| Monitoring | Prometheus, Grafana |




## 3. Key Features

### Backend

- REST API 개발
- Spring Boot 기반 계층형 구조
- Spring Security 인증 및 인가
- JWT Access / Refresh Token 인증
- RBAC(Role & Permission) 권한 관리
- Global Exception Handler 적용
- JPA 기반 데이터 접근 계층 구현

### Infrastructure

- Docker Compose 기반 통합 실행
- Nginx Reverse Proxy
- Redis Refresh Token 관리
- GitHub Actions CI/CD
- Prometheus + Grafana Monitoring




## 4. System Architecture

```md

Browser
    │
Cloudflare (CDN / HTTPS)
    │
Nginx (Reverse Proxy)
 ├────────► React
 └────────► Spring Boot
                 │
        ┌────────┴────────┐
        ▼                 ▼
     MySQL             Redis

Monitoring
Spring Boot
      │
Prometheus
      │
Grafana

```

Browser  
→ Cloudflare (CDN)  
→ Nginx (Reverse Proxy)  
→ Spring Boot API  
→ MySQL / Redis  

Monitoring: Prometheus → Grafana




## 5. Project Highlights

- Spring Boot 기반 REST API
- Spring Security + JWT 인증
- RBAC 권한 관리
- Redis Refresh Token 관리
- Docker Compose 운영 환경
- Nginx Reverse Proxy
- GitHub Actions CI/CD
- Prometheus + Grafana Monitoring




## 6. Documentation

| Document | Description |
|-----------|-------------|
| [architecture.md](docs/architecture.md) | 시스템 아키텍처 |
| [deployment.md](docs/deployment.md) | 배포 절차 |
| [DESIGN_DECISIONS.md](docs/DESIGN_DECISIONS.md) | 설계 의사결정 |
| [Design Decisions Index](docs/design-decisions/README.md) | Design Decisions |
| [Architecture](docs/architecture/architecture.md) | Architecture |
| [Deployment Guide](docs/deployment/deployment.md) | Deployment |
| [Monitoring](docs/monitoring/monitoring.md) | Monitoring |
| [Troubleshooting](docs/troubleshooting/README.md) | Troubleshooting |


## 7. Repository Structure


```text
26-05adf/
├── docs/                  	# Architecture, Deployment, Security
├── APMS.SR/
│   ├── backend/           # Spring Boot API
│   ├── frontend/          	# React Application
│   ├── .github/           	# GitHub Actions Workflow
│   ├── k6/                	# Performance Test Scripts
│   └── docker-compose.yml
└── README.md
```





## 8. Quick Start

```bash
# Clone
git clone https://github.com/bluejals13/26-05adf.git

# Move
cd APMS.SR/dev

# Start
docker compose up -d

# Stop
docker compose down
````



## 9. Future Improvements

```md
## Future Improvements

- Kubernetes(EKS) 기반 운영 확장
- Loki 기반 중앙 로그 수집
- GitOps(ArgoCD) 적용
- Blue-Green Deployment
- Alertmanager 기반 알림 자동화
```



Quick Start > Future Improvements

