#!/bin/bash

set -e

ls -a
ls -l

echo -e "\n ex.env -> .env 복사 \n \n"

if [ ! -f "ex.env" ]; then
  echo "ex.env 파일이 존재하지 않습니다."
  exit 1
fi

cp -f ex.env .env

echo "[0] .env 생성/덮어쓰기 완료"
ls -l .env



