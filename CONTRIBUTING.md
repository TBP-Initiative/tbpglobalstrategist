# Contributing to TBP Global Strategist

## Branch Strategy

```
main          ← Production (stable, always deployable)
  └── dev     ← Integration branch (all new work goes here)
        └── feature/*   ← Individual features
```

| Branch | Purpose | Deploys To |
|--------|---------|------------|
| `main` | Production-ready code | tbpglobalstrategist.vercel.app |
| `dev` | Integration & testing | Preview URL (auto-deployed) |
| `feature/*` | Individual work items | Local / preview |

## Workflow

### 1. Start New Work
```bash
git checkout dev
git pull origin dev
git checkout -b feature/your-feature-name
```

### 2. Work Locally
```bash
npm run dev
```

### 3. Commit Often
```bash
git add .
git commit -m "feat: add new feature"
```

Commit message prefixes:
- `feat:` — New feature
- `fix:` — Bug fix
- `docs:` — Documentation only
- `style:` — CSS/UI changes (no logic)
- `refactor:` — Code restructuring (no behavior change)
- `chore:` — Config, dependencies, tooling

### 4. Push & Create PR
```bash
git push origin feature/your-feature-name
```
Then create a Pull Request: `feature/*` → `dev`

### 5. Review & Merge to Dev
- Test on preview URL
- Review code changes
- Merge to `dev`

### 6. Deploy to Production
When `dev` is stable and tested:
- Create PR: `dev` → `main`
- Merge to `main` → auto-deploys to production

## Rules

### Do
- Branch from `dev` for all new work
- Test locally before pushing
- Write descriptive commit messages
- Keep PRs small and focused
- Update this file if workflow changes

### Don't
- Commit directly to `main`
- Force push to `main` or `dev`
- Rename or delete database columns
- Modify existing API response shapes
- Change authentication logic without discussion
- Merge untested code to `dev`

## Database Migrations

```bash
# Create new migration (local)
npx prisma migrate dev --name description_here

# Apply to production (after testing)
npx prisma migrate deploy
```

**Never:**
- Modify existing migration files
- Drop columns/tables without deprecation period
- Run migrations directly on production without testing

## Environment Setup

1. Copy `.env.example` to `.env`
2. Fill in database URL and auth secret
3. Run `npm install`
4. Run `npx prisma generate`
5. Run `npm run dev`

## Deployment

- `main` branch → Production (tbpglobalstrategist.vercel.app)
- `dev` branch → Preview URL (auto-deployed by Vercel)
- Feature branches → Manual deploy or local only

## Versioning

Current: **Version 1.0** (July 2026)

Version increments:
- **Minor (1.x):** New features, non-breaking changes
- **Major (x.0):** Breaking changes, major refactors

## Questions?

Open a GitHub issue or contact the team lead.
