# DOCS/README.md  #DOCS 작성 및 관리 규칙


# 1. 전체 문서 구조

```text
docs/
│
├── README.md                    ← docs 전체 안내
│
├── architecture/
│   ├── README.md                ← architecture 폴더 설명
│   ├── overview.md              ← 전체 시스템 개요
│   ├── backend.md
│   ├── frontend.md
│   └── infrastructure.md
│
├── reference/
│   ├── README.md                ← reference 폴더 설명
│   ├── security.md
│   ├── operations.md
│   ├── monitoring.md
│   └── project-structure.md
│
├── decisions/
│   ├── README.md                ← ADR 작성 규칙
│   ├── ADR-001-...
│   └── ...
│
├── troubleshooting/
│   ├── README.md                ← 장애 문서 작성 규칙
│   ├── ...
│
├── roadmap/
│   ├── README.md                ← Roadmap 작성 규칙
│   └── roadmap.md
│
└── conventions/
    ├── README.md                ← 문서 작성 규칙
    ├── documentation.md
    ├── file-naming.md
    └── project-structure.md
```

# Documentation Guide

## Purpose

프로젝트의 모든 문서를 일관된 기준으로 관리하기 위한
문서 시스템을 정의한다.

---

## Documentation Structure

| Directory | Purpose |
|------------|----------|
| [README.md](docs/architecture/README.md) | 현재 시스템 구조와 요청 흐름 |
| [README.md](docs/reference/README.md) | 현재 정책 및 운영 기준 |
| [README.md](docs/adr/README.md) | 설계 의사결정(ADR) |
| [README.md](docs/troubleshooting/README.md) | 장애 및 해결 과정 |
| [README.md](docs/roadmap/README.md) | 향후 개선 계획 |
| [README.md](docs/conventions/README.md) | 문서 작성 규칙 |

---

## Documentation Lifecycle
```md
Requirement
↓
Design
↓
Code
↓
Test
↓
Source of Truth
↓
Reference
↓
Architecture
↓
ADR (if needed)
↓
Troubleshooting (if needed)
↓
Roadmap (if needed)
```
---

## Principles

1. Source of Truth를 먼저 확인한다.
2. 문서 간 내용을 복사하지 않는다.
3. 현재 상태와 과거 기록을 분리한다.
4. 장애는 사건 단위로 기록한다.
5. Roadmap은 문제 중심으로 작성한다.
6. 모든 문서는 목적과 책임 범위를 가진다.

---

