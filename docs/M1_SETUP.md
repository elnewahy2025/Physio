# M1 Foundation Setup

## Requirements

- **Node.js**: 24 LTS (required)
- **Package Manager**: pnpm 10+
- **Database**: Neon PostgreSQL (recommended) or local PostgreSQL 15+

## Quick Start

```bash
# Clone the repository
git clone https://github.com/elnewahy2025/Physio.git
cd Physio

# Install dependencies
pnpm install

# Copy environment templates
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Configure database URL in .env and backend/.env
# For Neon: postgresql://user:password@host:5432/db?sslmode=require
# For local: postgresql://localhost:5432/physio?schema=public
```

## Install and Validate

Run all CI checks locally:

```bash
# Install dependencies
pnpm install

# Check code formatting
pnpm format:check

# Run linter
pnpm lint

# Type checking
pnpm typecheck

# Build project
pnpm build

# Run tests
pnpm test
```

## Database Commands

```bash
# Generate Prisma client
pnpm db:generate

# Create and apply migrations
pnpm db:migrate

# Seed the database with initial data (6 rooms, default settings)
pnpm db:seed
```

**Note**: The initial migration (`20260907084230_init`) is already committed. To apply it to your database:

```bash
pnpm db:migrate deploy
```

## Run Locally

In separate terminals:

```bash
# Start backend server (port 3000)
pnpm --filter @physio/backend dev

# Start frontend dev server (port 5173)
pnpm --filter @physio/frontend dev
```

Access the application:

- **Frontend**: http://localhost:5173
- **API Health**: http://localhost:3000/api/health

## Project Structure

```
Physio/
├── backend/                 # Express API server
│   ├── src/
│   │   ├── app.ts          # Express app configuration
│   │   ├── server.ts       # Server entry point (Vercel-compatible)
│   │   ├── routes/         # API route definitions
│   │   │   ├── index.ts    # Main API router
│   │   │   └── health.ts   # Health check endpoint
│   │   ├── middleware/      # Express middleware
│   │   │   ├── validation.ts # Zod validation middleware
│   │   │   ├── errors.ts    # Error handling middleware
│   │   │   └── index.ts     # Middleware exports
│   │   └── types/          # Type declarations
│   │       └── express.d.ts # @vercel/express types
│   ├── prisma/
│   │   ├── schema.prisma   # Database schema
│   │   ├── seed.ts         # Seed data
│   │   └── migrations/     # Database migrations
│   └── package.json
├── frontend/                # React frontend (Vite + Tailwind)
│   ├── src/
│   │   ├── App.tsx         # Root component
│   │   ├── main.tsx        # Entry point
│   │   ├── index.css       # Tailwind CSS imports
│   │   ├── lib/
│   │   │   ├── api-client.ts # Typed API client
│   │   │   └── query-client.ts # TanStack Query config
│   │   ├── components/
│   │   │   └── Layout.tsx  # Page layout
│   │   └── pages/
│   │       └── Home.tsx    # Home page
│   ├── tailwind.config.js  # Tailwind configuration
│   ├── postcss.config.mjs  # PostCSS configuration
│   └── package.json
├── packages/
│   └── contracts/          # Shared TypeScript types
│       └── src/
│           └── index.ts    # API contract types
├── .github/
│   └── workflows/
│       └── ci.yml          # GitHub Actions CI
├── vercel.json            # Vercel configuration
├── pnpm-workspace.yaml    # pnpm workspace config
├── .prettierrc            # Prettier configuration
├── .prettierignore        # Prettier ignore patterns
└── .env.example            # Environment templates
```

## Technology Stack

| Layer            | Technology                       | Version |
| ---------------- | -------------------------------- | ------- |
| Runtime          | Node.js                          | 24 LTS  |
| Package Manager  | pnpm                             | 10+     |
| Frontend         | React 19 + Vite 8 + TypeScript 5 | Latest  |
| Styling          | Tailwind CSS 3                   | Latest  |
| Backend          | Express 5 + TypeScript 5         | Latest  |
| ORM              | Prisma 7                         | 7.10.0  |
| Database         | PostgreSQL                       | 15+     |
| Hosting          | Vercel (frontend + backend)      | -       |
| Database Hosting | Neon (managed PostgreSQL)        | -       |

## Configuration

### Environment Variables

#### Root `.env`

```
DATABASE_URL="postgresql://user:password@localhost:5432/physio?schema=public"
PORT=3000
VITE_API_URL="http://localhost:3000"
```

#### Backend `.env`

```
DATABASE_URL="postgresql://user:password@localhost:5432/physio?schema=public"
PORT=3000
```

#### Frontend `.env`

```
VITE_API_URL="http://localhost:3000"
```

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect the `vercel.json` configuration
3. Set environment variables in Vercel dashboard:
   - `DATABASE_URL`: Your Neon PostgreSQL connection string
   - `PORT`: 3000 (optional)
4. Deploy!

The backend API will be available at `/api/*` paths.

## CI/CD

GitHub Actions workflow (`.github/workflows/ci.yml`) runs on every push and PR to `main`:

- Dependency installation
- Code formatting check
- Linting
- Type checking
- Tests
- Build verification

## Architecture Decisions

### Monorepo Structure

- **pnpm workspaces** for dependency management
- **Shared contracts package** for type safety between frontend and backend
- **Separate build processes** for frontend and backend

### API Design

- RESTful endpoints under `/api/` prefix
- Zod validation for all inputs
- Consistent error response format
- Type-safe contracts shared between layers

### Frontend

- React 19 with TypeScript
- TanStack Query for data fetching
- Tailwind CSS for styling
- Vite for bundling

### Backend

- Express 5 with TypeScript
- Prisma ORM for database access
- Vercel serverless functions for deployment
- Middleware for validation and error handling

## Troubleshooting

### "No matching version found for @vercel/express"

The package was updated from `^1.1.0` to `^7.0.2`. Ensure you're using the latest version.

### "Unsupported engine: wanted: {\"node\":\">=24.0.0 <25\"}"

This is a warning, not an error. The project requires Node.js 24 LTS. If you're using Node.js 22, the project will still work but you may encounter compatibility issues.

### Database connection errors

Ensure your `DATABASE_URL` is correct and includes the `?sslmode=require` parameter for Neon connections.

### Prisma migration issues

If you need to reset your database:

```bash
pnpm db:migrate reset
```

## Useful Commands

| Command                  | Description                                    |
| ------------------------ | ---------------------------------------------- |
| `pnpm dev`               | Run both frontend and backend in dev mode      |
| `pnpm build`             | Build both frontend and backend for production |
| `pnpm lint`              | Run ESLint on all packages                     |
| `pnpm typecheck`         | Run TypeScript type checking                   |
| `pnpm test`              | Run all tests                                  |
| `pnpm format:check`      | Check code formatting                          |
| `npx prettier --write .` | Format all files                               |
