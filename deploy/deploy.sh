#!/bin/bash

# PracticCRM Deployment Script
set -e

echo "🚀 Starting CloudPanel deployment..."

# Переменные (ЗАМЕНИТЕ НА ВАШИ ДАННЫЕ)
PROJECT_DIR="/home/practic-crm/htdocs/crm.practic.studio"
BACKUP_DIR="/home/practic-crm/backups/practic-crm"
DATE=$(date +%Y%m%d_%H%M%S)

# Создать резервную копию
echo "📦 Creating backup..."
mkdir -p $BACKUP_DIR
tar -czf "$BACKUP_DIR/backup_$DATE.tar.gz" -C $PROJECT_DIR .

# Перейти в директорию проекта
cd $PROJECT_DIR

# Обновить код из Git
echo "📥 Pulling latest changes..."
git fetch origin
git reset --hard origin/main

# Backend setup
echo "🔧 Setting up backend..."
cd backend

# Копировать файл окружения если не существует
if [ ! -f .env ]; then
    cp ../deploy/env.production.example .env
    php artisan key:generate
fi

# Установить зависимости
composer install --no-dev --optimize-autoloader

# Очистить и кешировать конфигурацию
php artisan config:clear
php artisan config:cache
php artisan route:clear
php artisan route:cache
php artisan view:clear
php artisan view:cache

# Запустить миграции
php artisan migrate --force

# Установить права доступа
chmod -R 755 storage bootstrap/cache
chown -R practic-crm:practic-crm storage bootstrap/cache

# Frontend setup
echo "🎨 Setting up frontend..."
cd ../frontend

# Копировать файл окружения если не существует
if [ ! -f .env.production ]; then
    cp ../deploy/frontend.env.production.example .env.production
fi

# Установить зависимости
npm ci

# Собрать проект
npm run build

# Перезапустить PM2 процессы
echo "🔄 Restarting services..."
pm2 restart practic-crm-backend
pm2 restart practic-crm-frontend

# Проверить статус
pm2 status

echo "✅ CloudPanel deployment completed successfully!"
echo "🌐 Frontend: https://crm.practic.studio"
echo "🔗 Backend API: https://crm.practic.studio/api"
