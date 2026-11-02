# SSAG Command Center — authenticated durable CRM

The current Render backend runs `server.js`, a **safe, deliberately disabled compatibility API**. This branch adds `crm-server.js` and SQL schema for durable tenant-scoped CRM, but **does not switch the live service** until the prerequisites below are satisfied.

## Required before activation
1. Confirm production database choice and provision a dedicated database/role. The SQL migration references `organizations` and `users` from the existing SSAG identity schema. Review migration in a staging branch first; avoid production schema changes without backups.
2. Confirm the actual `sessions` table's token storage, expiration, and user relation. The proposed SHA-256 bearer token lookup assumes `sessions(token_hash,user_id,expires_at)`; adapt to the actual deployed identity provider. **Never deploy an unverified token format.**
3. Set `DATABASE_URL` in Render secret configuration and restrict `CORS_ORIGIN` to approved exact frontend origins.
4. Install `pg` dependency and switch start command to `node crm-server.js` only after staging tests pass.
5. Test: no bearer token → 401; expired/revoked token → 401; non-owner writes → 403; owner creates a test client, deal, invoice → 201; restart backend → all three persist; another tenant cannot see or modify them; audit events exist; invoice cannot be marked paid without verified provider evidence.
6. Implement approved frontend sign-in using the actual identity provider; the repo's previous frontend source is missing. Vercel READY does not establish an authenticated dashboard.
7. Confirm billing and financial ledger against PayPal before displaying paid revenue. Invoice drafts are not payment receipts.

## Design controls
- Money uses integer cents, never floating-point currency.
- All CRM queries scope by organization ID; client IDs are cross-checked for invoice creation.
- Mutations and audit events commit atomically.
- No public demo credentials, seed passwords, payment forgery, or fake contacts.
- Legacy unauthenticated endpoints return 410.
- Existing Render compatibility service remains safe until replacement is proven.

## Current status
**Code committed for review; not deployed; not yet end-to-end verified.** The project is not production CRM ready. This record intentionally distinguishes repository progress from operational proof.
