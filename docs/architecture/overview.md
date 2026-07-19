# architecture/overview.md # 개요 및 해당 설명용

# System Overview

## Purpose

현재 운영 중인 시스템의 전체 구성과 요청 흐름을 설명한다.

---

## Scope

Client
↓

Nginx

↓

React

↓

Spring Boot

↓

MySQL

Redis

---

## Runtime Flow

User Request

↓

Nginx

↓

Frontend

↓

Spring Security

↓

Business Logic

↓

MySQL / Redis

---

## Main Components

Client

Reverse Proxy

Frontend

Backend

Database

Cache

Monitoring

---

## Related Documents

backend.md

frontend.md

infrastructure.md

reference/security.md