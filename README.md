# CRM System

Система управления проектами и задачами с авторизацией пользователей.

## 🏗️ Структура проекта

```
practic-crm/
├── backend/          # Laravel API (PHP)
│   ├── app/
│   ├── config/
│   ├── database/
│   ├── routes/
│   └── ...
├── frontend/         # Next.js приложение (TypeScript)
│   ├── src/
│   ├── public/
│   └── ...
├── deploy/           # Файлы для деплоя
│   ├── production.env.example
│   ├── frontend.env.production.example
│   └── ...
└── README.md
```

## 🚀 Запуск проекта

### Требования
- PHP 8.1+
- Composer
- Node.js 18+
- SQLite

### Backend (Laravel)

```bash
cd backend

# Установка зависимостей
composer install

# Настройка окружения
cp .env.example .env
php artisan key:generate

# Настройка базы данных
touch database/database.sqlite
php artisan migrate

# Запуск сервера
php artisan serve
```

Backend будет доступен на `http://localhost:8000`

### Frontend (Next.js)

```bash
cd frontend

# Установка зависимостей
npm install

# Запуск в режиме разработки
npm run dev
```

Frontend будет доступен на `http://localhost:3000`

## 🔧 Настройка для продакшена

### Backend (.env)
```env
APP_URL=https://crm.practic.studio
SESSION_SECURE_COOKIE=true
SESSION_SAME_SITE=lax
SESSION_PARTITIONED_COOKIE=true
SESSION_DOMAIN=.practic.studio
SANCTUM_STATEFUL_DOMAINS=crm.practic.studio
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=https://crm.practic.studio/api
```

### Команды после деплоя
```bash
php artisan config:clear
php artisan config:cache
php artisan route:cache
```

## 📋 Функциональность

- **Авторизация**: регистрация, вход, выход
- **Проекты**: создание, редактирование, удаление
- **Задачи**: создание, изменение статуса, привязка к проектам
- **Фильтрация**: по проектам и статусам
- **Пользователи**: каждый видит только свои данные

## 🛠️ Технологии

### Backend
- Laravel 11
- Laravel Sanctum (авторизация)
- SQLite (база данных)
- Laravel Telescope (отладка)

### Frontend
- Next.js 14
- TypeScript
- Tailwind CSS
- React Context (состояние)

## 📁 Основные файлы

### Backend
- `app/Http/Controllers/` - контроллеры API
- `app/Models/` - модели данных
- `database/migrations/` - миграции БД
- `config/sanctum.php` - настройки авторизации
- `config/cors.php` - CORS настройки

### Frontend
- `src/app/` - страницы приложения
- `src/components/` - React компоненты
- `src/api/` - API клиенты
- `src/contexts/` - React Context
- `src/middleware.ts` - middleware для авторизации

## 🔐 Авторизация

Система использует Laravel Sanctum для API авторизации:
- CSRF токены для безопасности
- JWT токены для аутентификации
- Cookies для состояния сессии

## 🎯 API Endpoints

### Авторизация
- `POST /api/auth/register` - регистрация
- `POST /api/auth/login` - вход
- `POST /api/auth/logout` - выход
- `GET /api/auth/me` - текущий пользователь

### Проекты
- `GET /api/projects` - список проектов
- `POST /api/projects` - создание проекта
- `GET /api/projects/{id}` - проект по ID
- `DELETE /api/projects/{id}` - удаление проекта

### Задачи
- `GET /api/tasks` - список задач
- `POST /api/tasks` - создание задачи
- `PUT /api/tasks/{id}` - обновление задачи
- `DELETE /api/tasks/{id}` - удаление задачи

## 📝 Лицензия

Private project