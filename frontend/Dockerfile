FROM node:24-slim AS base
WORKDIR /app

# Deps
FROM base AS deps
COPY package*.json ./
RUN npm install --frozen-lockfile

# Build
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production
FROM node:24-slim AS production
WORKDIR /app

ENV NODE_ENV=production
COPY --from=build /app/.output/ ./.output
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]

