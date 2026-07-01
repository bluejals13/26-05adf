



# deployment.md

## 1. Overview

본 프로젝트는 Docker 기반 환경에서 배포된다.

GitHub Actions를 통해 CI/CD가 자동화되어 있으며,
Docker Compose 기반으로 서비스가 실행된다.

### Deployment Objectives

* 자동화된 빌드 및 배포
* 개발 환경과 운영 환경의 일관성 확보
* 서비스 중단 최소화
* 이미지 기반 배포 및 롤백 지원
* 향후 Kubernetes 환경으로 확장 가능한 구조



## 2. Deployment Architecture

```text
CI/CD Pipeline Flow

1. Git Push
2. GitHub Actions Trigger
3. Build & Test
4. Docker Image Build
5. Docker Image Push
6. Server Pull
7. Docker Compose Up
```



## 3. Deployment Flow

### Continuous Integration (CI)

```text
Source Code
      │
Source Checkout
      │
Build
      │
Test
      │
Docker Image Build
      │
Image Push
```

### Continuous Deployment (CD)

```text
Deployment Server
        │
Pull Latest Image
        │
Replace Container
        │
Health Check
        │
Deployment Complete
```



## 4. Docker Build Strategy

### Frontend

```text
React Source
      │
npm install
      │
npm run build
      │
Nginx Image
```

빌드 전용 스테이지와 실행 스테이지를 분리하는 Multi-stage Build를 사용하여 정적 파일만 포함된 경량 이미지를 생성하였다.

### Backend

```text
Spring Boot Source
        │
Gradle Build
        │
Executable JAR
        │
OpenJDK Runtime
        │
Application Start
```

빌드 환경과 실행 환경을 분리하여 이미지 크기를 줄이고 보안성을 높였다.



## 5. Container Deployment

Docker Compose 실행 순서

1. MySQL (DB 먼저 기동)
2. Redis (캐시/세션)
3. Spring Boot (API Server)
4. Nginx (Reverse Proxy)



## 6. Environment Configuration

환경별 설정은 `.env` 파일과 Docker Compose 환경 변수를 이용하여 분리하였다.

| Environment | Purpose  |
| ----------- | -------- |
| Development | 로컬 개발 환경 |
| Production  | 운영 환경    |

### Environment Variables

* Database URL
* Redis Host
* JWT Secret Key
* Spring Profile
* Server Port

민감한 정보는 소스 코드에 포함하지 않고 환경 변수로 관리하였다.



## 7. CI/CD Strategy

GitHub Actions Pipeline

1. Code Checkout
2. Build
3. Test
4. Docker Image Build
5. Push to Registry
6. Deploy Server
7. Health Check



## 8. Rollback Strategy

```text
Current Deployment
        │
Deployment Failure
        │
Previous Image
        │
Container Restart
        │
Service Recovery
```

### Rollback Policy

* 이미지 태그 기반 버전 관리
* 이전 이미지 재배포 지원
* 서비스 복구 시간 최소화



## 9. Deployment Checklist

### Before Deployment

* Build 성공
* Test 성공
* 환경 변수 확인
* Docker Image 생성
* Registry Push 완료

### After Deployment

* Container 상태 확인
* API 정상 응답 확인
* Database 연결 확인
* Redis 연결 확인
* Health Check 통과
* Monitoring Dashboard 확인



## 10. Future Extension

Kubernetes 기반 배포로 확장 예정



## 11. Related Documents

* architecture.md
* docker.md
* security.md
* monitoring.md
* troubleshooting/




