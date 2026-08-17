FROM node:24.19.0-bookworm-slim AS build
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@11.21.0 --activate
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm build

FROM node:24.19.0-bookworm-slim AS runtime
WORKDIR /app
ARG FORGE_VERSION=0.1.0-experimental
ARG FORGE_GIT_SHA=unknown
ARG FORGE_BUILD_ID=unknown
ARG FORGE_BUILD_TIMESTAMP=unknown
ENV NODE_ENV=production \
    APP_ENV=production \
    PORT=3000 \
    STATIC_ROOT=apps/test-ui/dist \
    FORGE_VERSION=$FORGE_VERSION \
    FORGE_GIT_SHA=$FORGE_GIT_SHA \
    FORGE_BUILD_ID=$FORGE_BUILD_ID \
    FORGE_BUILD_TIMESTAMP=$FORGE_BUILD_TIMESTAMP \
    FORGE_MIGRATION_VERSION=001_initial
LABEL org.opencontainers.image.revision=$FORGE_GIT_SHA \
      org.opencontainers.image.version=$FORGE_VERSION
COPY --from=build /app /app
EXPOSE 3000
CMD ["node", "apps/api/dist/server.js"]
