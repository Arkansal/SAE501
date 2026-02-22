FROM php:8.4-cli
# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    libicu-dev \
    zip \
    unzip \
    python3 \
    python3-pip \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
RUN pip3 install joblib sentence-transformers --break-system-packages

# Install PHP extensions
RUN docker-php-ext-configure gd \
    && docker-php-ext-configure intl \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd intl zip
# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
# Install Symfony CLI
RUN curl -sS https://get.symfony.com/cli/installer | bash \
    && mv /root/.symfony*/bin/symfony /usr/local/bin/symfony
WORKDIR /app
COPY . .
RUN composer install --no-interaction --optimize-autoloader
EXPOSE 8000
CMD ["symfony", "server:start", "--no-tls", "--port=8000"]