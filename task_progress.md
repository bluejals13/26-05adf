# APMS.SR Refactoring & Optimization Task List
Date: 2026-08-26
Status: IN PROGRESS

## Phase 1: Backend (Spring Boot) Security & DTO 최적화
- [x] 1-1. `Entity`와 `DTO`의 엄격한 분리 (Record 타입 적용)
- [x] 1-2. JWT Token 검증 로직 최적화 및 Redis Blacklist 연동 점검
- [x] 1-3. Controller의 응답 포맷(ResponseDto) 통일 및 전역 예외 처리(GlobalExceptionHandler) 점검
- [x] 1-4. N+1 쿼리 문제 점검 및 JPA Fetch Join 최적화

## Phase 1.5: Core Documentation (아키텍처/가이드/컨벤션 최신화)
- [x] 1.5-1. `01_Architecture_and_Ports.md` (컨테이너 구조, 네트워크 트래픽 흐름, 포트 매핑 문서화)
- [x] 1.5-2. `02_Quick_Start.md` (Java 17 / Node 20 / Docker 기반 실행 가이드 문서화)
- [x] 1.5-3. `03_Backend_Conventions.md` (Record DTO, ApiResponse, GlobalExceptionHandler, JWT/Redis 규칙 문서화)
- [x] 1.5-4. `26-05adf-guideline` 저장소 동기화 완료 (architecture/, conventions/)

## Phase 2: Frontend (React) State & Auth 개선
- [x] 2-1. Zustand 기반의 JWT Access Token 상태 관리 점검 (새로고침 시 증발 방지)
- [ ] 2-2. React Query 캐싱 전략 확인 및 API 호출 중복 제거
      - Query staleTime / gcTime 정책 정립
      - mutation 후 관련 query invalidateQueries 적용
      - 페이지 진입/재포커스 시 불필요한 중복 요청 점검
      - 서버 데이터 변경 시 화면 갱신 전략 검토
      - 필요 시 SSE 기반 실시간 동기화 적용 여부 검토
- [ ] 2-3. Route Guard (Protected Route) 렌더링 최적화 및 깜빡임 현상 제거

## Phase 3: Infra & DevOps (Docker / Nginx) 안정화
- [ ] 3-1. `docker-compose.yml` 컨테이너 간 의존성(`depends_on`, `healthcheck`) 추가
- [ ] 3-2. Nginx 설정(`nginx.conf`) 내 보안 헤더 추가 및 API Rate Limiting 설정
- [ ] 3-3. Prometheus / Grafana 대시보드와 Spring Boot Actuator 연동 상태 점검

## Context Notes (AI Memory)
- Phase 1 (Backend 최적화), Phase 1.5 (Core Documentation) 및 Phase 2-1 (Frontend Zustand Auth 최적화) 완료:
  - 1-1. DTO Record 전환
  - 1-2. JWT Token & Redis Blacklist 최적화
  - 1-3. ApiResponse 공통 응답 포맷 및 GlobalExceptionHandler 전역 예외 처리 구축
  - 1-4. JPA @EntityGraph & Fetch Join을 통한 N+1 쿼리 방지 및 연관관계 지연 로딩 최적화
  - 1.5. 핵심 문서 3종 작성(`docs/`) 및 가이드라인 저장소(`26-05adf-guideline/`) 동기화 완료
  - 2-1. Zustand persist 연동, bootstrapAuth 게이트웨이 패턴, http.ts ApiResponse 언래핑 및 단일 비행(Single Flight) 재발급 구축 완료
- 다음 예정 작업: Phase 2-2 (React Query 캐싱 전략 확인 및 API 호출 중복 제거)