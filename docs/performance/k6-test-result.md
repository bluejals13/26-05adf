# k6 Test Result

## 1. Summary

테스트 조건에 따른 API 응답 성능,
HTTP 오류율 및 비즈니스 흐름 정상 여부를 기록한다.

## 2. Load Test

| Run | VU | Duration | Avg | P95 | RPS | Error |
|---|---:|---:|---:|---:|---:|---:|
| 1 | 50 | 2m | 135.49ms | 188.25ms | 368 | 0% |
| 2 | 50 | 2m | 24.71ms | 40.76ms | 2,010 | 0% |
| 3 | 50 | 2m | 25.34ms | 41.95ms | 1,960 | 0% |
| 4 | 50 | 2m | 24.30ms | 39.16ms | 2,046 | 0% |

## 3. Stress Test

| Run | VU | Duration | Avg | P95 | RPS | Error |
|---|---:|---:|---:|---:|---:|---:|
| 5 | 70 | 1m | 4.73ms | 8.77ms | 469 | 0% |
| 6 | 70 | 1m | 6.01ms | 10.61ms | 457 | 0% |
| 7 | 70 | 1m | 6.18ms | 10.57ms | 465 | 0% |

## 4. Data Integrity

### Before

- `menu` table 기존 데이터 확인

### During

- 메뉴 생성
- 생성 데이터 조회
- 생성 데이터 식별
- 메뉴 삭제

### After

- `menu` table 재조회
- 테스트 전 상태와 비교

## 5. Validation

- HTTP Error Rate: 0%
- Stress Test 3회 반복
- 주요 CRUD Flow 정상 수행
- DB 상태 정상 확인

## 6. Conclusion

본 테스트 환경과 부하 조건에서
API 응답 성능 및 주요 비즈니스 흐름의 정상 동작을 확인하였다.

본 결과는 해당 테스트 환경에서의 측정값이며
운영 환경의 SLA를 직접 보장하는 수치는 아니다.
