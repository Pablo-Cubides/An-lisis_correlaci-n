# Multi-stage Dockerfile for Next.js app (frontend)
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app

# install dependencies
COPY package.json package-lock.json* ./
COPY yarn.lock .
RUN apk add --no-cache python3 make g++ || true
RUN npm ci --unsafe-perm

# copy source and build
COPY . .
RUN npm run build

# Production image
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# If you are using a custom port, change here
ENV PORT=3000

# Copy only necessary files from builder
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

EXPOSE ${PORT}

# Start Next.js in production
CMD ["npx", "next", "start", "-p", "3000"]
