FROM node:20-bookworm-slim AS base
ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN corepack enable
RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ openssl && rm -rf /var/lib/apt/lists/*

FROM base AS build
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm config set only-built-dependencies better-sqlite3,prisma,@prisma/engines && pnpm install --frozen-lockfile --ignore-scripts=false
COPY . .
RUN pnpm prisma:generate
RUN pnpm build

FROM base AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/prisma.config.ts ./prisma.config.ts
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
RUN CI=1 pnpm prune --prod
RUN pnpm dlx prisma generate
RUN mkdir -p /app/data /app/storage
EXPOSE 3000
CMD ["node", "dist/src/main"]
