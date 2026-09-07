```markdown
# Physio Center Management System - Project Plan
## File of Truth

**Repository:** https://github.com/elnewahy2025/Physio
**Last Updated:** 2026-09-06
**Owner:** Khaled Osman
**Project Type:** Web Application (PWA) + Mobile (Android/iOS via PWA)

---

## 1. Project Overview

### Purpose
Progressive Web Application (PWA) for managing a physiotherapy center with appointment scheduling, patient records, invoicing, payments, and offline support.

### Target Users
| Role | Responsibilities |
|------|------------------|
| **Owner** | Full access, financial reports, user management, settings |
| **Therapist** | Manage appointments, patient records, treatment notes |
| **Secretary** | Manage appointments, patients, invoicing, WhatsApp reminders |
| **Patient** | Book appointments, view records, pay invoices, receive notifications |

### Key Features
- Multi-role access control (Owner, Therapist, Secretary, Patient)
- Appointment management (scheduling, confirmation, cancellation)
- Patient medical records (history, diagnosis, treatment plans)
- Invoicing and payments (**PDF generation with center logo**)
- WhatsApp reminders (**direct links: https://wa.me/{phone}**)
- Real-time in-app notifications
- **Offline mode** (PWA with local storage and auto-sync)
- **Multi-language support** (Arabic RTL + English)
- Google Maps integration
- **Centralized settings** (NO hardcoded data)

---

## 2. Requirements

### Functional
- **Owner:** Dashboard, user management, settings, financial/performance reports
- **Therapist:** Calendar, patient records, treatment notes, attendance
- **Secretary:** Appointments, patient registration, invoicing, payments, WhatsApp links
- **Patient:** Booking, medical records, payments, notifications, ratings

### Non-Functional
- Platform: Web (PWA) + Mobile via PWA
- Database: PostgreSQL (Neon.tech or Railway - free)
- Encryption: AES (data) + bcrypt (passwords)
- Offline: IndexedDB + Service Worker
- Language: Arabic RTL + English
- Browser: Chrome, Firefox, Safari
- **Concurrency:** 6 rooms, 4 therapists, max 2 patients/therapist simultaneously

---

## 3. System Architecture

```
Client (React PWA)
  → API Gateway (Node.js + Express)
    → PostgreSQL Database
```

### Data Flow
```
Patient Books → API → Backend → Database → Confirm → Notification + WhatsApp Link
Therapist Updates → API → Backend → Database → Sync
Secretary Creates Invoice → API → Backend → Generate PDF → Return
```

---

## 4. Database Schema (PostgreSQL)

### Tables (8 total):

1. **users** - id, name, email, phone, password_hash, role, created_at
2. **patients** - id, name, phone, email, address, medical_history, date_of_birth, created_at
3. **appointments** - id, patient_id, therapist_id, room_id, date_time, status, notes, created_at
4. **therapy_sessions** - id, appointment_id, therapist_id, diagnosis, treatment_plan, notes, duration, pain_level, created_at
5. **invoices** - id, patient_id, appointment_id, amount, tax, total, due_date, status, payment_method, created_by, created_at
6. **payments** - id, invoice_id, amount, method, status, transaction_id, payment_date, created_at
7. **rooms** - id, number (1-6), name, is_occupied, current_appointment_id
8. **settings** - id, center_name, center_logo, address, phone, email, google_maps_link, working_hours, session_price, currency, tax_rate, default_language, whatsapp_message_template

---

## 5. API Endpoints

### Auth
- POST /api/auth/login
- POST /api/auth/logout
- POST /api/auth/refresh

### Core
- GET/POST/PUT/DELETE /api/users
- GET/POST/PUT/DELETE /api/patients
- GET/POST/PUT/DELETE /api/appointments
- GET/POST/PUT/DELETE /api/invoices
- GET /api/invoices/:id/pdf

### Settings
- GET/PUT /api/settings
- POST /api/settings/logo

---

## 6. Technologies

### Frontend
- React 18 + TypeScript 5
- TailwindCSS 3 (RTL plugin)
- Vite 4
- React Router 6
- React Query 5
- Zustand 4
- **jsPDF 2 + html2canvas 1** (PDF generation)
- react-dropzone 14
- react-toastify 10

### Backend
- Node.js 20 + Express 4 + TypeScript 5
- PostgreSQL 15
- Prisma 5
- JWT 9 + bcrypt 5

### Hosting (All Free)
- Frontend: Vercel
- Backend: Railway
- Database: Neon.tech

---

## 7. Implementation Plan (14 Weeks)

### Phase 1: Setup (Week 1-2)
- Initialize repository
- Project structure (frontend/backend)
- TypeScript, ESLint, Prettier
- PostgreSQL (Neon.tech)
- Prisma ORM
- JWT authentication
- Database schema

### Phase 2: Backend (Week 3-5)
- User Management API
- Patient Management API
- Appointment Management API
- Therapy Session API
- Invoice and Payment API
- Settings API
- Reporting API
- Room Management API

### Phase 3: Frontend (Week 6-9)
- React + TypeScript + Vite
- TailwindCSS with RTL
- All dashboards (Owner, Therapist, Secretary, Patient)
- **PDF generation**
- PWA configuration
- WhatsApp + Google Maps integration

### Phase 4: Testing (Week 10-12)
- Integration testing
- User flow testing
- Edge cases
- PDF testing (Arabic)
- Performance & security

### Phase 5: Deployment (Week 13-14)
- Production database
- Backend (Railway)
- Frontend (Vercel)
- Environment variables
- Documentation

---

## 8. Timeline

| Phase | Duration | Dates |
|-------|----------|-------|
| Phase 1 | 2 weeks | Sep 8-21, 2026 |
| Phase 2 | 3 weeks | Sep 22-Oct 12, 2026 |
| Phase 3 | 4 weeks | Oct 13-Nov 9, 2026 |
| Phase 4 | 3 weeks | Nov 10-30, 2026 |
| Phase 5 | 2 weeks | Dec 1-14, 2026 |
| **Total** | **14 weeks** | |

---

## 9. File Structure

```
physio/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── store/
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── app.ts
│   │   └── server.ts
│   ├── prisma/
│   │   └── schema.prisma
│   └── package.json
│
├── docs/
├── .gitignore
└── PROJECT_PLAN.md
```

---

## 10. Setup Instructions

```bash
git clone https://github.com/elnewahy2025/Physio.git
cd Physio

# Backend
cd backend && npm install && npm run dev

# Frontend
cd ../frontend && npm install && npm run dev
```

### Environment Variables

**Backend (.env):**
```env
DATABASE_URL=postgresql://user:password@host:port/database
JWT_SECRET=your_jwt_secret
PORT=3000
```

**Frontend (.env):**
```env
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=Physio Center
```

---
---
## 11. Critical Notes

✅ **WhatsApp:** Direct links only (https://wa.me/{phone}?text=message)
✅ **PDF:** Real PDF with jsPDF + html2canvas (not screenshots)
✅ **Offline:** PWA with Service Worker + IndexedDB
✅ **RTL:** Full Arabic support via TailwindCSS RTL plugin
✅ **No Hardcoded Data:** ALL center info via Settings table
✅ **Rooms:** 6 rooms, 4 therapists, max 2 patients/therapist at same time
✅ **Security:** JWT + bcrypt + AES encryption

---
**This is the File of Truth. All decisions must be reflected here.**
```

---

