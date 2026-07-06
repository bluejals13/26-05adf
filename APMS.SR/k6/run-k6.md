

# run-k6.md

```md

#!/bin/bash


# =========================
# k6 + Prometheus 실행 스크립트
# =========================


# 환경 변수
export BASE_URL="${BASE_URL:-http://localhost:8080}"


# k6 실행 옵션
VUS=${1:-50}
DURATION=${2:-2m}

SCENARIO=${3:-load}

echo "================================="
echo "k6 Load Test Start"
echo "VUS       : $VUS"
echo "DURATION  : $DURATION"
echo "BASE_URL  : $BASE_URL"
echo "SCENARIO  : $SCENARIO"
echo "================================="


k6 run \
  --vus "$VUS" \
  --duration "$DURATION" \
  --env SCENARIO="$SCENARIO" \
  run.js


```

