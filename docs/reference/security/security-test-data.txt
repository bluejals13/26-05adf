# Security Test Data

## 1. Purpose

Security Integration Test에서 사용하는
사용자, Role, Permission 및 테스트 DB Fixture를 정의한다.

본 문서는 테스트 결과가 어떤 사용자와 권한 조건에서
재현되었는지 확인하기 위한 목적으로 사용한다.

---

## 2. Test Users

| User       | Role  | Purpose            |
| ---------- | ----- | ------------------ |
| `testuser` | USER  | 일반 사용자 인증 및 인가 테스트 |
| `admin`    | ADMIN | 관리자 API 접근 테스트     |

> 테스트 계정의 실제 비밀번호, JWT, Refresh Token 등 민감한 인증 정보는 문서에 기록하지 않는다.

---

## 3. Roles

### USER

일반 사용자에게 필요한 최소 권한을 사용한다.

```text
USER_READ
MENU_READ
```

### ADMIN

관리자 API 및 관리 기능에 필요한 권한을 사용한다.

```text
USER_READ
USER_CREATE
USER_UPDATE
USER_STATUS_UPDATE
USER_DELETE

ROLE_READ
ROLE_CREATE
ROLE_UPDATE
ROLE_DELETE
ROLE_ASSIGN
ROLE_REMOVE

MENU_READ

PERMISSION_READ
```

---

## 4. Permission Model

애플리케이션의 권한 검증 구조는 다음과 같다.

```text
User
  ↓
Role
  ↓
Permission
  ↓
GrantedAuthority
  ↓
@PreAuthorize
  ↓
API Access
```

Security Test에서는 USER와 ADMIN의 권한 차이를 이용하여
정상 접근과 접근 거부 시나리오를 검증한다.

---

## 5. Test Database

### Profile

```text
test
```

### Database

```text
H2
```

### Initialization

```text
Flyway
   ↓
Schema Migration
   ↓
Security Test Fixture
   ↓
Integration Test
```

---

## 6. SQL Fixture

테스트 데이터는 별도의 SQL Fixture로 관리한다.

```text
sql/security-test-data.sql
```

주요 Fixture:

* USER 계정
* ADMIN 계정
* Role
* Permission
* User-Role 관계
* Role-Permission 관계

---

## 7. Authorization Test Matrix

| User      | API                | Expected |
| --------- | ------------------ | -------: |
| Anonymous | `/api/users/me`    |      401 |
| USER      | `/api/users/me`    |      200 |
| ADMIN     | `/api/admin/users` |      200 |
| USER      | `/api/admin/users` |      403 |

---

## 8. Data Isolation

Security Integration Test는 테스트 전용 DB와
테스트 전용 사용자 데이터를 사용한다.

운영 계정 및 운영 데이터는 테스트에 사용하지 않는다.

테스트 데이터는 Fixture를 통해 재현 가능하도록 관리한다.

---

## 9. Sensitive Data Policy

다음 정보는 본 문서에 실제 값을 기록하지 않는다.

* 사용자 비밀번호
* Access Token
* Refresh Token
* JWT Secret
* Redis 인증 정보
* DB 계정 및 비밀번호
* 운영 환경의 개인정보

필요한 경우 테스트 코드 또는 환경 변수에서
안전하게 주입한다.
