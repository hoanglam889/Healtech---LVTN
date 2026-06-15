# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Git Workflow Rules

**NEVER work on `main`.** All changes must go on `develop` or a dedicated feature branch (`feature/...`).

**NEVER push to any remote** unless the user explicitly says to push or approves a push. Committing locally is fine; pushing is not.

These rules apply at all times, even when the user says "run it", "test it", or "make it work" — those are not push approvals.

## Project Overview

Healtech is a full-stack healthcare clinic management ERP (graduation thesis project). It handles patient appointment booking, receptionist check-in with QR codes, doctor queue management, and medical records.

Three user roles drive the UI structure: **Patient**, **Reception Staff**, and **Doctor**.

## Commands

### Backend (NestJS — run from `backend/`)
```bash
npm run start:dev   # Development server with watch mode (port 3000)
npm run build       # Compile TypeScript to dist/
npm run start:prod  # Run compiled production build
npm run lint        # ESLint + auto-fix
npm run test        # Unit tests (Jest)
npm run test:e2e    # End-to-end tests
npm run test:cov    # Coverage report
```

### Frontend (React + Vite — run from `frontend/`)
```bash
npm run dev         # Dev server at http://localhost:5173
npm run build       # Production build
npm run lint        # ESLint
npm run preview     # Preview production build
```

### Database
Import the schema and seed data: `mysql -u root < clinic_flow_erp.sql`

## Architecture

### Backend (`backend/src/`)
NestJS with TypeORM + MySQL. Each feature is a NestJS module: `auth`, `appointments`, `doctor-profiles`, `patients`, `specialties`, `upload`. Database entities live in `entities/` (12 tables).

Key relationships:
- `Appointments` → `Patients`, `DoctorProfiles`, `Shifts`
- `MedicalRecords` → `Appointments` (one-to-one)
- `Invoices` → `Appointments` (one-to-one)
- `AppointmentStatusLogs` tracks all status transitions

Appointment status flow: `BOOKED → WAITING → EXAMINING → DONE` (or `CANCELLED`).

Backend serves static assets from `/public/images/` (doctor avatars, etc.).

### Frontend (`frontend/src/`)
React 19 SPA with client-side routing via component state. No React Router — routing is done by path checks and conditional rendering in `App.jsx`.

- `/` — Patient portal (landing, booking, dashboard)
- `/staff` — Staff portal (receptionist check-in panel, doctor clinic queue)

State management is local React hooks + `localStorage` for session persistence (user data, auth tokens).

**Services layer** (`services/`): axios-based API clients. `apiClient.js` is the shared axios instance pointing to `http://localhost:3000`.

**Component organization:**
- `pages/` — high-level screen containers
- `components/` — feature-grouped UI components (`booking/`, `reception/`, `doctor/`, `shared/`)

## Environment Configuration

Backend requires a `.env` in `backend/`:
```
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=
DB_DATABASE=clinic_flow_erp
PORT=3000
```

Frontend API base URL is hardcoded in `frontend/src/services/apiClient.js` as `http://localhost:3000`.

## Test Accounts

| Role | Phone | Password |
|------|-------|----------|
| Patient | 0797551612 | 1 |
| Receptionist | 008 | 1 |
| Doctor (Cardiology) | 004 | 1 |

Patient login is at `/`, staff login is at `/staff`.
