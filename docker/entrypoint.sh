#!/bin/sh
set -e

# Initialize database from seed if not exists
if [ ! -f /app/data/data.db ]; then
  echo "[emdash] Initializing database from seed..."
  cp /app/data.db.seed /app/data/data.db
fi

# Symlink data.db so the app finds it at the expected path
ln -sf /app/data/data.db /app/data.db

# Ensure uploads directory exists
mkdir -p /app/uploads

exec "$@"
