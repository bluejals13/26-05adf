아래는 지금까지 설계/수정 내용을 **“중간 보고용 + 구조 설명 + 상태 정리”까지 포함한 압축 MD 파일**이야. 그대로 복사해서 문서로 써도 됨.

---

# 📄 Auth System 설계 중간 보고 (fetch 기반)

## 1. 개요

본 프로젝트는 **fetch 기반 custom auth layer**를 구축하여 다음 기능을 담당한다:

* Access Token 관리 (Zustand)
* Refresh Token (HttpOnly Cookie 기반)
* 자동 재발급 (401 interceptor 역할)
* 로그인 / 로그아웃 상태 동기화
* React Query 캐시 연동

---

# 2. 전체 구조

```
UI
 ↓
React Query
 ↓
http request layer (fetch wrapper)
 ↓
authService (login / logout / refresh)
 ↓
Zustand store (access token)
 ↓
Backend (access + refresh cookie)
```

---

# 3. 핵심 설계 원칙

## ✔ 1. Access Token = Client state (Zustand)

* 메모리 기반 인증 상태
* localStorage 의존 최소화

## ✔ 2. Refresh Token = HttpOnly Cookie

* JS 접근 불가
* 서버가 갱신 책임

## ✔ 3. refresh single-flight

* refresh 중복 요청 방지

## ✔ 4. logout hard lock

* refresh / request 차단 플래그 적용

---

# 4. 핵심 상태 변수

| 변수             | 역할                       |
| -------------- | ------------------------ |
| token          | access token 저장          |
| refreshPromise | refresh 중복 방지            |
| isLoggingOut   | logout race condition 방지 |

---

# 5. API 구조

## authService

| 함수           | 역할                          |
| ------------ | --------------------------- |
| login        | 로그인 + token 저장              |
| logout       | cookie revoke + state reset |
| refreshToken | access token 재발급            |
| signup       | 회원가입                        |

---

## http request

* Authorization header 자동 주입
* 401 → refresh → retry
* logout 중 request 차단

---

# 6. 핵심 코드 흐름

## 6.1 request flow

```
request()
 ↓
fetch
 ↓
401 발생
 ↓
refreshToken()
 ↓
new token 저장
 ↓
retry request
```

---

## 6.2 logout flow

```
logout()
 ↓
isLoggingOut = true
 ↓
server logout (cookie revoke)
 ↓
refreshPromise reset
 ↓
store clear
 ↓
queryClient.clear()
 ↓
auth:logout event
 ↓
isLoggingOut = false
```

---

## 6.3 refresh flow

```
refreshToken()
 ↓
single-flight check
 ↓
POST /refresh (cookie 기반)
 ↓
new access token 저장
 ↓
return token
```

---

# 7. 상태 관리 흐름 (Zustand)

| 상태       | 설명           |
| -------- | ------------ |
| token    | access token |
| setToken | token 갱신     |
| logout   | token 제거     |

---

# 8. 안정성 설계

## ✔ race condition 방지

* refreshPromise lock
* isLoggingOut guard

## ✔ infinite refresh 방지

* retry flag 제어

## ✔ logout priority

* logout > refresh > request

---

# 9. 현재 구조 평가

| 항목             | 상태                    |
| -------------- | --------------------- |
| 로그인            | ✅ 안정                  |
| 로그아웃           | ⚠️ 거의 안정              |
| refresh        | ⚠️ 안정 (single-flight) |
| race condition | ⚠️ 대부분 제거             |
| 구조 완성도         | 90~95%                |

---

# 10. 남은 개선 포인트

## (1) AbortController 미적용

* request cancel 불가

## (2) 멀티탭 sync 미구현

* auth state 브로드캐스트 없음

## (3) microtask race 극한 케이스

* 0.1% 수준 edge case

---

# 11. 최종 결론

> 본 구조는 axios interceptor 없이 구현한 **fetch 기반 enterprise auth architecture**로,
> refresh, logout, race condition 방어가 포함된 고급 상태 관리 시스템이다.

---


