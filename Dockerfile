# =============================
# 1️⃣ Install dependencies
# =============================
FROM node:20-alpine AS deps
WORKDIR /app/frontend

COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

# =============================
# 2️⃣ Build
# =============================
FROM node:20-alpine AS builder
WORKDIR /app/frontend

COPY --from=deps /app/frontend/node_modules ./node_modules
COPY frontend ./

RUN npm run build

# =============================
# 3️⃣ Production
# =============================
FROM node:20-alpine AS runner
WORKDIR /app/frontend

ENV NODE_ENV=production

COPY --from=builder /app/frontend ./

EXPOSE 3000

CMD ["npm", "start"]