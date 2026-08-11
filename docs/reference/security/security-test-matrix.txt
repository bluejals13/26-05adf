# Security Test Matrix

## 1. Purpose

JWT 인증·인가, Refresh Token, Access Token Blacklist,
RBAC 및 관리자 API 접근 제어에 대한 테스트 범위를 정의한다.

본 문서에서는 **구현 여부와 실제 검증 여부를 구분**한다.

## 2. Test Status

| Status         | Description                        |
| -------------- | ---------------------------------- |
| ✅ Verified     | 실제 테스트를 실행하고 기대 결과를 확인함            |
| 🟡 Implemented | 관련 기능은 구현되었으나 해당 시나리오의 실제 테스트는 미실행 |
| ❌ Not Tested   | 구현 여부와 관계없이 별도의 검증이 필요한 상태         |

---

## 3. Authentication

| ID          | Scenario                | Expected | Status |
| ----------- | ----------------------- | -------: | ------ |
| SEC-AUTH-01 | 인증 없이 보호 API 접근         |      401 | ✅      |
| SEC-AUTH-02 | 정상 USER JWT로 보호 API 접근  |      200 | ✅      |
| SEC-AUTH-03 | 정상 ADMIN JWT로 보호 API 접근 |      200 | ✅      |
| SEC-AUTH-04 | 잘못된 JWT로 접근             |      401 | 🟡     |
| SEC-AUTH-05 | 만료된 JWT로 접근             |      401 | 🟡     |
| SEC-AUTH-06 | 변조된 JWT로 접근             |      401 | 🟡     |

---

## 4. Refresh Token

| ID             | Scenario               | Expected                  | Status |
| -------------- | ---------------------- | ------------------------- | ------ |
| SEC-REFRESH-01 | 정상 Refresh Token으로 재발급 | Access Token 재발급          | 🟡     |
| SEC-REFRESH-02 | Refresh Token 저장       | Redis 저장                  | 🟡     |
| SEC-REFRESH-03 | Refresh Token 삭제       | Redis 삭제                  | 🟡     |
| SEC-REFRESH-04 | Refresh Token Rotation | 기존 Token 폐기 및 신규 Token 발급 | 🟡     |
| SEC-REFRESH-05 | 폐기된 Refresh Token 재사용  | 요청 거부                     | 🟡     |
| SEC-REFRESH-06 | 동시 Refresh 요청          | Race Condition 방지         | ❌      |

---

## 5. Access Token Blacklist

| ID        | Scenario                 | Expected          | Status |
| --------- | ------------------------ | ----------------- | ------ |
| SEC-BL-01 | Logout 수행                | JTI Blacklist 등록  | 🟡     |
| SEC-BL-02 | Blacklist Token으로 API 접근 | 인증 거부             | 🟡     |
| SEC-BL-03 | Blacklist TTL 확인         | Token 잔여시간 기준 TTL | 🟡     |
| SEC-BL-04 | Redis 장애 상황              | 503 또는 인증 거부      | 🟡     |

---

## 6. RBAC / Authorization

| ID          | Scenario             | Expected | Status |
| ----------- | -------------------- | -------- | ------ |
| SEC-RBAC-01 | USER가 자기 정보 조회       | 200      | ✅      |
| SEC-RBAC-02 | ADMIN이 Admin API 접근  | 200      | ✅      |
| SEC-RBAC-03 | USER가 Admin API 접근   | 403      | ❌      |
| SEC-RBAC-04 | Permission 없는 API 접근 | 403      | ❌      |

---

## 7. Current Test Scope

### Verified

현재 실제 테스트를 통해 검증된 항목:

* 인증 없이 보호 API 접근
* 정상 USER JWT를 이용한 보호 API 접근
* 정상 ADMIN JWT를 이용한 관리자 API 접근
* Spring Security Filter Chain을 통한 인증·인가 흐름

### Implemented but Not Fully Verified

코드 구현은 확인했으나 별도 시나리오 테스트가 필요한 항목:

* Refresh Token Rotation
* Refresh Token 저장 및 삭제
* JTI 기반 Access Token Blacklist
* Blacklist TTL 관리
* JWT 만료 및 변조 처리
* Redis 장애 예외 처리
* Permission 기반 접근 제어

### Not Tested

현재 별도 검증이 필요한 항목:

* Refresh Token Replay
* Refresh Race Condition
* 실제 Redis 장애 상황
* USER의 Admin API 접근 거부
* Permission별 Negative Test

---

## 8. Test Principle

Security Test는 다음 세 단계를 구분한다.

```text
Implemented
    ↓
실제 테스트 실행
    ↓
Verified
```

따라서 **코드가 존재한다는 사실만으로 보안 기능이 검증되었다고 판단하지 않는다.**
