# Исправление CSRF на продакшене

## Проблема
CSRF token mismatch на HTTPS продакшене из-за неправильных настроек cookies.

## Решение

### 1. Backend настройки (.env)

Скопируйте `deploy/production.env.example` в `.env` на сервере и установите:

```env
# Критически важно для HTTPS
SESSION_SECURE_COOKIE=true
SESSION_SAME_SITE=none
SESSION_PARTITIONED_COOKIE=true

# URL приложения
APP_URL=https://crm.practic.studio
SANCTUM_STATEFUL_DOMAINS=crm.practic.studio
```

### 2. Frontend настройки (.env.local)

Скопируйте `deploy/frontend.env.production.example` в `.env.local`:

```env
NEXT_PUBLIC_API_URL=https://crm.practic.studio/api
```

### 3. Команды для деплоя

```bash
# Backend
php artisan migrate
php artisan config:cache
php artisan route:cache
php artisan session:table  # если используете database sessions

# Frontend
npm run build
```

### 4. Проверка

1. Откройте DevTools → Network
2. Проверьте запрос к `/sanctum/csrf-cookie`
3. Убедитесь что cookie `XSRF-TOKEN` установлен
4. Проверьте что запросы содержат заголовок `X-XSRF-TOKEN`

### 5. Возможные проблемы

- **Cookie не устанавливается**: проверьте `SESSION_SECURE_COOKIE=true`
- **Cross-origin ошибки**: убедитесь что домен в CORS
- **SameSite ошибки**: используйте `SESSION_SAME_SITE=none` для HTTPS

## Важно!

- HTTPS обязателен для `SESSION_SAME_SITE=none`
- `SESSION_PARTITIONED_COOKIE=true` улучшает безопасность
- Всегда используйте `credentials: 'include'` в fetch запросах
