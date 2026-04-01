# EmDash Docker Deployment

Run EmDash CMS with Docker Compose using Node.js + SQLite (no Cloudflare account needed).

## Quick Start

```bash
docker compose up -d
```

Open http://localhost:4321 — the blog comes pre-seeded with demo content.

## Configuration

### Custom Port

```bash
EMDASH_PORT=8080 docker compose up -d
```

### Public URL (required for passkey setup)

The `ORIGIN` must match the URL you use in the browser. Passkey/WebAuthn **does not work with IP addresses** — use `localhost` or a domain name.

```bash
# Local access (default)
ORIGIN=http://localhost:4321 docker compose up -d

# Behind a reverse proxy with domain
ORIGIN=https://cms.example.com docker compose up -d
```

### Data Persistence

Data is stored in Docker volumes:
- `emdash-data` — SQLite database
- `emdash-uploads` — Uploaded media files

### Backup

```bash
# Backup database
docker compose cp emdash:/app/data/data.db ./backup-data.db

# Backup uploads
docker compose cp emdash:/app/uploads ./backup-uploads
```

### Reset to Seed Data

```bash
docker compose down -v   # removes volumes
docker compose up -d     # fresh start with seed data
```

## Template

This Docker setup uses the **Blog** template. To use a different template, replace the contents of `docker/template/` with another template from [emdash-cms/templates](https://github.com/emdash-cms/templates).
