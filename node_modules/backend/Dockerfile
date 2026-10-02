# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY backend/package*.json ./backend/
RUN npm ci --workspaces --include-workspace-root

COPY . .
RUN npm run build --workspace=backend

# Production stage
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/backend/dist ./dist
COPY --from=builder /app/backend/node_modules ./node_modules
COPY --from=builder /app/backend/package.json ./

ENV NODE_ENV=production

EXPOSE 3001

CMD ["node", "dist/index.js"]