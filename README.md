# Sauat Education

## Beta запуск

Требования: Docker Desktop с Compose.

1. Создайте `.env` на основе `.env.example` и задайте `BACKEND_JWT_SECRET` длиной не менее 32 символов.
2. Запустите сервисы: `docker compose up --build`.
3. Откройте http://localhost:3000.

Демо-вход: `aliya.sadykova@example.com` / `Demo1234!`.

В Compose запускаются Nuxt frontend, TypeScript backend и PostgreSQL. Backend автоматически применяет миграцию и идемпотентный seed при старте. Проверка состояния: http://localhost:3001/api/health.

Для локальной разработки backend:

```bash
cd backend
npm install
npm run dev
```

Frontend проксирует `/api` на `BACKEND_INTERNAL_URL`; при запуске вне Docker это `http://localhost:3001`.
