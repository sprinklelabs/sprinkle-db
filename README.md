# sprinkle-db

PostgreSQL database schema and Drizzle ORM configuration for the Sprinkle platform.

This package is consumed by [sprinkle-api](https://github.com/sprinklelabs/sprinkle-api) and can be used standalone for running migrations or inspecting the schema.

## Stack

- **ORM:** Drizzle ORM
- **Validation:** Drizzle-Zod, Zod
- **Database:** PostgreSQL 15+

## Schema

| Table | Description |
|---|---|
| `users` | Platform user accounts |
| `projects` | Developer projects and configuration |
| `api_keys` | Scoped API keys per project |
| `ai_requests` | AI inference request logs |
| `wallets` | Smart wallet records and metadata |
| `relay` | Relay intent submissions and status |
| `domains` | Provisioned domain records |
| `billing` | Credits, usage, and onchain billing records |
| `activity` | Audit log and activity feed |

## Getting started

```bash
git clone https://github.com/sprinklelabs/sprinkle-db
cd sprinkle-db
pnpm install
cp .env.example .env
# Set DATABASE_URL
pnpm push      # Push schema to the database
```

## Scripts

```bash
pnpm push        # Push schema changes (safe)
pnpm push-force  # Push and reset (destructive)
```

## Usage as a library

```ts
import { db } from '@sprinkle/db';
import { users, projects } from '@sprinkle/db/schema';

const result = await db.select().from(users).where(...);
```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

MIT. See [LICENSE](./LICENSE).
