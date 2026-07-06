# Deployment Guide

## Prerequisites

- Node.js 20+
- A Supabase project (free tier works)

---

## 1. Supabase Setup

1. Go to [supabase.com](https://supabase.com) and create a project
2. In Project Settings → Database, copy the **Connection string** (URI)
3. Use the `pgbouncer` variant (port **6543**) for serverless/connection pooling:

   ```
   postgresql://postgres:[PASSWORD]@[HOST]:6543/postgres?pgbouncer=true
   ```

---

## 2. Environment Variables

Create `.env` (or copy `.env.example`):

```env
# Supabase PostgreSQL (use pgbouncer port for serverless)
DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST]:6543/postgres?pgbouncer=true"

# NextAuth – generate a strong secret:
#   openssl rand -base64 32
AUTH_SECRET="your-generated-secret"

AUTH_TRUST_HOST=true

# NextAuth providers (add as needed)
# AUTH_GITHUB_ID=
# AUTH_GITHUB_SECRET=
# AUTH_GOOGLE_ID=
# AUTH_GOOGLE_SECRET=
```

> **⚠️** Never commit `.env` to version control. The `.gitignore` already excludes it.

---

## 3. Database Migrations

```bash
# If Prisma CLI is missing, reinstall:
npm install

# Regenerate the Prisma client for PostgreSQL:
npx prisma generate

# Push the schema to Supabase:
npx prisma db push

# (or create a migration file):
npx prisma migrate dev --name init
```

The Prisma client is output to `src/generated/prisma` (gitignored).

---

## 4. Seed Data (optional)

```bash
npx prisma db seed
```

---

## 5. Deploy

### Option A — Vercel (recommended)

```bash
npm i -g vercel
vercel --prod
```

Set the environment variables above in the Vercel dashboard (Settings → Environment Variables).

**Framework preset**: Next.js is auto-detected.

### Option B — Docker

Create a `Dockerfile` in the project root:

```dockerfile
FROM node:22-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate && npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=base /app/.next ./.next
COPY --from=base /app/public ./public
COPY --from=base /app/package.json ./package.json
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/next.config.ts ./
EXPOSE 3000
CMD ["npm", "start"]
```

Build and run:

```bash
docker build -t tbpglobalstrategist .
docker run -p 3000:3000 --env-file .env tbpglobalstrategist
```

### Option C — Node.js (PM2)

```bash
npm run build
npm i -g pm2
pm2 start npm --name "tbpglobalstrategist" -- start
pm2 save
pm2 startup
```

---

## 6. Verify

Visit `https://your-domain.com` — the app runs on port 3000 by default.
