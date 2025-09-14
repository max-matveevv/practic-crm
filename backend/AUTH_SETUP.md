# Настройка авторизации на бэкенде

## Что мы настроили

### 1. **AuthController** (`app/Http/Controllers/AuthController.php`)
- `register()` - регистрация пользователя
- `login()` - вход в систему
- `logout()` - выход из системы
- `me()` - получение текущего пользователя
- `updateProfile()` - обновление профиля
- `changePassword()` - смена пароля

### 2. **API маршруты** (`routes/api.php`)
```php
// Публичные маршруты
POST /api/auth/register
POST /api/auth/login

// Защищенные маршруты (требуют токен)
POST /api/auth/logout
GET /api/auth/me
PUT /api/auth/profile
POST /api/auth/change-password
```

### 3. **Laravel Sanctum**
- ✅ Установлен в `composer.json`
- ✅ Добавлен `HasApiTokens` trait в модель `User`
- ✅ Настроен middleware в `bootstrap/app.php`
- ✅ Добавлен провайдер в `bootstrap/providers.php`
- ✅ Миграция `personal_access_tokens` уже существует

### 4. **CORS** (`config/cors.php`)
- ✅ Добавлен домен `https://crm.practic.studio`
- ✅ Поддержка `localhost:3000` для разработки

## Что нужно сделать на сервере

### 1. **Обновить код на сервере:**
```bash
cd /home/practic-crm/htdocs/crm.practic.studio
git pull origin main
```

### 2. **Установить зависимости (если нужно):**
```bash
cd backend
composer install --no-dev --optimize-autoloader
```

### 3. **Запустить миграции:**
```bash
php artisan migrate --force
```

### 4. **Очистить кэш:**
```bash
php artisan config:clear
php artisan config:cache
php artisan route:clear
php artisan route:cache
```

### 5. **Перезапустить PM2:**
```bash
pm2 restart practic-crm-backend
```

## Тестирование API

### Регистрация:
```bash
curl -X POST https://crm.practic.studio/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "password_confirmation": "password123"
  }'
```

### Вход:
```bash
curl -X POST https://crm.practic.studio/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Получение текущего пользователя:
```bash
curl -X GET https://crm.practic.studio/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Структура ответов

### Успешная регистрация/вход:
```json
{
  "user": {
    "id": 1,
    "name": "Test User",
    "email": "test@example.com",
    "created_at": "2025-01-15T10:00:00.000000Z",
    "updated_at": "2025-01-15T10:00:00.000000Z"
  },
  "token": "1|abcdef123456...",
  "message": "Пользователь успешно зарегистрирован"
}
```

### Ошибка валидации:
```json
{
  "message": "Ошибка валидации",
  "errors": {
    "email": ["Поле email обязательно для заполнения"],
    "password": ["Пароль должен содержать минимум 8 символов"]
  }
}
```

## Безопасность

- ✅ **Пароли хэшируются** с помощью `Hash::make()`
- ✅ **Токены создаются** через `createToken()`
- ✅ **Валидация данных** на всех эндпоинтах
- ✅ **CORS настроен** для фронтенда
- ✅ **Middleware защищает** все API маршруты

## Переменные окружения

Убедитесь, что в `.env` есть:
```env
APP_URL=https://crm.practic.studio
SANCTUM_STATEFUL_DOMAINS=crm.practic.studio,localhost:3000
```

## Проверка работы

После настройки проверьте:
1. **Регистрация** работает
2. **Вход** работает  
3. **Токены** создаются
4. **Защищенные маршруты** требуют токен
5. **CORS** не блокирует запросы

Если что-то не работает, проверьте логи:
```bash
pm2 logs practic-crm-backend --lines 50
```
