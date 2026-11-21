# syntax=docker/dockerfile:1
#
# Backend image for the TrackStack demo.
# The build context is the repository root (the pnpm workspace lives there):
#
#   docker build -f backend/Dockerfile -t trackstack-backend .
#
# Runtime configuration is environment-based (see backend/README.md); no .env
# file or secret is baked into the image.

ARG NODE_VERSION=22-bookworm-slim

# ---------------------------------------------------------------------------
# Base: Node + pnpm via corepack (same version as packageManager)
# ---------------------------------------------------------------------------
FROM node:${NODE_VERSION} AS base
ENV PNPM_HOME=/pnpm \
    PATH=/pnpm:$PATH \
    COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN corepack enable
WORKDIR /app

# ---------------------------------------------------------------------------
# Dependencies: only the workspace manifests, so Docker can cache the install
# until pnpm-lock.yaml or one of the package.json files changes.
# ---------------------------------------------------------------------------
FROM base AS deps
ENV npm_config_trust_lockfile=true
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/
COPY schemas/package.json ./schemas/
RUN --mount=type=cache,id=trackstack-pnpm-store,target=/pnpm/store \
    pnpm install --frozen-lockfile --filter db-backend...

# ---------------------------------------------------------------------------
# Build: compile the Nest backend. `@trackstack/schemas` is TypeScript source,
# so it must be present for type checking and at runtime (see CMD below).
# ---------------------------------------------------------------------------
FROM deps AS build
COPY schemas ./schemas
COPY backend/nest-cli.json backend/tsconfig.json backend/tsconfig.build.json ./backend/
COPY backend/src ./backend/src
COPY backend/models ./backend/models
COPY backend/test ./backend/test
COPY backend/database ./backend/database
RUN pnpm --filter db-backend run build

# ---------------------------------------------------------------------------
# Production dependencies: self-contained directory with the backend's prod
# node_modules (including the workspace package) and no dev dependencies.
# ---------------------------------------------------------------------------
FROM deps AS prod-deps
COPY schemas ./schemas
RUN --mount=type=cache,id=trackstack-pnpm-store,target=/pnpm/store \
    pnpm --filter db-backend deploy --prod --legacy /prod/backend

# ---------------------------------------------------------------------------
# Runner: minimal image with the non-root `node` user.
# ---------------------------------------------------------------------------
FROM node:${NODE_VERSION} AS runner
ENV NODE_ENV=production \
    PORT=3000 \
    NODE_OPTIONS=--enable-source-maps

RUN apt-get update \
    && apt-get install -y --no-install-recommends tini \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app/backend

COPY --from=prod-deps --chown=node:node /prod/backend ./
COPY --from=build --chown=node:node /app/backend/dist ./dist

# ServeStaticModule serves this directory. It is intentionally empty in this
# backend-only image; it exists so requests to / return 404 instead of 500 when
# no static build has been added.
RUN mkdir -p /app/backend/public && chown node:node /app/backend/public

USER node

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
    CMD node -e "const s=require('net').connect(process.env.PORT||3000,'127.0.0.1');s.on('connect',()=>{s.destroy();process.exit(0)});s.on('error',()=>process.exit(1))"

ENTRYPOINT ["/usr/bin/tini", "--"]

# `tsx` is required because the compiled code imports the TypeScript sources of
# @trackstack/schemas. This mirrors the `start:prod` script in backend/package.json.
CMD ["node_modules/.bin/tsx", "dist/src/main"]
