
# 개발 환경 설치 가이드

프로젝트 개발에 필요한 기본 개발 환경과 성능 테스트 도구인 **k6** 설치 방법을 정리한 문서입니다.

## 1. 사용 패키지 버전

| 패키지     |       버전 |
| ------- | -------: |
| Node.js | v20.20.2 |
| npm     |   10.8.2 |
| Java    |  17.0.18 |
| Gradle  |   8.14.4 |
| Docker  |   29.3.1 |
| Git     |   2.43.0 |
| k6      |    최신 버전 |

> 버전은 프로젝트 개발 환경 기준이며, 실제 설치 시점에 따라 패치 버전이 달라질 수 있습니다.

---

## 2. Gradle 설치

### 2.1 Gradle 설치

```bash
sudo snap install gradle --classic
```

### 2.2 PATH 설정

```bash
echo 'export PATH=$PATH:/snap/bin' >> ~/.bashrc
source ~/.bashrc
```

### 2.3 설치 확인

```bash
snap list gradle
which gradle
gradle -v
```

---

## 3. Java 17 설치

### 3.1 Java 설치

```bash
sudo apt update
sudo apt install openjdk-17-jdk -y
```

### 3.2 Java 설치 위치 확인

```bash
readlink -f $(which java)
```

### 3.3 JAVA_HOME 설정

```bash
echo 'export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64' >> ~/.bashrc
echo 'export PATH=$JAVA_HOME/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

### 3.4 설치 확인

```bash
echo $JAVA_HOME
java -version
```

---

## 4. Node.js 20 및 npm 설치

### 4.1 Node.js 20 설치

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

### 4.2 설치 확인

```bash
node -v
npm -v
which node
which npm
```

예상 버전:

```text
Node.js : v20.20.2
npm     : 10.8.2
```

### 4.3 Frontend 초기 설정

Frontend 디렉터리에서 Vite React 템플릿을 생성합니다.

```bash
cd frontend
npm create vite@latest . -- --template react
npm install zustand @tanstack/react-query   # Zustand 와 Tanstack/리액트-쿼리 설치
```

> 이미 프로젝트에 Frontend 코드가 구성되어 있다면 위 명령을 다시 실행하지 않습니다.

---

## 5. Docker 설치 및 확인

Docker는 애플리케이션 및 관련 서비스를 컨테이너 환경에서 실행하기 위해 사용합니다.

설치 여부를 확인합니다.

```bash
docker --version
```

예상 버전:

```text
Docker version 29.3.1
```

Docker Compose가 설치되어 있는지도 확인합니다.

```bash
docker compose version
```

---

## 6. Git 설치 및 확인

Git 설치 여부를 확인합니다.

```bash
git --version
```

예상 버전:

```text
git version 2.43.0
```

---

# 7. k6 설치

k6는 부하 테스트 및 성능 테스트를 위해 사용하는 도구입니다.

## 7.1 기존 k6 설치 여부 확인

```bash
k6 version
```

설치되어 있지 않다면 `command not found` 등의 메시지가 표시됩니다.

---

## 7.2 k6 설치

Ubuntu/Debian 환경에서는 다음 순서로 설치할 수 있습니다.

### 필수 패키지 설치

```bash
sudo apt update
sudo apt install -y gnupg software-properties-common curl
```

### k6 저장소 키 등록

```bash
curl -fsSL https://dl.k6.io/key.gpg \
  | sudo gpg --dearmor -o /usr/share/keyrings/k6-archive-keyring.gpg
```

### k6 저장소 등록

```bash
echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" \
  | sudo tee /etc/apt/sources.list.d/k6.list > /dev/null
```

### k6 설치

```bash
sudo apt update
sudo apt install -y k6
```

### 설치 확인

```bash
k6 version
```

---

## 7.3 k6 업데이트

이미 k6가 설치되어 있는 경우 다음 명령으로 업데이트할 수 있습니다.

```bash
sudo apt update
sudo apt install --only-upgrade -y k6
```

업데이트 후 버전을 확인합니다.

```bash
k6 version
```

---

## 8. k6 설치 스크립트 사용

프로젝트에서 제공하는 k6 설치 스크립트를 사용할 수도 있습니다.

스크립트는 다음 작업을 자동으로 처리합니다.

1. k6 설치 여부 확인
2. 기존 k6 버전 출력
3. 업데이트 여부 확인
4. 미설치 상태라면 필요한 패키지 설치
5. k6 저장소 등록
6. k6 설치
7. 설치된 k6 버전 출력

스크립트 실행 권한을 부여합니다.

```bash
chmod +x k6@ins.sh
```

실행합니다.

```bash
./k6@ins.sh
```

---

# 9. 전체 환경 설치 확인

모든 개발 환경이 정상적으로 설치되었는지 한 번에 확인합니다.

```bash
node -v
npm -v
java -version
gradle -v
docker --version
docker compose version
git --version
k6 version
```

정상적으로 버전 정보가 출력되면 기본 개발 환경 설치가 완료된 것입니다.

---

# 10. 다음 단계

개발 환경 설치가 완료되었다면 프로젝트 실행 및 Docker Compose 구성은 다음 문서를 참고합니다.

👉 [02_Quick_Start.md](02_Quick_Start.md)

Quick Start에서는 다음 과정을 다룹니다.

* 프로젝트 빌드
* Docker Compose 실행
* 애플리케이션 실행
* 서비스 상태 확인
* Health Check 검증
