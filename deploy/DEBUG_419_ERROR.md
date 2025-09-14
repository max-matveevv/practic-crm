# Отладка ошибки 419 CSRF token mismatch

## Проблема
```
api/auth/register:1  Failed to load resource: the server responded with a status of 419 ()
Register error: Error: CSRF token mismatch.
```

## Пошаговая отладка

### 1. Проверьте консоль браузера
Откройте DevTools → Console и найдите логи:
- `Getting CSRF cookie from: https://crm.practic.studio/sanctum/csrf-cookie`
- `CSRF cookie response status: 200`
- `CSRF token after cookie request: [token]`

### 2. Проверьте Network tab
1. Откройте DevTools → Network
2. Найдите запрос к `/sanctum/csrf-cookie`
3. Проверьте Response Headers - должен быть `Set-Cookie: XSRF-TOKEN=...`
4. Найдите запрос к `/api/auth/register`
5. Проверьте Request Headers - должен быть `X-XSRF-TOKEN: ...`

### 3. Проверьте Application tab
1. DevTools → Application → Cookies
2. Найдите cookie `XSRF-TOKEN`
3. Проверьте его параметры:
   - `Secure: true`
   - `SameSite: Lax` (или None)
   - `Domain: crm.practic.studio` или `.practic.studio`

### 4. Проверьте серверные логи
```bash
tail -f storage/logs/laravel.log
```

## Возможные решения

### Решение 1: Измените SameSite на Lax
```env
# В .env на сервере
SESSION_SAME_SITE=lax
SESSION_DOMAIN=crm.practic.studio
```

### Решение 2: Уберите domain совсем
```env
# В .env на сервере
SESSION_DOMAIN=
```

### Решение 3: Проверьте CORS настройки
Убедитесь что в `config/cors.php` есть:
```php
'allowed_origins' => [
    'https://crm.practic.studio',
],
'supports_credentials' => true,
```

### Решение 4: Проверьте Sanctum настройки
```env
SANCTUM_STATEFUL_DOMAINS=crm.practic.studio
```

### Решение 5: Альтернативный подход
Если ничего не помогает, попробуйте:

1. Установите `SESSION_SAME_SITE=strict`
2. Уберите `SESSION_DOMAIN`
3. Убедитесь что фронтенд и бэкенд на одном домене

## Временная отладка

Для детальной отладки добавьте в консоль браузера:

```javascript
// Проверить все cookies
console.log('All cookies:', document.cookie);

// Проверить CSRF token
const csrfToken = document.cookie
  .split(';')
  .find(cookie => cookie.trim().startsWith('XSRF-TOKEN='));
console.log('CSRF token:', csrfToken);

// Проверить текущий домен
console.log('Current domain:', window.location.hostname);
```

## Команды для проверки на сервере

```bash
# Очистить кэш конфигурации
php artisan config:clear
php artisan config:cache

# Проверить текущие настройки
php artisan tinker
>>> config('session.same_site')
>>> config('session.secure')
>>> config('session.domain')
```

## Если проблема остается

1. Попробуйте разные комбинации SameSite
2. Проверьте что SSL сертификат валидный
3. Убедитесь что нет проблем с прокси/балансировщиком
4. Проверьте что сессии работают (попробуйте простую форму)
