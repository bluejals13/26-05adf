

# run-k6.md

```md

#!/bin/bash


# =========================
# k6 + Prometheus 실행 스크립트
# =========================


# 환경 변수
export BASE_URL="${BASE_URL:-http://localhost:8080}"


# k6 실행 옵션
VUS=${VUS:-50}
DURATION=${DURATION:-2m}

SCENARIO=${SCENARIO:-load}

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
  run.j


```

