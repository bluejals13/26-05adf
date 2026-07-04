#!/bin/bash

# =========================
# k6 + Prometheus 실행 스크립트
# =========================

# 환경 변수
export BASE_URL="http://localhost:8080"

# k6 실행 옵션
VUS=${VUS:-50}
DURATION=${DURATION:-2m}
TEST=${TEST:-setup.js}

echo "================================="
echo "k6 Load Test Start"
echo "TEST      : $TEST"
echo "VUS       : $VUS"
echo "DURATION  : $DURATION"
echo "BASE_URL  : $BASE_URL"
echo "================================="

k6 run \
  --vus $VUS \
  --duration $DURATION \
  --env BASE_URL=$BASE_URL \
  $TEST
  
