# 💳 VaultPay 

[![Java](https://img.shields.io/badge/Java-21-blue.svg)](https://adoptium.net/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.5-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://reactjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue.svg)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A secure payment gateway web application built for learning and demonstration purposes.

## 📌 Project Overview

VaultPay is a full-stack web application that simulates a payment gateway. Users can register, login, add money to their wallet, send money to other users, withdraw money, and view transaction history. The system includes basic fraud detection rules and admin monitoring capabilities.

### ✨ Key Features

| Feature | Status | Description |
|---------|--------|-------------|
| JWT Authentication | ✅ | Secure stateless authentication |
| Role-based Access | ✅ | USER, ADMIN, MERCHANT roles |
| Idempotent Payments | ✅ | Prevents double charging |
| Fraud Detection | ✅ | Rule-based + ML-ready engine |
| Real-time Analytics | ✅ | Charts and spending insights |
| Transaction Export | ⏳ | CSV/PDF export capability |
| 2FA Security | 📋 | Google Authenticator ready |
| Webhook System | 📋 | Merchant callback support |



## 🔧 Architecture Diagram Fix

Architecture diagram text version (paste this directly):

```text
┌─────────────────────────────────────────────────────────┐
│                    USER BROWSER                          │
│                  (React Application)                     │
│                     Port 5173                            │
└─────────────────────┬───────────────────────────────────┘
                      │ HTTPS/REST API
                      ↓
┌─────────────────────────────────────────────────────────┐
│                 SPRING BOOT BACKEND                      │
│                     Port 8081                            │
│                                                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Step 1: JWT Filter - Validates token          │   │
│  └─────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Step 2: Controller - Receives request         │   │
│  └─────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Step 3: Service - Business logic              │   │
│  └─────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Step 4: Repository - Database operations      │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────┬───────────────────────────────────┘
                      │ JDBC
                      ↓
┌─────────────────────────────────────────────────────────┐
│                   POSTGRESQL DATABASE                    │
│                     Port 5432                            │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │    users     │  │   accounts   │  │ transactions │   │
│  │  - id        │  │  - id        │  │  - id        │   │
│  │  - email     │  │  - user_id   │  │  - account_id│   │
│  │  - password  │  │  - balance   │  │  - amount    │   │
│  │  - role      │  │  - status    │  │  - type      │   │
│  └──────────────┘  └──────────────┘  └──────────────┘   │
└─────────────────────────────────────────────────────────┘
