# Inventory & Order Management System

Production-ready full-stack assessment project for managing products, customers, orders, and inventory tracking.

## Tech Stack

- Backend: Python, FastAPI, SQLAlchemy
- Frontend: React, Vite
- Database: PostgreSQL
- Containers: Docker and Docker Compose

## Features

- Product CRUD with unique SKU validation
- Customer create/list/detail/delete with unique email validation
- Order create/list/detail/delete
- Automatic backend total calculation
- Inventory validation before order placement
- Automatic stock reduction after order creation
- Dashboard totals for products, customers, orders, and low-stock products
- Responsive React UI with validation and success/error messages

## API Endpoints

- `GET /health`
- `GET /dashboard`
- `POST /products`
- `GET /products`
- `GET /products/{id}`
- `PUT /products/{id}`
- `DELETE /products/{id}`
- `POST /customers`
- `GET /customers`
- `GET /customers/{id}`
- `DELETE /customers/{id}`
- `POST /orders`
- `GET /orders`
- `GET /orders/{id}`
- `DELETE /orders/{id}`

## Local Setup

Create a local environment file:

```bash
cp .env.example .env
```

Run the full stack:

```bash
docker compose up --build
```

Open:

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000`
- API docs: `http://localhost:8000/docs`

## Environment Variables

Backend:

- `DATABASE_URL`

PostgreSQL:

- `POSTGRES_DB`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`

Frontend:

- `VITE_API_BASE_URL`

## Deployment

Recommended free deployment path:

1. Push this repository to GitHub.
2. Create a PostgreSQL database on Render.
3. Deploy the backend on Render using the `backend/Dockerfile` or `render.yaml`.
4. Set backend `DATABASE_URL` to the Render PostgreSQL external/internal connection string.
5. Deploy the frontend on Netlify or Vercel from the `frontend` directory.
6. Set frontend `VITE_API_BASE_URL` to the deployed backend URL.
7. Build and push the backend Docker image to Docker Hub:

```bash
docker build -t <dockerhub-username>/inventory-order-api:latest ./backend
docker push <dockerhub-username>/inventory-order-api:latest
```

## Submission Fields

- GitHub Repository Link: `https://github.com/shivamg9/inventory-order-management-system`
- Backend Docker Hub Image Link: `https://hub.docker.com/r/<dockerhub-username>/inventory-order-api`
- Frontend Hosted URL: Netlify or Vercel URL after deployment
- Backend API Hosted URL: Render URL after deployment
