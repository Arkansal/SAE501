# Dev Container Symfony 7 — Environnement pédagogique complet

Ce projet intègre un Dev Container basé et amélioré à partir du travail de Yoan Bernabeu (yoandev): https://github.com/yoanbernabeu/Symfony-DevContainer

Objectif: offrir aux étudiant·e·s un environnement prêt à l’emploi pour Symfony 7 (PHP 8.4), avec Composer, Symfony CLI, MySQL + phpMyAdmin, Redis, Mailpit, Xdebug, et Node.js pour l’écosystème front (Vite/Symfony UX).

## Prérequis

- Docker Desktop ou Docker Engine (Mac/Windows/Linux)
- VS Code + extension "Dev Containers" (ms-vscode-remote.remote-containers)
- Espace disque libre pour les dépendances et volumes Docker

## Contenu technique

- PHP 8.4 (image officielle) avec extensions: intl, mbstring, bcmath, gd, zip, pdo_mysql, pdo_pgsql, opcache, pcntl, redis, xdebug
- Composer et Symfony CLI préinstallés
- Node.js 24 (LTS recommandée par Node.js) via features Dev Containers
- Services Docker Compose
  - dev: conteneur de dev (serveur Symfony CLI, Composer, Node)
  - mysql: MySQL 8.4 (port hôte 3307)
  - phpmyadmin: interface web SQL (port 8080)
  - redis: cache/message broker (port 6379, Redis 7.4)
  - mailpit: SMTP de dev + UI (ports 1025/8025, v1.27.10)

## Démarrage rapide

1) Ouvrez le projet dans VS Code
2) Ouvrez la palette de commandes et exécutez: "Dev Containers: Reopen in Container"
3) À la première ouverture, les dépendances Composer sont installées automatiquement
4) Lancez le serveur de dev Symfony:

   - via Makefile: `make start`
   - ou à la main: `symfony server:start --no-tls --port=8000 --allow-all-ip` (le port 8000 est exposé)

Accès rapides:
- Application: http://localhost:8000
- phpMyAdmin: http://localhost:8080 (root/root) — DB: symfony/symfony
- Mailpit: http://localhost:8025 (SMTP: 1025)

## Configuration des services

Fichier: `.devcontainer/docker-compose.yml`

- La variable `DATABASE_URL` est fournie au conteneur `dev` et pointe vers MySQL interne: `mysql://symfony:symfony@mysql:3306/symfony?serverVersion=8.4&charset=utf8mb4`
- `MAILER_DSN` est déjà configuré vers Mailpit: `smtp://mailpit:1025`
- `REDIS_URL` est défini: `redis://redis:6379`
- Le serveur Symfony écoute `0.0.0.0:8000` via `SERVER_ADDRESS` (pour l’exposer au host)

Remarque: les variables d’environnement injectées par Docker Compose priment sur les valeurs de votre `.env`. Vous pouvez toujours surcharger via un `.env.local` si nécessaire.

## Base de données

MySQL 8.4 est la base par défaut.
- Connexion applicative: `DATABASE_URL=mysql://symfony:symfony@mysql:3306/symfony?serverVersion=8.4&charset=utf8mb4`
- Accès phpMyAdmin: http://localhost:8080 — utilisateur: `root`, mot de passe: `root`
- Accès depuis votre machine (client SQL): hôte `127.0.0.1`, port `3307`, utilisateur `symfony`, mot de passe `symfony`, base `symfony`

Commandes utiles:
- Créer la base: `bin/console doctrine:database:create`
- Migrations: `bin/console doctrine:migrations:diff && bin/console doctrine:migrations:migrate`

Astuce: si vous préférez PostgreSQL, voyez la section "Variante PostgreSQL" plus bas.

## Mail de développement (Mailpit)

- DSN: `smtp://mailpit:1025`
- UI: http://localhost:8025
- Configurez `symfony/mailer` pour utiliser ce DSN (déjà injecté dans le service `dev`).

## Cache/Messenger (Redis)

- URL: `redis://redis:6379`
- Exemples d’utilisation:
  - Cache: `framework.cache.app.0: '%env(REDIS_URL)%'`
  - Messenger: `MESSENGER_TRANSPORT_DSN=redis://redis:6379/messages`

## Xdebug (débogage pas-à-pas)

- Xdebug 3 est installé et configuré sur le port 9003
- VS Code est préconfiguré (`.vscode/launch.json`)
- Par défaut, `xdebug.start_with_request=trigger`:
  - Activez le débogage via le cookie `XDEBUG_SESSION=1` ou le header/env `XDEBUG_TRIGGER=1`
  - Dans VS Code, démarrez "Listen for Xdebug (9003)" puis rechargez la page

Si vous êtes sous Linux, la résolution de `host.docker.internal` est assurée par `extra_hosts` dans Compose.

## Node / Front-end

- Node 24 (LTS recommandée) est présent dans le conteneur de dev
- Exemples:
  - Vite: `npm run dev` (port 5173 exposé)
  - Symfony UX (Stimulus/Turbo): déjà compatible

## Makefile (raccourcis)

- `make up` — build + start des services
- `make down` — stop + suppression des volumes
- `make restart` — redémarrage complet
- `make logs` — logs en continu
- `make sh` — shell dans le conteneur `dev`
- `make start` — lance le serveur Symfony en arrière-plan
- `make serve` — lance le serveur Symfony au premier plan
- `make test` — lance PHPUnit
- `make cache-clear` — vide le cache Symfony

## Variante PostgreSQL (optionnel)

Le travail original de Yoan utilisait PostgreSQL. Si vous préférez Postgres:

1) Ajoutez un service `postgres` dans `.devcontainer/docker-compose.yml` (exemple):

```yaml
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: app
      POSTGRES_USER: app
      POSTGRES_PASSWORD: '!ChangeMe!'
    volumes:
      - pg-data:/var/lib/postgresql/data
    ports:
      - "5433:5432"

volumes:
  pg-data:
```

2) Dans le service `dev`, remplacez `DATABASE_URL` par:

```
postgresql://app:!ChangeMe!@postgres:5432/app?serverVersion=16&charset=utf8
```

3) Supprimez la dépendance à `mysql` (dans `depends_on`) et ajoutez `postgres`.

Le conteneur est déjà compilé avec `pdo_pgsql`, vous n’avez rien d’autre à installer.

## Conseils et dépannage

- Vérifiez les versions dans le conteneur: `php -v`, `composer -V`, `symfony -V`
- En cas d’erreur de connexion DB, attendez le `healthcheck` MySQL ou vérifiez `make logs`
- Si les ports 8000/8080/8025/3307 sont pris, modifiez le mapping dans `.devcontainer/docker-compose.yml`
- Pour réinitialiser MySQL: `make down` (supprime les volumes), puis `make up`

## Production

Ce setup est conçu pour le développement. Pour la production:
- utilisez des images PHP-FPM + Nginx/Caddy adaptées
- sécurisez les mots de passe et secrets (Vault/Symfony Secrets)
- désactivez Xdebug

---

Crédits: inspiré du dépôt "Symfony-DevContainer" de Yoan Bernabeu, adapté pour MySQL et enrichi (Redis, phpMyAdmin, Mailpit, Xdebug, Node) pour un usage pédagogique moderne avec Symfony 7.

## Versions stables recommandées (nov. 2025)

- Symfony: stable 7.3.x – source: https://symfony.com/releases (meta: Latest stable 7.3.5)
- PHP: stable 8.4 – source: https://www.php.net/supported-versions.php
- Node.js: LTS recommandée 24.x – source: https://nodejs.org/en ("Latest LTS v24.11.0")
- MySQL: 8.4 – source: https://dev.mysql.com/doc/refman/8.4/en/
- Redis: 7.4 stable (7.2 LTS disponible) – source: https://hub.docker.com/_/redis (tag 7.4-alpine)
- phpMyAdmin: 5.2.3 – source: https://www.phpmyadmin.net (bouton "Download 5.2.3")
