

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

USER_RATIO=${3:-0.70}
READ_RATIO=${4:-0.27}
ADMIN_RATIO=${5:-0.03}

# SCENA=${3:-1}
# scenario=${4:-read}


echo "================================="
echo "run-k6 $VUS $DURATION $USER_RATIO $READ_RATIO"
echo "================================="


echo "================================="
echo "k6 Load Test Start"
echo "VUS       : $VUS"
echo "DURATION  : $DURATION"
echo "BASE_URL  : $BASE_URL"
echo "---------------------------------"
echo "USER_RATIO  : $USER_RATIO"
echo "READ_RATIO  : $READ_RATIO"
echo "ADMIN_RATIO : $ADMIN_RATIO"
echo "================================="


k6 run \
  --vus "$VUS" \
  --duration "$DURATION" \

  --env USER_RATIO="$USER_RATIO" \
  --env READ_RATIO="$READ_RATIO" \
  --env ADMIN_RATIO="$ADMIN_RATIO" \
  run.js


```

