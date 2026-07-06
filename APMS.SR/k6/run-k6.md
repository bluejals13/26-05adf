

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

SCENA_1=${3:-load}
USER_RATIO=${4:-0.70}

SCENA_2=${5:-read}
READ_RATIO=${6:-0.27}

SCENA_3=${7:-admin}
ADMIN_RATIO=${8:-0.03}


echo "================================="
echo "run-k6 $VUS $DURATION $SCENA_1 $USER_RATIO $SCENA_2 $READ_RATIO $SCENA_3 $ADMIN_RATIO"
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
  --env SCENA_1="$SCENA_1" \
  --env USER_RATIO="$USER_RATIO" \

  --env SCENA_2="$SCENA_2" \
  --env READ_RATIO="$READ_RATIO" \

  --env SCENA_3="$SCENA_3" \
  --env ADMIN_RATIO="$ADMIN_RATIO" \
  run.js


```

