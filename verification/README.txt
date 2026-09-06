
# 10. 이제 26-05adf
```txt
여기는 원칙적으로 기존 애플리케이션 구조를 존중해.

절대로 SA-1처럼 문서 중심으로 만들지 않아.

예:

26-05adf/
├─ backend/
├─ frontend/
├─ docker/
├─ nginx/
├─ tests/
├─ ...

그리고 검증 관련 코드/스크립트가 필요하다면:

verification/
├─ security/
├─ failure/
├─ e2e/
└─ performance/

정도로 분리.

11. 특히 Security는 이렇게

네가 말한 JWT / Refresh / IAM을 26-05adf 코드 기준으로 찾기 쉽게 만드는 거야.

예:

backend/
└─ src/
   └─ ...
      ├─ auth/
      ├─ iam/
      ├─ user/
      └─ ...

그리고 테스트:

tests/
├─ unit/
├─ integration/
└─ security/
   ├─ jwt/
   ├─ refresh-token/
   ├─ rbac/
   └─ logout/

이렇게.

SA-1의 05-knowledge/security와 코드의 실제 구조는 1:1로 똑같을 필요가 없어.

SA-1은 사람이 이해하기 위한 지식 구조.

26-05adf는 개발자가 유지보수하기 위한 코드 구조.
```

