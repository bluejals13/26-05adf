# Compose 핵심 구조

React(Vite) + Spring Boot + MySQL 기반 서비스를 Docker Compose로 통합하고,
Nginx Reverse Proxy·Redis Cache·Prometheus/Grafana 모니터링까지 포함한
실전형 DevOps/SRE 포트폴리오 프로젝트입니다.

## 1. Nginx Reverse Proxy
```bash
nginx:
  build:
    context: .
    dockerfile: nginx/Dockerfile

  ports:
    - "80:80"

  depends_on:
    backend:
      condition: service_healthy
```
React 정적 파일 서빙
/api/* → Backend Proxy
Backend Health 상태 확인 후 실행


## 2. nginx/Dockerfile
```bash
# =========================
# 1. React Build Stage
# =========================
FROM node:20-alpine AS frontend-build

WORKDIR /app

# frontend 소스 복사
COPY ./frontend/ .

# 의존성 설치
RUN npm install

# React production build
RUN npm run build


# =========================
# 2. Nginx Stage
# =========================
FROM nginx:alpine

# React dist 복사
COPY --from=frontend-build /app/dist /usr/share/nginx/html

# nginx 설정 복사
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
```
| 항목                | 설명                      |
| ----------------- | ----------------------- |
| Multi-stage Build | Node 이미지와 Nginx 이미지를 분리 |
| 최적화               | 최종 이미지에 Node 미포함        |
| 정적 서빙             | React dist만 Nginx에 복사   |
| 운영형 구조            | Production 배포에 적합       |

## 3. nginx/default.conf
```bash
server {
    listen 80;

    server_name localhost;

    root /usr/share/nginx/html;
    index index.html;

    # gzip 압축
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;

    # 보안 헤더
    add_header X-Frame-Options SAMEORIGIN;
    add_header X-Content-Type-Options nosniff;


    # =========================
    # React SPA Routing    Nginx가 404 발생 > fallback 시키고 리액트 처리
    # =========================
    location / {
        try_files $uri $uri/ /index.html;
    }

    # =========================
    # Spring Boot API Proxy    localhost > backend 전달
    # =========================
    location /api/ {
        proxy_pass http://backend:8080;
    }
}
```
정적 파일 서빙 성능 우수
Reverse Proxy 가능
SPA 라우팅 대응 가능
Backend와 Frontend 통합 가능
