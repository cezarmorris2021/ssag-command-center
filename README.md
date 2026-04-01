# SSAG Command Center Full Stack

SSAG-level full-stack starter for a live company command center.

## What this build includes
- React frontend dashboard
- Express backend API
- JWT authentication
- JSON-file persistence for quick startup
- Live dashboard polling
- Divisions, deals, clients, invoices, alerts, activity log
- Professional documentation

## Why I added extra features automatically
These were added because they are foundational enterprise pieces people often need but do not always know to ask for:
- authentication
- API layer
- persistent storage
- seed admin user
- alerts engine
- audit/activity log
- import/export endpoint
- system documentation

## Quick start
### Backend
1. Open terminal in `backend`
2. Run `npm install`
3. Run `npm run dev`
4. Backend starts on `http://localhost:4000`

### Frontend
1. Open another terminal in `frontend`
2. Run `npm install`
3. Run `npm run dev`
4. Open the local URL Vite shows you

## Default login
- Email: `admin@ssag.local`
- Password: `ChangeMe123!`

Change the password immediately after setup.

## Recommended next production upgrades
- Postgres instead of JSON file storage
- HTTPS deployment
- role-based permissions
- real email integration
- file/document storage
- notification service
- backup automation


## Deployment-ready additions
- Render backend blueprint (`render.yaml`)
- Vercel frontend config (`frontend/vercel.json`)
- Environment variable examples
- `DEPLOY_NOW.md` step-by-step deployment guide
