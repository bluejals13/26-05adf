#!/bin/bash

echo "Starting monitoring stack..."

docker compose up -d prometheus grafana node-exporter cadvisor

echo "Monitoring stack started"
