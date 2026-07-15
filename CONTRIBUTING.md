# Contributing to sprinkle-db

## Setup

```bash
git clone https://github.com/sprinklelabs/sprinkle-db
cd sprinkle-db
pnpm install
cp .env.example .env
# Set DATABASE_URL to a local Postgres instance
pnpm push
```

## Adding a table or column

1. Create or edit a schema file in `src/schema/`.
2. Export it from `src/schema/index.ts`.
3. Run `pnpm push` to apply to your local database.
4. Open a pull request with a description of why the change is needed.

## Guidelines

- Never use `pnpm push-force` in a pull request. That flag is for local resets only.
- Add Zod validators via `drizzle-zod` for any new table.

## Reporting issues

Open a GitHub Issue describing the schema problem or migration failure.
