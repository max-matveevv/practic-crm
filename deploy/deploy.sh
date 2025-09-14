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

# Сохранить важные файлы
echo "💾 Saving important files..."
if [ -f data/database.sqlite ]; then
    cp data/database.sqlite /tmp/database_backup.sqlite
    echo "✅ Database backup created"
fi

# Сохранить storage если существует
if [ -d backend/storage/app/public ]; then
    cp -r backend/storage/app/public /tmp/storage_backup
    echo "✅ Storage backup created"
fi

# Сохранить env файлы если существуют
if [ -f backend/.env ]; then
    cp backend/.env /tmp/backend_env_backup
    echo "✅ Backend .env backup created"
fi

# Полная очистка проекта (кроме папки data)
echo "🧹 Cleaning project directory..."
# Удаляем все кроме папки data и .git
find . -maxdepth 1 -not -name '.' -not -name 'data' -not -name '.git' -exec rm -rf {} +

# Обновить код из Git
echo "📥 Pulling latest changes..."
git fetch origin
git reset --hard origin/main
git clean -fd

# Восстановить важные файлы
echo "🔄 Restoring important files..."

# Восстановить базу данных
if [ -f /tmp/database_backup.sqlite ]; then
    mkdir -p data
    cp /tmp/database_backup.sqlite data/database.sqlite
    rm /tmp/database_backup.sqlite
    echo "✅ Database restored"
else
    echo "⚠️  No database backup found, will create new one"
fi

# Восстановить storage
if [ -d /tmp/storage_backup ]; then
    mkdir -p backend/storage/app/public
    cp -r /tmp/storage_backup/* backend/storage/app/public/
    rm -rf /tmp/storage_backup
    echo "✅ Storage restored"
fi

# Восстановить env файл (если он был настроен)
if [ -f /tmp/backend_env_backup ]; then
    cp /tmp/backend_env_backup backend/.env
    rm /tmp/backend_env_backup
    echo "✅ Backend .env restored"
fi

# Backend setup
echo "🔧 Setting up backend..."
cd backend

# Копировать файл окружения для продакшена
echo "📝 Setting up production environment..."
if [ ! -f .env ]; then
    if [ -f .env.production ]; then
        cp .env.production .env
        echo "✅ Using backend/.env.production"
    else
        echo "❌ backend/.env.production not found! Please create it first."
        exit 1
    fi
else
    echo "✅ Using existing backend/.env (restored from backup)"
fi

# Сгенерировать ключ приложения (всегда для безопасности)
echo "🔑 Generating new APP_KEY..."
php artisan key:generate

# Очистить vendor если существует (для полной переустановки)
if [ -d vendor ]; then
    rm -rf vendor
    echo "🗑️  Removed old vendor directory"
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

# Настроить storage link для изображений
echo "🔗 Setting up storage link..."
if [ -L public/storage ]; then
    rm public/storage
    echo "🗑️  Removed existing storage link"
fi

# Принудительно создать символическую ссылку
ln -sfn ../storage/app/public public/storage
if [ -L public/storage ]; then
    echo "✅ Storage link created successfully: $(readlink public/storage)"
else
    echo "❌ Failed to create storage link manually, trying artisan command..."
    php artisan storage:link
    if [ -L public/storage ]; then
        echo "✅ Storage link created via artisan: $(readlink public/storage)"
    else
        echo "❌ Failed to create storage link, trying direct copy..."
        # Альтернативное решение - прямая копия
        if [ -d "storage/app/public" ]; then
            cp -r storage/app/public/* public/ 2>/dev/null || true
            echo "✅ Copied storage files to public directory"
        else
            echo "❌ Storage directory not found"
        fi
    fi
fi

# Создать папку data если не существует
if [ ! -d "../data" ]; then
    mkdir -p ../data
    echo "📁 Created data directory"
fi

# Установить права доступа
echo "🔐 Setting permissions..."
chmod -R 755 storage bootstrap/cache
chmod -R 755 ../data
chown -R practic-crm:practic-crm storage bootstrap/cache
chown -R practic-crm:practic-crm ../data
echo "✅ Permissions set"

# Создать папку для изображений если не существует
if [ ! -d "storage/app/public/task-images" ]; then
    mkdir -p storage/app/public/task-images
    echo "📁 Created task-images directory"
fi

# Синхронизировать файлы storage с public (fallback для проблемных серверов)
if [ -d "storage/app/public" ] && [ -d "public" ]; then
    rsync -av --delete storage/app/public/ public/storage/ 2>/dev/null || {
        echo "🔄 Rsync failed, using cp..."
        cp -r storage/app/public/* public/ 2>/dev/null || true
    }
    echo "✅ Storage files synchronized to public directory"
fi

# Проверить storage link
echo "🔍 Checking storage link..."
if [ -L public/storage ]; then
    echo "✅ Storage link exists: $(readlink public/storage)"
    echo "🔍 Testing storage access..."
    if [ -d "storage/app/public/task-images" ]; then
        echo "✅ Storage directory accessible"
    else
        echo "❌ Storage directory not accessible"
    fi
else
    echo "❌ Storage link missing"
fi

# Frontend setup
echo "🎨 Setting up frontend..."
cd ../frontend

# Копировать файл окружения для продакшена
echo "📝 Setting up frontend environment..."
if [ -f .env.local ]; then
    echo "✅ Using existing frontend/.env.local"
else
    echo "❌ frontend/.env.local not found! Please create it first."
    exit 1
fi

# Очистить node_modules если существует (для полной переустановки)
if [ -d node_modules ]; then
    rm -rf node_modules
    echo "🗑️  Removed old node_modules directory"
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

# Диагностика
echo "🔍 Running diagnostics..."
echo "📊 Database status:"
php artisan migrate:status | head -5

echo "📁 Storage link status:"
if [ -L public/storage ]; then
    echo "✅ Storage link exists: $(readlink public/storage)"
    echo "🔍 Storage directory contents:"
    ls -la storage/app/public/ | head -3
else
    echo "❌ Storage link missing"
fi

echo "🖼️  Task images directory:"
if [ -d "storage/app/public/task-images" ]; then
    echo "✅ Task images directory exists"
    echo "📊 Images count: $(ls storage/app/public/task-images/ | wc -l)"
else
    echo "❌ Task images directory missing"
fi

echo "🌐 Public storage access:"
if [ -d "public/storage/task-images" ]; then
    echo "✅ Public storage accessible"
    echo "📊 Public images count: $(ls public/storage/task-images/ 2>/dev/null | wc -l)"
else
    echo "❌ Public storage not accessible"
fi

echo "🗄️  Database file:"
if [ -f ../data/database.sqlite ]; then
    echo "✅ Database file exists"
    ls -la ../data/database.sqlite
else
    echo "❌ Database file missing"
fi

echo "🌐 Environment check:"
echo "Backend APP_URL: $(grep APP_URL .env | cut -d'=' -f2)"
echo "Frontend API URL: $(grep NEXT_PUBLIC_API_URL .env.local | cut -d'=' -f2)"

# Очистка временных файлов
echo "🧹 Cleaning temporary files..."
rm -f /tmp/database_backup.sqlite
rm -rf /tmp/storage_backup
rm -f /tmp/backend_env_backup
echo "✅ Temporary files cleaned"

echo ""
echo "✅ CloudPanel deployment completed successfully!"
echo "🌐 Frontend: https://crm.practic.studio"
echo "🔗 Backend API: https://crm.practic.studio/api"
echo "📊 Telescope: https://crm.practic.studio/telescope"
