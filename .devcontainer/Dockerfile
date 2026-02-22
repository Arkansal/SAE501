FROM php:8.4-cli-bookworm

# Avoid interactive prompts during apt installs
ENV DEBIAN_FRONTEND=noninteractive \
    TZ=Europe/Paris \
    COMPOSER_ALLOW_SUPERUSER=1

# System deps
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
       git curl wget unzip bash-completion ca-certificates gnupg \
       libicu-dev libzip-dev zlib1g-dev \
       libjpeg62-turbo-dev libpng-dev libfreetype6-dev \
       libonig-dev libxml2-dev libxslt1.1 \
       libssl-dev pkg-config libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# PHP extensions commonly required by Symfony
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
       intl \
        gd \
        zip \
        pdo_mysql \
        pdo_pgsql \
        opcache \
        pcntl \
        bcmath \
        mbstring \
    && docker-php-ext-enable opcache

# Xdebug (dev only)
RUN pecl install xdebug redis \
    && docker-php-ext-enable xdebug redis

# Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer \
    && composer --version

# Symfony CLI
RUN curl -sS https://get.symfony.com/cli/installer | bash \
    && mv /root/.symfony5/bin/symfony /usr/local/bin/symfony \
    || (mv /root/.symfony/bin/symfony /usr/local/bin/symfony || true)

# Create non-root user (for VS Code devcontainers best practice)
ARG USERNAME=vscode
ARG USER_UID=1000
ARG USER_GID=1000
RUN groupadd --gid ${USER_GID} ${USERNAME} \
    && useradd -s /bin/bash --uid ${USER_UID} --gid ${USER_GID} -m ${USERNAME}

# PHP configuration
COPY php/conf.d/99-custom.ini /usr/local/etc/php/conf.d/99-custom.ini
COPY php/conf.d/99-xdebug.ini /usr/local/etc/php/conf.d/99-xdebug.ini

USER ${USERNAME}
WORKDIR /workspace

# Warm up common directories
RUN mkdir -p /workspace \
    && mkdir -p ~/.composer ~/.cache/symfony

# Print versions for sanity
RUN php -v && php -m && composer --version && symfony -V || true

# Default command (overridden by devcontainer)
CMD ["bash", "-lc", "sleep infinity"]
