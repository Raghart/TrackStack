# syntax=docker/dockerfile:1
#
# Frontend image for the TrackStack demo.
# The build context is the repository root (the pnpm workspace lives there):
#
#   docker build -f frontend/Dockerfile -t trackstack-frontend .
#
# The GraphQL URLs are Vite build-time variables. Override them with
# --build-arg when the backend is not reachable at localhost:3000.

ARG NODE_VERSION=22-bookworm-slim
ARG NGINX_VERSION=stable-alpine

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
COPY frontend/package.json ./frontend/
COPY schemas/package.json ./schemas/
RUN --mount=type=cache,id=trackstack-pnpm-store,target=/pnpm/store \
    pnpm install --frozen-lockfile --filter music-project...

# ---------------------------------------------------------------------------
# Build: type-check and bundle the SPA. The Vite config writes to
# ../backend/public by default (Nest serves it there); inside this image the
# output is overridden to frontend/dist so Nginx can serve it directly.
# ---------------------------------------------------------------------------
FROM deps AS build
COPY schemas ./schemas
COPY frontend ./frontend

ARG VITE_GRAPHQL_URI=http://localhost:3000/graphql
ARG VITE_SUBSCRIPTION_URI=ws://localhost:3000/graphql
ENV VITE_GRAPHQL_URI=${VITE_GRAPHQL_URI} \
    VITE_SUBSCRIPTION_URI=${VITE_SUBSCRIPTION_URI}

RUN pnpm --filter music-project exec tsc -b \
    && pnpm --filter music-project exec vite build --outDir dist --emptyOutDir

# ---------------------------------------------------------------------------
# Runner: Nginx serving the static build with SPA fallback.
# ---------------------------------------------------------------------------
FROM nginx:${NGINX_VERSION} AS runner

COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/frontend/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD wget -q --spider http://127.0.0.1/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
