# SRE Skeleton Project — myapp2my

React(Vite) + Spring Boot + MySQL 기반 서비스를 Docker Compose로 통합하고,
Nginx Reverse Proxy·Redis Cache·Prometheus/Grafana 모니터링까지 포함한
실전형 DevOps/SRE 포트폴리오 프로젝트입니다.

## 아키텍처 개요
브라우저 요청은 Nginx가 받아:

정적 파일은 React dist에서 직접 서빙
/api/* 요청은 Spring Boot Backend로 Reverse Proxy
Backend는 MySQL + Redis 사용
Prometheus + Grafana로 모니터링
Docker Health Check 기반으로 서비스 의존성 제어


# 핵심 설계 포인트

| 관점     | 적용 내용                                     |
| ------ | ----------------------------------------- |
| 보안     | DTO 분리, Entity 비노출, `.env` 분리           |
| 안정성    | Healthcheck + `service_healthy`             |
| 운영성    | Restart Policy 적용                         |
| 관측 가능성 | Prometheus + Grafana + Exporter            |
| 유지보수   | 계층 분리 (Controller / Service / Repository)|
| 확장성    | Redis Cache, Loki 확장 고려                   |
| 성능     | Redis 캐시 구조                               |
| 운영 자동화 | Docker Compose 기반 통합 운영                  |

# myapp2my


## 설치
```bash
# 1. gradle 설치
sudo snap install gradle --classic

# PATH 추가
echo 'export PATH=$PATH:/snap/bin' >> ~/.bashrc
source ~/.bashrc

# 2. gradle 종류
snap list gradle

# 3. gradle 위치
which gradle

# 4. gradle 버전
gradle -v



# 5. 자바 설치 17
sudo apt update
sudo apt install openjdk-17-jdk -y

# 6. 자바 위치
readlink -f $(which java)

# 7. 환경변수 기입
echo 'export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64' >> ~/.bashrc
echo 'export PATH=$JAVA_HOME/bin:$PATH' >> ~/.bashrc
source ~/.bashrc

# 8. 버전 확인
echo $JAVA_HOME
java -version




# 9. 노드 설치 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# 10. 프론트 에서 vite 템플릿 리액트
cd frontend
npm create vite@latest . -- --template react

# 11. 노드 버전 과 위치
node -v
npm -v
which node
which npm

```


## 빠른 시작

```bash
# 1. 환경 변수 설정
cp .env.example .env
# .env 파일에서 DB_PASSWORD 등 수정

# 2. 빌드 
cd ~/바탕화면/myapp2my/backend
gradle wrapper --gradle-version 8.1

./gradlew clean build --stacktrace

cd ~/바탕화면/myapp2my/frontend
npm run dev
npm run build

# 3. 전체 실행
docker compose down
docker compose build --no-cache
docker-compose up --build

# 5. 확인
open http://localhost          # 앱
curl http://localhost/actuator/health  # 헬스체크
```


## 프로젝트 구조
```bash
├── backend/
│   ├── src/main/java/com/example/backend/
│   │   ├── controller/     # HTTP 요청 처리, DTO 반환
│   │   ├── service/        # 비즈니스 로직, DTO ↔ Entity 변환
│   │   ├── repository/     # JPA Repository
│   │   ├── model/          # JPA Entity (내부용, API 미노출)
│   │   ├── dto/            # Request/Response 레코드
│   │   └── exception/      # GlobalExceptionHandler
│   ├── Dockerfile          # Multi-stage + non-root
│   └── build.gradle
├── frontend/
│   └── src/
│       ├── App.js          # React 
│       └── Dashboard.js    # React 컴포넌트
├── nginx/
│   ├── default.conf        # Reverse Proxy + SPA 라우팅 + 보안 헤더
│   └── Dockerfile
├── docker-compose.yml      # Healthcheck 기반 서비스 기동 순서 제어
├── .env                    # 민감 정보 (Git 제외)
└── .gitignore
```

