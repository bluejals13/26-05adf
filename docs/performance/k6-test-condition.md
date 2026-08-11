# k6 Test Condition

## 1. Test Objective

실제 사용자 행동 패턴을 기반으로 API의 부하 처리 성능과
주요 비즈니스 흐름의 정상 동작을 검증한다.

## 2. Test Scenario

### User Flow
- 로그인
- JWT 인증
- 사용자 API 조회
- 메뉴 조회

### Admin Flow
- 로그인
- 사용자 상태 변경
- 메뉴 생성
- 메뉴 조회
- 생성 데이터 식별
- 메뉴 삭제

## 3. User Distribution

| Scenario | Ratio |
|---|---:|
| User | 50% |
| Read | 40% |
| Admin | 10% |

## 4. Load Profile

| Test | VU | Duration | Purpose |
|---|---:|---:|---|
| Load | 50 | 2m | 일반 부하 |
| Stress | 70 | 1m | 동시 사용자 증가 |
| Stress Re-test | 70 | 1m × 3 | 결과 재현성 |

## 5. Authentication

- JWT Access Token 사용
- 테스트 사용자와 관리자 계정 분리
- 요청별 Authorization Header 적용

## 6. Data Validation

Admin Flow에서 생성된 데이터를 식별하여
조회 및 삭제까지 수행한다.

테스트 전후 DB 상태를 비교하여
CRUD 데이터 정합성을 확인한다.

## 7. Test Procedure

1. 테스트 환경 기동
2. DB / Redis 상태 확인
3. Spring Boot 서버 상태 확인
4. k6 실행
5. HTTP 결과 확인
6. DB 상태 확인
7. 테스트 결과 기록
