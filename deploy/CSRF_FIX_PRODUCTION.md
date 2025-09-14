# Исправление CSRF на продакшене с SSL

## Проблема
CSRF token mismatch на HTTPS продакшене из-за неправильных настроек cookies для cross-origin запросов.

## Решение

### 1. Backend настройки (.env)

Скопируйте `deploy/production.env.example` в `.env` на сервере и установите:

```env
# Критически важно для HTTPS
APP_URL=https://crm.practic.studio
SESSION_SECURE_COOKIE=true
SESSION_SAME_SITE=none
SESSION_PARTITIONED_COOKIE=true
SESSION_DOMAIN=.practic.studio
SANCTUM_STATEFUL_DOMAINS=crm.practic.studio

# Database sessions
SESSION_DRIVER=database
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

### 5. Отладка CSRF проблемы

#### Шаг 1: Проверьте cookie в DevTools
1. Откройте DevTools → Application → Cookies
2. Найдите cookie `XSRF-TOKEN`
3. Проверьте его параметры:
   - `Secure: true` (для HTTPS)
   - `SameSite: None` (для cross-origin)
   - `Domain: .practic.studio` или `crm.practic.studio`

#### Шаг 2: Проверьте запросы в Network
1. Откройте DevTools → Network
2. Найдите запрос к `/sanctum/csrf-cookie`
3. Проверьте Response Headers - должен быть `Set-Cookie: XSRF-TOKEN=...`
4. Найдите запрос к `/api/auth/login`
5. Проверьте Request Headers - должен быть `X-XSRF-TOKEN: ...`

#### Шаг 3: Проверьте консоль браузера
Если есть ошибки CORS или cookies, они будут в консоли.

#### Шаг 4: Проверьте серверные логи
```bash
tail -f storage/logs/laravel.log
```

### 6. Возможные проблемы

- **Cookie не устанавливается**: проверьте `SESSION_SECURE_COOKIE=true`
- **Cross-origin ошибки**: убедитесь что домен в CORS
- **SameSite ошибки**: используйте `SESSION_SAME_SITE=none` для HTTPS
- **Domain проблемы**: попробуйте `SESSION_DOMAIN=.practic.studio` или уберите совсем
- **Sanctum не работает**: проверьте `SANCTUM_STATEFUL_DOMAINS`

### 7. Альтернативное решение (если не помогает)

Если проблема остается, попробуйте:

```env
# В .env
SESSION_SAME_SITE=lax
SESSION_DOMAIN=crm.practic.studio
```

И обновите frontend URL construction:
```typescript
const baseUrl = process.env.NODE_ENV === 'production' 
  ? 'https://crm.practic.studio' 
  : API_BASE_URL.replace('/api', '')
```

## Важно!

- HTTPS обязателен для `SESSION_SAME_SITE=none`
- `SESSION_PARTITIONED_COOKIE=true` улучшает безопасность
- Всегда используйте `credentials: 'include'` в fetch запросах
- Проверьте что домен в CORS и Sanctum stateful domains
