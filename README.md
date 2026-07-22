# persona-chat-a8

A lightweight full-stack proof app for the **A8 Persona Chat** project.

- Frontend: Next.js 14 (standalone output)
- Backend: Express + TypeScript + PostgreSQL
- Inference: Hugging Face Inference API
- Training profile: Kaggle + Unsloth

## Features

- Chat UI where users send messages and see assistant replies.
- `POST /api/chat` forwards messages to a remote Hugging Face model.
- `GET /health` on the backend reports `status`, `db`, and the active `model` id.
- Minimal auth: register, login, and `/api/auth/me`.
- Frontend includes its own `/api/health` route for Railway health checks.

## API

### Backend

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| GET | `/health` | `{ "status": "ok", "db": "up", "model": "<id>" }` |
| POST | `/api/auth/register` | Create an account |
| POST | `/api/auth/login` | Log in and receive a JWT |
| GET | `/api/auth/me` | Current user (requires JWT) |
| POST | `/api/chat` | Send a message and receive a model reply (requires JWT) |

The chat route calls:

```http
POST https://api-inference.huggingface.co/models/${MODEL_ID}
Authorization: Bearer ${HUGGINGFACE_TOKEN}
Content-Type: application/json

{ "inputs": "<user message>" }
```

## Environment variables

### Frontend (`apps/frontend`)

| Variable | Required | Description |
| -------- | -------- | ----------- |
| `NEXT_PUBLIC_API_URL` | Yes | Base URL for the backend API |

### Backend (`apps/backend`)

| Variable | Required | Description |
| -------- | -------- | ----------- |
| `PORT` | No | Server port (default `8080`) |
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `JWT_SECRET` | Yes | Secret for signing JWTs |
| `HUGGINGFACE_TOKEN` | Yes | Hugging Face access token |
| `HF_MODEL_ID` | No | Fallback/base model id |
| `FINE_TUNED_MODEL_ID` | No | Fine-tuned model id, preferred over `HF_MODEL_ID` |
| `LLM_PROVIDER` | No | Default `huggingface` |
| `ALLOWED_ORIGINS` | No | Comma-separated CORS origins |

The active model id is resolved as `FINE_TUNED_MODEL_ID ?? HF_MODEL_ID ?? "google/flan-t5-small"`.

## Project structure

```
.
├── apps/
│   ├── backend/          # Express API
│   └── frontend/         # Next.js app
├── database/
│   └── schema.sql        # Users table
└── .zero-human/
    └── DEPLOY_MANIFEST.json
```

## Deployment

This app is configured for **Railway**:

- `apps/backend/railway.toml` and `apps/frontend/railway.toml` are included.
- Frontend `next.config.js` uses `output: "standalone"`.
- No local GPU, CUDA, or training runs in the deployed environment.

See `.zero-human/DEPLOY_MANIFEST.json` for the deploy specification:

- `hostingTarget`: railway
- `inferenceProvider`: huggingface
- `trainingProfile`: kaggle-unsloth
- `attachModelId`: google/flan-t5-small

## Local development

1. Install dependencies in each app directory:

```bash
cd apps/backend && npm install
cd ../frontend && npm install
```

2. Set environment variables (copy values into `.env` files).
3. Run PostgreSQL and apply `database/schema.sql`.
4. Start the backend:

```bash
cd apps/backend
npm run dev
```

5. Start the frontend:

```bash
cd apps/frontend
npm run dev
```
