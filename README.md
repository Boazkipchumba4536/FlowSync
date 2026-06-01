# FlowSync

Zapier-inspired automation platform built with Next.js 14, Prisma, and SQLite.

## Quick start

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env

# Create database and seed demo data
npm run db:push
npm run db:seed

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Demo accounts

| Account | Email | Password |
|---------|-------|----------|
| Demo user | `demo@flowsync.io` | `demo123` |
| Admin | `admin@flowsync.io` | `admin123` |

- **Demo user** — sample workflows, apps, and agents
- **Admin** — access `/admin` for platform management
- **New signups** — start with empty workspace (no pre-filled demo data)

## Features

- **Marketing site** — landing, pricing, docs, product pages
- **Auth** — signup, login, JWT session cookies
- **Dashboard** — workflows, apps, agents, tables, forms, chatbots, history
- **Workflow engine** — server-side execution with run logs
- **Admin panel** — users, workflows, integrations, audit log, settings

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run db:push` | Sync Prisma schema to SQLite |
| `npm run db:seed` | Seed integrations and demo accounts |

## Environment variables

```env
DATABASE_URL="file:./dev.db"
AUTH_SECRET="your-long-random-secret"
```

## Tech stack

- Next.js 14 (App Router)
- TypeScript, Tailwind CSS, Framer Motion
- Prisma ORM + SQLite
- JWT auth (httpOnly cookies) via jose + bcryptjs

## Production notes

For production, switch `DATABASE_URL` to PostgreSQL and set a strong `AUTH_SECRET`. Run migrations instead of `db:push`.
