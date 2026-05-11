FROM node:20-bookworm-slim AS base
ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN corepack enable

FROM base AS build
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --ignore-scripts=false
COPY . .
RUN pnpm build

FROM base AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --prod --frozen-lockfile --ignore-scripts=false
COPY --from=build /app/dist ./dist
COPY --from=build /app/.env ./.env
RUN mkdir -p /app/data /app/storage
EXPOSE 3000
CMD ["node", "dist/main.js"]
