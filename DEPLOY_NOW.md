# SSAG Command Center - Deploy Now Guide

This package is prepared for a simple production-style deployment:
- Frontend on Vercel
- Backend on Render

## What you need
1. A GitHub account
2. A Vercel account
3. A Render account
4. Later: your SSAG domain

## Folder layout
- `frontend/` -> Vite React app
- `backend/` -> Express API
- `render.yaml` -> Render backend blueprint
- `frontend/vercel.json` -> Vercel frontend config

## Step 1 - Put the code on GitHub
1. Unzip this package.
2. Create a new GitHub repository.
3. Upload the `ssag_command_center_fullstack` folder contents.

## Step 2 - Deploy the backend on Render
1. Sign in to Render.
2. Click New > Web Service.
3. Connect your GitHub repository.
4. Select the repository.
5. Set Root Directory to `ssag_command_center_fullstack/backend`.
6. Runtime: Node.
7. Build Command: `npm install`
8. Start Command: `npm start`
9. Add environment variables:
   - `JWT_SECRET` = long random secret
   - `CORS_ORIGIN` = your frontend Vercel URL after frontend is deployed
10. Deploy.
11. Copy the backend URL. Example: `https://ssag-command-center-backend.onrender.com`

## Step 3 - Deploy the frontend on Vercel
1. Sign in to Vercel.
2. Click Add New > Project.
3. Import the same GitHub repository.
4. Set Root Directory to `ssag_command_center_fullstack/frontend`.
5. Add environment variable:
   - `VITE_API_BASE` = `https://YOUR-RENDER-URL/api`
6. Deploy.
7. Copy the Vercel URL.

## Step 4 - Tighten backend CORS
1. Go back to Render.
2. Edit `CORS_ORIGIN`.
3. Paste your Vercel app URL.
4. Save and redeploy.

## Step 5 - Log in
Default login:
- Email: `admin@ssag.local`
- Password: `ChangeMe123!`

Change the password in code/database before production use.

## Step 6 - Connect a custom domain later
- Frontend custom domain -> Vercel project settings
- Backend custom domain -> Render service settings

## Recommended immediate upgrades
1. Replace JSON persistence with Postgres
2. Add password reset flow
3. Add role-based permissions
4. Add file/document uploads
5. Add real email integration
