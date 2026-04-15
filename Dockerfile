FROM node:20-alpine AS builder
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@9.15.4 --activate

COPY package.json pnpm-lock.yaml tsconfig.json next.config.ts ./
COPY prisma ./prisma
COPY public ./public
COPY . .

RUN pnpm install --frozen-lockfile
RUN pnpm build

# ── Runner ────────────────────────────────────────────────────────────────────
# standalone output is self-contained: no need to copy node_modules
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Copy only what the standalone bundle needs
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["node", "server.js"]
