
#!/bin/bash


# =========================
# k6 + Prometheus Remote Write
# =========================


# 환경 변수
export BASE_URL="${BASE_URL:-http://localhost:8080}"


# k6 실행 옵션
VUS=${VUS:-50}
DURATION=${DURATION:-2m}
ENTRY=${ENTRY:-run.js}


# Prometheus remote write endpoint
PROM_URL=${PROM_URL:-http://localhost:9090/api/v1/write}


echo "================================="
echo "k6 Load Test Start"
echo "VUS       : $VUS"
echo "DURATION  : $DURATION"
echo "BASE_URL  : $BASE_URL"
echo "================================="


k6 run \
  --vus "$VUS" \
  --duration "$DURATION" \
  --env BASE_URL="$BASE_URL" \
  --out experimental-prometheus-rw \
  "$ENTRY"


