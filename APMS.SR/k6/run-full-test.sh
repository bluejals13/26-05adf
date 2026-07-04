#!/bin/bash

./start-monitoring.sh

sleep 5

echo "Starting k6 test..."

k6 run \
  --vus 50 \
  --duration 2m \
  --env BASE_URL=http://localhost:8080 \
  --out experimental-prometheus-rw \
  k6/active.js

echo "Test finished"