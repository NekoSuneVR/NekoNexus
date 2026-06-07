# syntax=docker/dockerfile:1

# Paradise Admin dashboard (Bun/TypeScript). oven/bun is multi-arch (amd64 + arm64).
FROM oven/bun:1 AS base
WORKDIR /app

# Install workspace deps (cache layer): copy EVERY workspace manifest first, so bun can
# resolve all members declared in the root package.json "workspaces".
COPY package.json bun.lockb ./
COPY packages/paradise-models/package.json packages/paradise-models/
COPY packages/uberstrike-js/package.json   packages/uberstrike-js/
COPY packages/ws/package.json              packages/ws/
COPY packages/admin/package.json           packages/admin/
RUN bun install --frozen-lockfile || bun install

# Copy the sources the admin needs (admin + the workspace libs it imports).
COPY packages/paradise-models packages/paradise-models
COPY packages/uberstrike-js   packages/uberstrike-js
COPY packages/admin           packages/admin

# Config comes from the environment (DB_*, ADMIN_PORT, ADMIN_JWT_SECRET, NEKOPAY_*,
# PUBLIC_BASE_URL) — see docker-compose.yml / docker/.nekopay.env.example.
WORKDIR /app/packages/admin
EXPOSE 8088
CMD ["bun", "src/index.ts"]
