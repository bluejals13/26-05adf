# GitHub Actions CI/CD 설정 및 Push 오류 해결

## 현재 상태

| 항목                         | 상태            |
| -------------------------- | ------------- |
| GitHub Actions Workflow 생성 | 완료            |
| backend-ci.yml 생성          | 완료            |
| frontend-ci.yml 생성         | 완료            |
| Git Commit                 | 완료            |
| Git Push                   | 실패            |
| CI/CD 실행                   | 미실행 (Push 필요) |

---

## 수행 내역

```bash
mkdir -p .github/workflows

nano .github/workflows/backend-ci.yml
nano .github/workflows/frontend-ci.yml

git add .github
git commit -m "Add GitHub Actions CI workflows"
```

커밋 결과:

```text
[main 127c12f] Add GitHub Actions CI workflows
2 files changed, 82 insertions(+)
create mode 100644 APMS.SR/.github/workflows/backend-ci.yml
create mode 100644 APMS.SR/.github/workflows/frontend-ci.yml
```

---

## 발생한 오류

```text
remote: Invalid username or token.
Password authentication is not supported for Git operations.
fatal: Authentication failed
```

### 원인

GitHub는 비밀번호 인증을 지원하지 않음.

기존 방식:

```text
Username + Password
```

사용 불가.

---

## 해결 방법 1 : Personal Access Token (PAT)

### GitHub에서

1. Settings
2. Developer Settings
3. Personal Access Tokens
4. Generate New Token
5. repo 권한 체크
6. 토큰 생성

### Push

```bash
git push origin main
```

입력:

```text
Username : bluejals13
Password : 생성한 PAT Token
```

---

## 해결 방법 2 : SSH (권장)

### SSH 키 생성

```bash
ssh-keygen -t ed25519 -C "email@example.com"
```

### 공개키 확인

```bash
cat ~/.ssh/id_ed25519.pub
```

### GitHub 등록

Settings → SSH and GPG Keys → New SSH Key

### 연결 테스트

```bash
ssh -T git@github.com
```

성공 예시:

```text
Hi bluejals13! You've successfully authenticated...
```

### 원격 저장소 변경

```bash
git remote set-url origin git@github.com:bluejals13/26-05adf.git
```

### Push

```bash
git push origin main
```

---

## CI/CD 실행 조건

Push 성공 후 자동 실행

```text
Git Push
   ↓
GitHub Actions Trigger
   ↓
backend-ci.yml 실행
frontend-ci.yml 실행
   ↓
CI 결과 확인
```

---

## 확인 명령어

```bash
git remote -v
git status
git push origin main
```

