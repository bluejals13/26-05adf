# Security Test Matrix

## 1. Authentication

| ID | Scenario | Expected | Status |
|---|---|---:|:---:|
| AUTH-01 | 인증된 사용자 요청 | 200 | ✅ |
| AUTH-02 | 인증되지 않은 요청 | 401 | ✅ |
| AUTH-03 | 잘못된 인증 | 401 | ✅ |

---

## 2. Authorization

| ID | Scenario | Expected | Status |
|---|---|---:|:---:|
| AUTHZ-01 | 필요한 Permission 보유 | 200 | ✅ |
| AUTHZ-02 | Permission 없음 | 403 | ✅ |
| AUTHZ-03 | 인증은 됐지만 권한 없음 | 403 | ✅ |

---

## 3. RBAC

| ID | Scenario | Expected | Status |
|---|---|---:|:---:|
| RBAC-01 | Role 생성 | Success | ✅ |
| RBAC-02 | Role 수정 | Success | ✅ |
| RBAC-03 | Role 삭제 | Success | ✅ |
| RBAC-04 | Permission 생성 | Success | ✅ |
| RBAC-05 | Role-Permission 할당 | Success | ✅ |
| RBAC-06 | ROLE_ASSIGN 없는 사용자 | 403 | ✅ |

---

## 4. Menu Security

| ID | Scenario | Expected | Status |
|---|---|---:|:---:|
| MENU-01 | MENU_READ 보유 | 200 | ✅ |
| MENU-02 | MENU_READ 없음 | 403 | ✅ |

---

## 5. Negative Authorization

권한이 없는 사용자는 해당 API에 접근할 수 없어야 한다.

| ID | Scenario | Expected | Status |
|---|---|---:|:---:|
| NEG-01 | USER → ROLE_READ API | 403 | ✅ |
| NEG-02 | USER → ROLE_CREATE API | 403 | ✅ |
| NEG-03 | USER → ROLE_UPDATE API | 403 | ✅ |
| NEG-04 | USER → ROLE_DELETE API | 403 | ✅ |
| NEG-05 | USER → ROLE_ASSIGN API | 403 | ✅ |
| NEG-06 | USER → MENU_READ API | 200 | ✅ |
| NEG-07 | USER → USER_READ API | 200 | ✅ |
| NEG-08 | ADMIN → 관리자 API | 200 | ✅ |
| NEG-09 | 인증되지 않은 사용자 → 보호 API | 401 | ✅ |

---

## 6. Verification Summary

| Area | Status |
|---|:---:|
| Authentication | ✅ |
| Authorization | ✅ |
| Role CRUD | ✅ |
| Permission CRUD | ✅ |
| Role-Permission | ✅ |
| User-Role | ✅ |
| ROLE_ASSIGN | ✅ |
| MENU_READ | ✅ |
| 401 Unauthorized | ✅ |
| 403 Forbidden | ✅ |

