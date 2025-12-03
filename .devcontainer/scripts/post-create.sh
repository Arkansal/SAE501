#!/usr/bin/env bash
set -euo pipefail

echo "[post-create] Checking environment..."
php -v
composer --version
symfony -V || true
node -v || true
npm -v || true

# Ensure Composer cache dirs exist with correct ownership
mkdir -p ~/.composer ~/.cache/symfony

if [ -f composer.json ]; then
  echo "[post-create] composer.json found. Installing dependencies..."
  composer install --no-interaction --prefer-dist
else
  cat <<'EOM'
[post-create] No composer.json found.
You can create a new Symfony project with:
  symfony new --webapp .
EOM
fi

# Show useful service URLs
cat <<'EOM'

Dev container is ready.
- Symfony: http://localhost:8000
- phpMyAdmin: http://localhost:8080  (user: root, password: root)
- Mailpit UI: http://localhost:8025  (SMTP: 1025)

Tip: Start the local server with:
  symfony server:start -d --no-tls --port=8000 --allow-all-ip

EOM
