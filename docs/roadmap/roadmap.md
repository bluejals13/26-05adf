# Roadmap

| 순서 | 계획 | 관련 기준 문서 | 상태 |
|---|---|---|---|
| 01 | Refresh Token Rotation | `authentication.md` | ☐ |
| 02 | API Versioning | `api.md` | ☐ |
| 03 | Redis Cluster 검토 | `data-store.md` | ☐ |

# Troubleshooting Documentation Roadmap

| 순서 | 문서 | 핵심 장애 | 우선순위 | 상태 |
|---|---|---|---|---|
| 01 | `jwt-refresh-loop.md` | JWT 무한 재발급 / 인증 루프 | 🔴 최고 | ☐ |
| 02 | `spring-security-403.md` | 인증 성공 후 권한 거부 | 🔴 최고 | ☐ |
| 03 | `redis-connection.md` | Redis 연결 및 인증 상태 장애 | 🔴 최고 | ☐ |
| 04 | `nginx-502.md` | Reverse Proxy → Backend 연결 실패 | 🔴 최고 | ☐ |
| 05 | `docker-compose-network.md` | 컨테이너 간 네트워크 통신 실패 | 🔴 최고 | ☐ |
| 06 | `oom-memory.md` | 메모리 부족 및 OOM 대응 | 🔴 최고 | ☐ |
| 07 | `github-actions-deploy.md` | CI/CD 배포 실패 | 🟠 높음 | ☐ |
| 08 | `database-migration.md` | DB Migration / Schema 오류 | 🟠 높음 | ☐ |
| 09 | `cors-configuration.md` | CORS 정책 오류 | 🟠 높음 | ☐ |
| 10 | `container-healthcheck.md` | Container 비정상 상태 | 🟠 높음 | ☐ |
| 11 | `prometheus-metrics.md` | 모니터링 데이터 수집 실패 | 🟠 높음 | ☐ |
| 12 | `docker-volume.md` | 데이터 영속성 / Volume 문제 | 🟡 보통 | ☐ |
| 13 | `nginx-static-file.md` | React 정적 파일 / SPA Routing 오류 | 🟡 보통 | ☐ |
| 14 | `port-firewall.md` | 포트 / 방화벽 / 외부 접근 실패 | 🟡 보통 | ☐ |
| 15 | `log-analysis.md` | 로그 기반 장애 원인 분석 | 🔴 공통 | ☐ |

