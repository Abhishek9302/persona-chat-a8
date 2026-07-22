# Changelog

## 0.1.0 — TES-4: A8 Persona Chat proof app

### Added

- `apps/frontend`: Next.js 14 standalone chat UI.
- `apps/backend`: Express API with health, auth, and chat routes.
- `database/schema.sql`: `users` table for minimal authentication.
- `.zero-human/DEPLOY_MANIFEST.json`: Railway deploy manifest for the persona-chat-a8 project.
- Hugging Face Inference API integration via `POST /api/chat`.
- Frontend `/api/health` route for Railway health checks.
- README and CHANGELOG.

### Deployment target

- Hosting: Railway
- Inference provider: Hugging Face (`google/flan-t5-small`)
- Training profile: Kaggle + Unsloth
