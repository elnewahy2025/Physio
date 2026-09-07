# Physio

> **Physical Therapy Center Management System** for Egypt

A responsive Progressive Web Application (PWA) for managing physiotherapy centers with support for appointments, patient records, treatment notes, invoicing, and role-based workflows.

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Copy environment files
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Configure your database URL in .env files
# For Neon: postgresql://user:password@host:5432/db?sslmode=require

# Run the application
pnpm --filter @physio/backend dev    # Backend (port 3000)
pnpm --filter @physio/frontend dev  # Frontend (port 5173)
```

Then open:
- **Frontend**: http://localhost:5173
- **API Health Check**: http://localhost:3000/api/health

## ✨ Features

### Core Functionality
- ✅ **Multi-role access**: Owner, Therapist, Secretary, Patient
- ✅ **Appointment scheduling** with conflict detection
- ✅ **Patient records** and medical history
- ✅ **Treatment notes** and session tracking
- ✅ **Manual invoicing** with EGP currency support
- ✅ **Payment recording** (cash, bank transfer)
- ✅ **Branded PDF invoices** (planned)
- ✅ **WhatsApp deep links** for notifications
- ✅ **Arabic/English localization** with RTL/LTR support

### Technical Features
- ✅ **Monorepo** with pnpm workspaces
- ✅ **Type-safe API contracts** shared between frontend and backend
- ✅ **Express 5** backend with Zod validation
- ✅ **React 19** frontend with TanStack Query
- ✅ **Tailwind CSS** for styling
- ✅ **Prisma ORM** with PostgreSQL
- ✅ **Vercel-ready** deployment configuration
- ✅ **GitHub Actions CI** for quality checks

## 📁 Project Structure

```
Physio/
├── backend/                 # Express API server
│   ├── src/
│   │   ├── app.ts          # Express configuration
│   │   ├── server.ts       # Server entry (Vercel-compatible)
│   │   ├── routes/         # API endpoints
│   │   ├── middleware/      # Validation & error handling
│   │   └── types/          # Type declarations
│   └── prisma/             # Database schema & migrations
├── frontend/                # React frontend
│   ├── src/
│   │   ├── App.tsx         # Root component
│   │   ├── lib/            # API client & utilities
│   │   ├── components/     # Reusable UI components
│   │   └── pages/          # Page components
│   ├── tailwind.config.js  # Tailwind configuration
│   └── postcss.config.mjs  # PostCSS configuration
├── packages/
│   └── contracts/          # Shared TypeScript types
├── docs/
│   └── M1_SETUP.md        # Detailed setup guide
├── .github/
│   └── workflows/
│       └── ci.yml          # CI/CD configuration
└── vercel.json            # Vercel deployment config
```

## 🎯 Milestones

| Milestone | Status | Description |
|----------|--------|-------------|
| **M1 - Foundation** | ✅ **Complete** | Monorepo, Vercel config, Prisma schema, CI/CD |
| **M2 - Secure Access** | 📋 Planned | Authentication, authorization, sessions |
| **M3 - Scheduling MVP** | 📋 Planned | Appointments, rooms, conflict checks |
| **M4 - Treatment Records** | 📋 Planned | Therapy sessions, notes, attendance |
| **M5 - Manual Billing** | 📋 Planned | Invoices, payments, PDF generation |
| **M6 - Role Dashboards** | 📋 Planned | UI for all roles with RTL/LTR support |
| **M7 - Integrations** | 📋 Planned | WhatsApp links, PWA features, offline sync |
| **M8 - Launch** | 📋 Planned | Quality checks, deployment, monitoring |

## 🔧 Configuration

### Environment Variables

Create `.env` files in each directory:

**Root `.env`:**
```env
DATABASE_URL="postgresql://user:password@host:5432/physio?schema=public"
PORT=3000
VITE_API_URL="http://localhost:3000"
```

**Backend `.env`:**
```env
DATABASE_URL="postgresql://user:password@host:5432/physio?schema=public"
PORT=3000
```

**Frontend `.env`:**
```env
VITE_API_URL="http://localhost:3000"
```

### Database Setup

```bash
# Generate Prisma client
pnpm db:generate

# Apply migrations
pnpm db:migrate deploy

# Seed initial data (6 rooms, default settings)
pnpm db:seed
```

## 🏗️ Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Runtime** | Node.js 24 LTS | JavaScript runtime |
| **Package Manager** | pnpm | Fast, disk-space efficient |
| **Frontend** | React 19 + Vite 8 | Modern React with fast HMR |
| **Styling** | Tailwind CSS 3 | Utility-first CSS |
| **Backend** | Express 5 | Web framework |
| **ORM** | Prisma 7 | Type-safe database access |
| **Database** | PostgreSQL | Relational database |
| **Hosting** | Vercel | Frontend + serverless functions |
| **Database Host** | Neon | Managed PostgreSQL |

## 📊 Local Development

### Run everything
```bash
# In separate terminals
pnpm --filter @physio/backend dev    # Port 3000
pnpm --filter @physio/frontend dev  # Port 5173
```

### Run checks
```bash
pnpm install          # Install dependencies
pnpm format:check     # Check formatting
pnpm lint             # Run ESLint
pnpm typecheck        # Type checking
pnpm test             # Run tests
pnpm build            # Build for production
```

## 🚀 Deployment

### Vercel (Recommended)

1. Import the repository in Vercel
2. Add environment variables:
   - `DATABASE_URL`: Your Neon PostgreSQL URL
3. Deploy!

The backend will be available at `/api/*` paths automatically.

### Other Options

The backend can be deployed to any Node.js hosting (Railway, Render, etc.) by adjusting the `server.ts` configuration.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run checks: `pnpm lint && pnpm typecheck && pnpm test`
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Commit Message Conventions

- `feat: ` - New feature
- `fix: ` - Bug fix
- `docs: ` - Documentation changes
- `refactor: ` - Code refactoring
- `test: ` - Test-related changes
- `chore: ` - Maintenance tasks

## 📄 License

This project is private and proprietary. All rights reserved.

## 📞 Support

For questions or issues, please refer to:
- [Project Plan](./Project_plan.md) - File of truth for scope and architecture
- [M1 Setup Guide](./docs/M1_SETUP.md) - Detailed setup instructions

---

**Repository**: [https://github.com/elnewahy2025/Physio](https://github.com/elnewahy2025/Physio)

**Status**: M1 Foundation Complete ✅

**Launch Target**: Egypt (Africa/Cairo timezone, EGP currency)
