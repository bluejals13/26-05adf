
# SRE Skeleton Project

Production-inspired Full-Stack DevOps Platform



## 1. Overview

본 프로젝트는 React + Spring Boot 기반의 풀스택 웹 서비스를  
Docker 기반으로 컨테이너화하고, CI/CD 및 모니터링까지 포함한  
DevOps/SRE 구조를 구현한 포트폴리오 프로젝트이다.

Nginx를 Reverse Proxy로 사용하여 트래픽을 통합 관리하며,  
Redis를 활용해 JWT Refresh Token을 처리한다.

또한 GitHub Actions를 통해 자동 배포를 구성하고,  
Prometheus / Grafana로 시스템 상태를 시각화한다.



## 2. Tech Stack

| Layer | Technology |
|------|-----------|
| Frontend | React, Vite |
| Backend | Spring Boot, Spring Security |
| Database | MySQL |
| Cache | Redis |
| Proxy | Nginx |
| CI/CD | GitHub Actions |
| Container | Docker, Docker Compose |
| Monitoring | Prometheus, Grafana |



## 3. System Architecture

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



## 4. Key Features

- JWT 기반 인증 / Refresh Token (Redis)
- Spring Security RBAC 권한 관리
- Nginx Reverse Proxy 구조
- Docker Compose 기반 통합 실행 환경
- GitHub Actions CI/CD 자동 배포
- Prometheus + Grafana 모니터링
- Cloudflare CDN + HTTPS 지원



## 5. Project Highlights

- Stateless 인증 구조 (JWT + Redis)
- Single Session + Token Blacklist 설계
- Production-like Docker Architecture
- Observability (Metrics + Dashboard)
- Kubernetes 확장 가능한 구조 설계



## 6. Repository Structure


```
project/
├── frontend/
├── backend/
├── docker/
├── docs/
│   ├── architecture.md
│   ├── deployment.md
│   ├── security/
│   ├── docker/
│   ├── monitoring/
│   └── troubleshooting/
└── README.md
````



## 7. Documentation

Architecture
- architecture.md

Deployment
- deployment.md

Security
- security/

Docker
- docker/

Monitoring
- monitoring/

Troubleshooting
- troubleshooting/



## 8. Quick Start

```bash
# Clone
git clone ...

# Start
docker compose up -d

# Access

Frontend
http://localhost

Backend
http://localhost:8080
````



## 9. Future Improvements

```md
## Future Improvements

- Kubernetes 기반 확장
- GitOps 적용
- Loki 기반 로그 수집
- Blue-Green Deployment
- Alerting 시스템 구축
```



README에는 Screenshots 또는 Architecture Diagram 이미지가 하나 있으면 훨씬 완성도가 높아집니다.

Overview > Architecture Diagram > Tech Stack >

Key Features > Repository Structure > Documentation >

Quick Start > Future Improvements

