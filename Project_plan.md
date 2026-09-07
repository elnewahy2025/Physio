# Physio Center Management System — Project Plan

## File of Truth

**Repository:** https://github.com/elnewahy2025/Physio  
**Owner:** Khaled Osman  
**Project type:** Physiotherapy center management PWA  
**Launch country:** Egypt  
**Default currency:** EGP / ج.م.  
**Default timezone:** Africa/Cairo  
**Status:** M1 foundation approved; implementation beginning

> This document is the file of truth for product scope, architecture, delivery order, and launch assumptions. Material implementation decisions must be reflected here.

## 1. Product Overview

Physio is a responsive Progressive Web Application for managing a physiotherapy center. The initial release will support secure access, patient records, appointment scheduling, treatment notes, manual invoicing, manual payment recording, branded PDF invoices, WhatsApp deep links, Arabic/English localization, and role-specific workflows.

The application serves four roles: **Owner**, **Therapist**, **Secretary**, and **Patient**. The first release prioritizes reliable center operations. Online payment processing is explicitly deferred to a future phase.

| Role | Initial responsibilities |
|---|---|
| **Owner** | Dashboard, user management, settings, operational and financial summaries |
| **Therapist** | Assigned calendar, patient history, treatment notes, attendance |
| **Secretary** | Patient registration, appointments, invoices, manual payment records, WhatsApp links |
| **Patient** | Booking requests, own records, invoices, notifications, ratings where enabled |

## 2. Launch Constraints and Localization

The initial deployment targets Egypt. The default locale is `ar-EG`, with English available as a secondary locale. Arabic interfaces must support RTL layout; English interfaces must support LTR layout. The default timezone is `Africa/Cairo`, and date/time display must use timezone-aware values.

All monetary values are stored and displayed in Egyptian pounds. Currency formatting must use internationalization APIs and settings rather than hardcoded symbols. The currency code is `EGP` and the display label is `ج.م.` where appropriate. Tax remains configurable through Settings and will not be hardcoded until the center’s accounting requirements are confirmed.

Egyptian phone numbers must be normalized to international `+20` format before WhatsApp URLs are generated. WhatsApp uses direct links only, such as `https://wa.me/{phone}?text={message}`. No WhatsApp API automation is included in the initial release.

## 3. Approved Architecture

```text
React + Vite PWA on Vercel
        ↓
Vercel-hosted Express-compatible API functions
        ↓
Neon managed PostgreSQL
        ↓
Prisma migrations and typed data access
```

Vercel and Neon serve different purposes and will be used together. Vercel will host the frontend, PWA assets, preview deployments, and the initial API layer. Neon will host managed PostgreSQL. Vercel’s CDN serves static content close to users, while the application and database regions must be selected to minimize the database round trip.[1] Neon provides Vercel integration and preview database branching options.[2]

The API must remain portable. If future requirements need persistent processes, background workers, long-running tasks, or WebSocket connections, the backend may move to a dedicated Node host without changing the public API contract or frontend architecture.

## 4. Technology Baseline

We will use current stable versions that are mutually compatible at implementation time rather than preserving obsolete version numbers from the original draft. The selected versions will be recorded in `package.json` and the committed lockfile.

| Layer | Approved baseline |
|---|---|
| Runtime | Node.js 24 LTS; Node.js 26 Current is not the production baseline. The official release schedule identifies Node 24 as LTS.[3] |
| Package manager | pnpm workspaces with a committed lockfile |
| Frontend | React 19-compatible release, Vite current stable, TypeScript current stable, React Router current stable, TanStack Query current stable, and Tailwind CSS current stable |
| Backend | Express 5-compatible release, TypeScript current stable, Prisma current stable compatible with Node 24/PostgreSQL, and schema validation |
| Database | Managed PostgreSQL through Neon |
| Deployment | Vercel for application hosting; Neon for PostgreSQL |
| Testing | Vitest for unit/integration tests and browser-level workflow tests as the product becomes functional |

Exact package versions will be resolved during M1 and locked for reproducible builds. Dependencies must be reviewed for Node 24 compatibility before installation.

## 5. Core Data Model

The initial schema will include users, patients, appointments, therapy sessions, invoices, payments, rooms, and settings. The schema must include timestamps, explicit foreign-key behavior, appropriate unique constraints, validated enums, and an archival strategy where required.

Appointments must use timezone-aware timestamps and an explicit duration or end time. The backend—not only the frontend—must enforce therapist overlap rules, room conflicts, the six-room limit, and the maximum of two simultaneous patients per therapist. These checks must run transactionally.

Invoices and payments are manual in the initial release. The system will record cash, bank transfer, or other configured manual methods. It will not store card details, connect to a payment gateway, or process online payment webhooks in the first release.

Online payments are a future phase requiring a separately selected Egypt-supported provider, webhook handling, reconciliation, refunds, payment-failure states, and a security/compliance review.

## 6. Delivery Milestones

| Milestone | Scope | Acceptance criteria |
|---|---|---|
| **M1 — Foundation** | Monorepo, current compatible versions, Vercel configuration, Neon connection, Prisma schema, migrations, seed data, linting, formatting, type-checking, and CI. | Frontend and backend build locally; database schema can be migrated and seeded; CI checks are documented and reproducible. |
| **M2 — Secure access** | Login, logout, refresh/session handling, password hashing, role-based authorization, protected routes, and account isolation. | Each role can authenticate and unauthorized or cross-role access is rejected by automated tests. |
| **M3 — Scheduling MVP** | Patient registration, therapists, six rooms, appointment creation, confirmation, cancellation, rescheduling, conflict checks, and calendar queries. | A secretary can register a patient and book an appointment without violating room or therapist constraints. |
| **M4 — Treatment records** | Diagnosis, treatment plans, therapist notes, pain level, duration, attendance, and patient history. | Therapists can record assigned treatment sessions; patients can access only their own permitted records. |
| **M5 — Manual billing** | EGP invoices, configurable tax, manual payment statuses, branded PDF invoices, invoice history, and financial summaries. | Staff can create and download a readable Arabic/English PDF invoice using settings-driven center details. |
| **M6 — Role dashboards** | Owner, therapist, secretary, and patient screens with Arabic/English UI, RTL/LTR layouts, responsive behavior, and complete state handling. | Primary workflows operate end to end against the real API. |
| **M7 — Integrations and PWA** | WhatsApp deep links, Google Maps, in-app notifications, installability, IndexedDB caching, and scoped synchronization. | Core read workflows remain available offline and queued low-risk writes synchronize safely. |
| **M8 — Quality and launch** | Authorization, concurrency, PDF, browser workflow, security, performance, deployment, monitoring, backup, and rollback checks. | Critical workflows pass release gates and production procedures are documented. |

## 7. M1 Foundation Scope

M1 is the current implementation target. It must establish the repository without prematurely implementing business workflows.

### M1 repository structure

```text
Physio/
├── frontend/
│   ├── src/
│   └── package.json
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   └── package.json
├── packages/
│   └── contracts/
├── docs/
├── .env.example
├── .gitignore
├── package.json
├── pnpm-workspace.yaml
└── Project_plan.md
```

Each meaningful responsibility must have a focused file. Routes/controllers, validation, authorization, business operations, data access, and external integrations must not be combined into large dumping-ground files. Frontend pages and reusable UI components must also remain separated by responsibility.

### M1 implementation tasks

1. Create the pnpm workspace and frontend/backend package boundaries.
2. Configure Node 24, TypeScript, ESLint, Prettier, and shared scripts.
3. Add environment templates without committing secrets.
4. Add the initial Prisma PostgreSQL schema for the eight core domains.
5. Add the first migration and deterministic development seed data.
6. Configure Vercel project settings for the application and API entry point.
7. Add health-check endpoints and minimal frontend/backend smoke screens.
8. Add CI checks for installation, formatting, linting, type-checking, and tests.
9. Document local setup, Neon connection configuration, migrations, seeding, and deployment variables.

M1 does not include patient workflows, dashboards, online payments, production credentials, or irreversible production database changes.

## 8. Security and Reliability Principles

Passwords must use a modern adaptive password hash. Sessions and secrets must be stored through environment configuration and never committed. All protected operations require server-side authorization. Sensitive patient data must not be exposed through logs or overly broad API responses.

The database is the source of truth for scheduling constraints. Any offline write strategy must define conflict behavior before implementation. Financial actions require explicit loading, error, and confirmation states. Backups, migration procedures, and rollback instructions are release requirements.

## 9. Local Development and Deployment

Local development will use Node 24 LTS and pnpm. A development Neon database may be used through `DATABASE_URL`; preview environments should use isolated database branches where practical. Production secrets must be configured in Vercel and must not be committed to Git.

The Vercel Function region should be configured as close as practical to the selected Neon database region. The initial free-tier deployment will use a single Function region. Multi-region failover is a later reliability enhancement, not an M1 requirement.[1]

## 10. Decision Log

| Decision | Status |
|---|---|
| Use current compatible versions | Approved |
| Use Node 24 LTS production baseline | Approved |
| Use Vercel for application hosting | Approved |
| Use Neon for PostgreSQL | Approved |
| Launch country is Egypt | Approved |
| Default currency is EGP | Approved |
| Default timezone is Africa/Cairo | Approved |
| Online payments in initial release | Explicitly deferred |
| Manual payment recording in initial release | Approved |
| WhatsApp API automation | Not in initial release; direct links only |
| Railway backend hosting | Not selected for initial release; retain as a future portability option |

## 11. References

[1]: https://vercel.com/docs/functions/configuring-functions/region "Vercel Functions regions and failover documentation"  
[2]: https://neon.com/docs/guides/vercel-overview "Neon and Vercel integration documentation"  
[3]: https://nodejs.org/en/about/previous-releases "Official Node.js release and LTS schedule"
