# syntax=docker/dockerfile:1

# Paradise Web Services (Bun/TypeScript). oven/bun is multi-arch (amd64 + arm64).
FROM oven/bun:1 AS base
WORKDIR /app

# Install workspace deps (cache layer): copy manifests first.
COPY package.json bun.lockb ./
COPY packages/paradise-models/package.json packages/paradise-models/
COPY packages/uberstrike-js/package.json   packages/uberstrike-js/
COPY packages/ws/package.json              packages/ws/
RUN bun install --frozen-lockfile || bun install

# Copy the workspace sources.
COPY packages/paradise-models packages/paradise-models
COPY packages/uberstrike-js   packages/uberstrike-js
COPY packages/ws              packages/ws

# The service reads Paradise.Settings.WebServices.yml and wwwroot/ from its cwd.
WORKDIR /app/packages/ws

EXPOSE 8080 8081 8082
CMD ["bun", "src/index.ts"]
