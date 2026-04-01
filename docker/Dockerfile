# EmDash CMS - Node.js + SQLite Docker Image
# Uses the blog template from emdash-cms/templates

FROM node:22-slim AS base
RUN corepack enable pnpm

WORKDIR /app

# ── Stage 1: Install & Build ──────────────────────────────────
FROM base AS build

# Copy template files
COPY docker/template/ .

# Install dependencies (shamefully-hoist for runtime compatibility
# since Astro SSR require()s transitive deps like kysely, got)
RUN pnpm install --shamefully-hoist

# Initialize database and seed demo content
RUN pnpm run bootstrap

# Build the Astro site
RUN pnpm run build

# ── Stage 2: Production ──────────────────────────────────────
FROM base AS runtime

WORKDIR /app

# Copy built output and full node_modules (Astro SSR requires
# runtime deps like kysely, better-sqlite3, got that aren't bundled)
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./

# Create directories for persistent data
RUN mkdir -p /app/data /app/uploads

# Copy seed database if no existing data
COPY --from=build /app/data.db /app/data.db.seed

# Entrypoint handles data initialization
COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENV HOST=0.0.0.0
ENV PORT=4321
EXPOSE 4321

ENTRYPOINT ["/entrypoint.sh"]
CMD ["node", "./dist/server/entry.mjs"]
