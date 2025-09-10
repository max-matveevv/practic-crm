# 🚀 Деплой PracticCRM на CloudPanel

## 📋 Что уже есть в CloudPanel

CloudPanel уже включает:
- ✅ **PHP 8.2+** с необходимыми расширениями
- ✅ **Composer** (установлен глобально)
- ✅ **Node.js 18+** и **npm**
- ✅ **Nginx** (настроен автоматически)
- ✅ **Git** (установлен)
- ✅ **SSL сертификаты** (Let's Encrypt)
- ✅ **База данных** (MySQL/PostgreSQL/SQLite)

## 🔧 Настройка через CloudPanel

### 1. Создание сайта в CloudPanel

1. Войдите в панель CloudPanel
2. Нажмите **"Add Site"**
3. Выберите **"PHP"**
4. Заполните данные:
   - **Domain**: `crm.practic.studio`
   - **PHP Version**: `8.2`
   - **Document Root**: `/home/practic-crm/htdocs/crm.practic.studio`

### 2. Настройка через SSH

Подключитесь к серверу через SSH и выполните:

```bash
# Перейти в директорию сайта
cd /home/practic-crm/htdocs/crm.practic.studio

# Клонировать репозиторий
git clone https://github.com/YOUR_USERNAME/practic-crm.git .

# Установить PM2 глобально (если не установлен)
npm install -g pm2
```

### 3. Настройка Backend (Laravel)

```bash
cd backend

# Копировать файл окружения
cp ../deploy/env.production.example .env

# Сгенерировать ключ приложения
php artisan key:generate

# Установить зависимости
composer install --no-dev --optimize-autoloader

# Создать базу данных SQLite
touch database/database.sqlite

# Запустить миграции
php artisan migrate

# Установить права доступа
chmod -R 755 storage bootstrap/cache
chown -R practic-crm:practic-crm storage bootstrap/cache
```

### 4. Настройка Frontend (Next.js)

```bash
cd ../frontend

# Копировать файл окружения
cp ../deploy/frontend.env.production.example .env.production

# Установить зависимости
npm ci

# Собрать проект
npm run build
```

### 5. Настройка PM2

```bash
cd /home/practic-crm/htdocs/crm.practic.studio

# Запустить приложения через PM2
pm2 start ecosystem.config.js

# Сохранить конфигурацию PM2
pm2 save

# Настроить автозапуск PM2
pm2 startup
```

## 🌐 Настройка Nginx в CloudPanel

### Вариант 1: Через панель CloudPanel

1. В панели CloudPanel перейдите в **"Sites"**
2. Найдите ваш сайт и нажмите **"Manage"**
3. Перейдите в **"Nginx Config"**
4. Замените содержимое на конфигурацию ниже

### Вариант 2: Через файловый менеджер

1. В CloudPanel перейдите в **"File Manager"**
2. Откройте файл: `/home/practic-crm/htdocs/crm.practic.studio/deploy/nginx.conf`
3. Скопируйте содержимое и вставьте в настройки Nginx в панели CloudPanel

### Конфигурация Nginx для CloudPanel:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name crm.practic.studio;
    root /home/practic-crm/htdocs/crm.practic.studio/frontend/out;
    index index.html;

    # Frontend (Next.js)
    location / {
        try_files $uri $uri/ @frontend;
    }

    # Backend API (Laravel)
    location /api {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Fallback для SPA
    location @frontend {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Статические файлы Next.js
    location /_next/static {
        alias /home/practic-crm/htdocs/crm.practic.studio/frontend/.next/static;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Безопасность
    location ~ /\. {
        deny all;
    }

    # Логи
    access_log /home/practic-crm/logs/crm.practic.studio/access.log;
    error_log /home/practic-crm/logs/crm.practic.studio/error.log;
}
```

## 🔄 Обновленный скрипт деплоя для CloudPanel

Создайте файл `deploy-cloudpanel.sh`:

```bash
#!/bin/bash

# PracticCRM Deployment Script for CloudPanel
set -e

echo "🚀 Starting CloudPanel deployment..."

# Переменные
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
```

## 🔑 Настройка GitHub Actions для CloudPanel

Обновите `.github/workflows/deploy.yml`:

```yaml
name: Deploy to CloudPanel

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
        cache-dependency-path: frontend/package-lock.json
        
    - name: Setup PHP
      uses: shivammathur/setup-php@v2
      with:
        php-version: '8.2'
        extensions: mbstring, dom, fileinfo, sqlite
        coverage: none
        
    - name: Install Composer dependencies
      run: |
        cd backend
        composer install --no-dev --optimize-autoloader
        
    - name: Install NPM dependencies
      run: |
        cd frontend
        npm ci
        
    - name: Build Frontend
      run: |
        cd frontend
        npm run build
        
    - name: Deploy to CloudPanel server
      uses: appleboy/ssh-action@v1.0.3
      with:
        host: ${{ secrets.HOST }}
        username: ${{ secrets.USERNAME }}
        key: ${{ secrets.SSH_KEY }}
        port: ${{ secrets.PORT }}
        script: |
          cd /home/practic-crm/htdocs/crm.practic.studio
          chmod +x deploy-cloudpanel.sh
          ./deploy-cloudpanel.sh
```

## 🔐 Настройка SSL в CloudPanel

1. В панели CloudPanel перейдите в **"Sites"**
2. Найдите ваш сайт и нажмите **"Manage"**
3. Перейдите в **"SSL"**
4. Нажмите **"Let's Encrypt"**
5. Введите ваш домен и нажмите **"Install"**

## 📊 Мониторинг в CloudPanel

### Через панель:
- **Sites** → **Manage** → **Logs** - просмотр логов Nginx
- **Sites** → **Manage** → **PHP** - настройки PHP

### Через SSH:
```bash
# PM2 статус
pm2 status
pm2 logs

# Логи Nginx
tail -f /home/practic-crm/logs/crm.practic.studio/access.log
tail -f /home/practic-crm/logs/crm.practic.studio/error.log
```

## 🚀 Первый деплой

1. **Сделайте скрипт исполняемым**:
```bash
chmod +x /home/practic-crm/htdocs/crm.practic.studio/deploy/deploy.sh
```

2. **Запустите деплой**:
```bash
cd /home/practic-crm/htdocs/crm.practic.studio
./deploy/deploy.sh
```

3. **Проверьте статус**:
```bash
pm2 status
```

## 🎯 Преимущества CloudPanel

- ✅ **Автоматическая настройка** Nginx и PHP
- ✅ **Встроенный SSL** с Let's Encrypt
- ✅ **Удобная панель управления**
- ✅ **Автоматические обновления** безопасности
- ✅ **Мониторинг** и логи
- ✅ **Резервное копирование**

## 🛠️ Устранение неполадок

### Если PM2 не запускается:
```bash
pm2 delete all
pm2 start ecosystem.config.js
```

### Если сайт не открывается:
1. Проверьте настройки Nginx в панели CloudPanel
2. Убедитесь, что PM2 процессы запущены: `pm2 status`
3. Проверьте логи: `pm2 logs`

### Если база данных не работает:
```bash
cd /home/practic-crm/htdocs/crm.practic.studio/backend
php artisan migrate:fresh
```

## 📝 Важные замечания

1. **Замените `crm.practic.studio`** на ваш реальный поддомен
2. **Используйте пользователя `cloudpanel`** вместо `www-data`
3. **Пути в CloudPanel** начинаются с `/home/cloudpanel/htdocs/`
4. **Логи находятся** в `/home/cloudpanel/logs/`
5. **SSL настраивается** через панель CloudPanel
