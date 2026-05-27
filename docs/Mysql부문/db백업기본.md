## MySQL Docker 설계
```bash
mysql:
  image: mysql:8

  
  healthcheck:
    test:
      ["CMD-SHELL",
       "mysqladmin ping -h 127.0.0.1 -uroot -p${MYSQL_ROOT_PASSWORD}"]

  volumes:
    - mysql_data:/var/lib/mysql


  ports:
    - "3307:3306"
```
MySQL과 포트 충돌 방지
컨테이너 재시작 후에도 DB 데이터 유지 가능

## MySQL 데이터 도커 볼륨 유지 여부
```bash
# 컨테이너만 종료/삭제
docker compose down

# 볼륨 포함 삭제
docker compose down -v

# 컨테이너 재배포 -자료유지
docker compose up -d --build
```
도커 볼륨 유지 여부로 서비스 지속 혹은 백업 후 롤백 여부 판단 가능

## mysqldump (가장 기본)
```bash
# 순수 백업
docker exec mysql_container \
mysqldump -u root -p commerce \
> backup.sql

# 날짜 포함
DATE=$(date +%F_%H-%M-%S)

docker exec mysql_container \
mysqldump -u root -p commerce \
> /backup/backup_$DATE.sql


# 백업 폴더 예시
/backup
├── backup_2026-05-26_02-00.sql
├── backup_2026-05-27_02-00.sql
└── backup_2026-05-28_02-00.sql


# crom 등록 (자동 백업 매일 새벽 2시)
0 2 * * * /home/app/scripts/backup.sh
```
최소 수준 db 백업과 관리

backup.sh 
```bash
#!/bin/bash

DATE=$(date +%F_%H-%M-%S)

BACKUP_DIR=/backup

mkdir -p $BACKUP_DIR

docker exec mysql_container \
mysqldump -u root -p${MYSQL_ROOT_PASSWORD} commerce \
| gzip > $BACKUP_DIR/backup_$DATE.sql.gz
```
gzip 압축으로 백업 용량 관리 1GB → 100MB 수준
## db 롤백/복구 실무 절차
```bash
# 1. 현재 상태 백업
docker exec mysql_container \
mysqldump -u root -p commerce \
> before_rollback.sql


# 2. db 초기화
docker exec -it mysql_container mysql -u root -p
---sql
DROP DATABASE commerce;

CREATE DATABASE commerce;
---


# 3. 백업 복원
gunzip < backup.sql.gz | docker exec -i mysql_container \
mysql -u root -p commerce

```
backup.sql = CREATE + INSERT SQL 모음
SQL 다시 실행하는 개념

## 부가적
```bash
Binary Log

mysqldump만 쓰면:

02:00 백업
02:10 장애

→ 10분 데이터 유실 가능.

그래서 Binlog 사용
Full Backup + Binary Log

조합 사용.

Replica 복제

Point-In-Time Recovery

특정 시점까지 복구 가능.

```
서버 , 개발 등의 규모에 따라 추가 및 정리

## 구조 상
```bash
project/
├── docker-compose.yml
├── backup/
│   ├── backup_2026-05-26.sql.gz
│   └── backup_2026-05-27.sql.gz
├── scripts/
│   └── backup.sh
└── mysql_data/
```
