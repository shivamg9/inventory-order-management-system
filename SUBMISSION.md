# Assessment Submission

## Completed Form Values

GitHub Repository Link (Frontend + Backend)

`https://github.com/shivamg9/inventory-order-management-system`

Backend Docker Hub Image Link

`https://hub.docker.com/r/shivamg9/inventory-order-api`

Frontend Hosted URL

`https://inventory-order-management-system.netlify.app`

Backend API Hosted URL

`https://inventory-order-api.onrender.com`

## Publish Checklist

Run these after creating/logging into the required accounts.

```bash
git push -u origin main
```

```bash
docker build -t shivamg9/inventory-order-api:latest ./backend
docker login
docker push shivamg9/inventory-order-api:latest
```

Deploy backend on Render:

- Repository: `https://github.com/shivamg9/inventory-order-management-system`
- Root directory: `backend`
- Environment: Docker
- Health check path: `/health`
- Environment variable: `DATABASE_URL=<Render PostgreSQL connection string>`

Deploy frontend on Netlify:

- Repository: `https://github.com/shivamg9/inventory-order-management-system`
- Base directory: `frontend`
- Build command: `npm run build`
- Publish directory: `frontend/dist`
- Environment variable: `VITE_API_BASE_URL=https://inventory-order-api.onrender.com`

## Quick Verification

- API health: `https://inventory-order-api.onrender.com/health`
- API docs: `https://inventory-order-api.onrender.com/docs`
- Frontend: `https://inventory-order-management-system.netlify.app`
