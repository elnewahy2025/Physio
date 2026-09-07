# M1 Foundation Setup

## Requirements

Use Node.js 24 LTS and pnpm. Copy `.env.example` to `.env` and replace `DATABASE_URL` with a Neon PostgreSQL connection string.

## Install and validate

```bash
pnpm install
pnpm typecheck
pnpm lint
pnpm build
pnpm test
```

## Database commands

```bash
pnpm db:generate
pnpm db:migrate
pnpm db:seed
```

The initial migration should be generated locally after `DATABASE_URL` is configured. Production migrations must be reviewed before being applied to the production database.

## Run locally

```bash
pnpm --filter @physio/backend dev
pnpm --filter @physio/frontend dev
```

The backend health endpoint is available at `http://localhost:3000/health`. Configure `VITE_API_URL` if the frontend uses a different API origin.
