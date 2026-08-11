# k6 Test Environment

## 1. Test Host

| Item | Value |
|---|---|
| CPU | AMD Ryzen 9 PRO 7945 |
| Memory | 32GB DDR5 |
| OS | Linux / WSL |
| GPU | RTX 3070 Ti 8GB |

## 2. Application

| Component | Technology |
|---|---|
| Backend | Spring Boot |
| Frontend | React + Vite |
| Reverse Proxy | Nginx |
| Database | MySQL |
| Cache | Redis |
| Authentication | JWT |

## 3. Runtime

| Component | Technology |
|---|---|
| Container Runtime | Docker |
| Orchestration | Docker Compose |
| Load Generator | k6 |

## 4. Monitoring

| Component | Purpose |
|---|---|
| Prometheus | Metrics collection |
| Grafana | Visualization |
| cAdvisor | Container metrics |
| node-exporter | Host metrics |

## 5. Network

| Item | Value |
|---|---|
| Target | localhost:8080 |
| Load Generator | Same local environment |
| Network | Localhost |

## 6. Architecture

k6
 ↓
localhost:8080
 ↓
Nginx
 ↓
Spring Boot
 ├── MySQL
 └── Redis

Monitoring:

Spring Boot / Docker / Host
 ↓
Prometheus
 ↓
Grafana
