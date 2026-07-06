

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

1_SCENARIO=${3:-load}
USER_RATIO=${4:-0.70}

2_SCENARIO=${5:-load}
READ_RATIO=${6:-0.27}

3_SCENARIO=${7:-load}
ADMIN_RATIO=${8:-0.03}


echo "================================="
echo "run-k6 $VUS $DURATION $1_SCENARIO $USER_RATIO $2_SCENARIO $READ_RATIO $3_SCENARIO $ADMIN_RATIO"
echo "================================="


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
  --env USER_RATIO="$USER_RATIO" \
  --env READ_RATIO="$READ_RATIO" \
  --env ADMIN_RATIO="$ADMIN_RATIO" \
  run.js


```

