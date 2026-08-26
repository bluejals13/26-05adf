# APMS.SR Refactoring & Optimization Task List
Date: 2026-08-26
Status: IN PROGRESS

## Phase 1: Backend (Spring Boot) Security & DTO 최적화
- [x] 1-1. `Entity`와 `DTO`의 엄격한 분리 (Record 타입 적용)
- [x] 1-2. JWT Token 검증 로직 최적화 및 Redis Blacklist 연동 점검
- [ ] 1-3. Controller의 응답 포맷(ResponseDto) 통일 및 전역 예외 처리(GlobalExceptionHandler) 점검
- [ ] 1-4. N+1 쿼리 문제 점검 및 JPA Fetch Join 최적화

## Phase 2: Frontend (React) State & Auth 개선
- [ ] 2-1. Zustand 기반의 JWT Access Token 상태 관리 점검 (새로고침 시 증발 방지)
- [ ] 2-2. React Query 캐싱 전략 확인 및 API 호출 중복 제거
- [ ] 2-3. Route Guard (Protected Route) 렌더링 최적화 및 깜빡임 현상 제거

## Phase 3: Infra & DevOps (Docker / Nginx) 안정화
- [ ] 3-1. `docker-compose.yml` 컨테이너 간 의존성(`depends_on`, `healthcheck`) 추가
- [ ] 3-2. Nginx 설정(`nginx.conf`) 내 보안 헤더 추가 및 API Rate Limiting 설정
- [ ] 3-3. Prometheus / Grafana 대시보드와 Spring Boot Actuator 연동 상태 점검

## Context Notes (AI Memory)
- Phase 1-1 완료: RoleRequest, RoleResponse, PermissionResponse, AuditResponse를 Java Record 타입으로 변환 및 서비스/테스트 코드 검증 완료.
- 다음 예정 작업: Phase 1-2 (JWT Token 검증 로직 최적화 및 Redis Blacklist 연동 점검)