FROM node:24-slim AS deps
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev

FROM node:24-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY tsconfig.json ./
COPY src ./src
RUN npm run build
RUN cp -R src/migrations dist/migrations

FROM node:24-slim AS production
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
EXPOSE 3001
CMD ["node", "dist/server.js"]
