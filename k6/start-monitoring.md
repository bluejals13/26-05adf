
# start-monitoring.md

```md
#!/bin/bash

echo "Starting monitoring stack..."

cd "$(dirname "$0")/../dev"

docker compose up -d prometheus grafana node-exporter cadvisor

echo "Monitoring stack started"
```

