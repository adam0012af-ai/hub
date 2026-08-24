# MovieHub Final Cloudflare Panel

## Included
- Cloudflare Worker dashboard/API
- Cloudflare D1 persistent catalog
- Movies and series schema, episodes schema
- Multiple sources with priority
- Search/filter
- JSON catalog import (up to 1000 per request)
- Admin-token protection for writes
- Public read API for an Android app

## One-time Cloudflare setup
1. Create a D1 database named `moviehub-db`.
2. Copy its database ID into `wrangler.jsonc` replacing `REPLACE_WITH_D1_DATABASE_ID`.
3. Apply `migrations/0001_init.sql` to the D1 database from the Cloudflare dashboard (D1 Console) or Wrangler.
4. Add a Worker secret named `ADMIN_TOKEN` with a strong random value.
5. Deploy.

Use only catalogs and media sources you are authorized to distribute.
