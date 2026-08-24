# MovieHub Cloudflare Demo
Cloudflare Worker demo for an admin panel and app API.

## Cloudflare
Build command: `npm install`
Deploy command: `npx wrangler deploy`

This V1 keeps demo data in Worker memory, so additions are not durable. The next version should bind Cloudflare D1 for persistent catalog/source data and add authentication before production use.
