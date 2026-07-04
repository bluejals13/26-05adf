#!/bin/bash

# =========================
# k6 + Prometheus Remote Write
# =========================

export BASE_URL="http://localhost:8080"

VUS=${VUS:-50}
DURATION=${DURATION:-2m}
TEST=${TEST:-setup.js}

# Prometheus remote write endpoint
PROM_URL=${PROM_URL:-http://localhost:9090/api/v1/write}

echo "================================="
echo "k6 + Prometheus Load Test"
echo "TEST      : $TEST"
echo "VUS       : $VUS"
echo "DURATION  : $DURATION"
echo "PROM URL  : $PROM_URL"
echo "================================="

k6 run \
  --vus $VUS \
  --duration $DURATION \
  --env BASE_URL=$BASE_URL \
  --out experimental-prometheus-rw \
  $TEST
