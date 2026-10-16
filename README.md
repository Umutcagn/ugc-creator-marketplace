# UGC Creator & Brand Marketplace (MVP Prototype)

[![Project Status](https://img.shields.io/badge/Status-Architectural%20MVP%20%2F%20WIP-orange?style=flat-square)](https://github.com/Umutcagn/ugc-creator-marketplace)
[![Backend](https://img.shields.io/badge/Backend-FastAPI%20%7C%20SQLModel-blue?style=flat-square)](https://fastapi.tiangolo.com)
[![Frontend](https://img.shields.io/badge/Frontend-Next.js%20%7C%20TailwindCSS-black?style=flat-square)](https://nextjs.org)

An architectural MVP prototype designed to explore end-to-end marketplace dynamics connecting content creators (UGC) with advertising brands. Features role-based dashboards, campaign application lifecycles, and escrow wallet mechanics.

---

> [!NOTE]
> **Project Scope & Status:**  
> This project was developed as a rapid **architectural proof-of-concept (PoC / MVP)** to validate full-stack workflow integration, relational database modeling (SQLModel), JWT authentication, and dual-sided user interfaces (Brand vs. Creator). It is presented here as a demonstration of software architecture and rapid prototyping capability.

---

## Features

- **Dual-Sided Dashboards:** Dedicated operational views for both Brands (campaign management) and Creators (submissions, earnings).
- **Campaign Application Flow:** Creators browse active brand briefs, submit deliverables, and track review status.
- **Escrow Wallet Transaction Modeling:** Database models tracking mock wallet balances and milestone disbursements.
- **RESTful API Backend:** Modular endpoints built with FastAPI, OAuth2 JWT token security, and SQLModel ORM.
- **Modern Responsive UI:** Built with Next.js App Router, Tailwind CSS, and Lucide icons.

---

## Tech Stack

- **Backend:** FastAPI, Python 3.10+, SQLModel, SQLite, Pydantic, Passlib / PyJWT
- **Frontend:** Next.js (App Router), React, Tailwind CSS, Lucide React
- **Architecture:** Decoupled Client-Server (REST API + Next.js SPA)

---

## Project Structure

```
ugc-marketplace/
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI application & route registration
│   │   ├── models.py        # SQLModel schemas (User, Campaign, Proposal, Wallet)
│   │   ├── database.py      # Database session & engine configuration
│   │   └── auth.py          # JWT authentication & password hashing
│   └── requirements.txt
│
└── frontend/
    ├── app/                 # Next.js App Router pages (brand, creator, campaigns)
    ├── components/          # Reusable UI widgets & forms
    └── package.json
```

---

## Getting Started

### 1. Backend Setup

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Interactive API documentation will be available at `http://localhost:8000/docs`.

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.
