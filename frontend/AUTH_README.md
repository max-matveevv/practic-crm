# Система авторизации PracticCRM

## Обзор

В проекте реализована полная система авторизации с использованием JWT токенов и Laravel Sanctum на бэкенде.

## Компоненты системы авторизации

### 1. Типы данных (`src/lib/types.ts`)
- `User` - модель пользователя
- `AuthResponse` - ответ с токеном и данными пользователя
- `LoginCredentials` - данные для входа
- `RegisterCredentials` - данные для регистрации

### 2. API функции (`src/api/auth.ts`)
- `login()` - вход в систему
- `register()` - регистрация
- `logout()` - выход из системы
- `getCurrentUser()` - получение текущего пользователя
- `isAuthenticated()` - проверка авторизации
- `updateProfile()` - обновление профиля
- `changePassword()` - смена пароля

### 3. Контекст авторизации (`src/contexts/AuthContext.tsx`)
- `AuthProvider` - провайдер контекста
- `useAuth()` - хук для использования авторизации
- Автоматическая проверка токена при загрузке
- Управление состоянием пользователя

### 4. Компоненты авторизации (`src/components/auth/`)
- `LoginForm` - форма входа
- `RegisterForm` - форма регистрации
- `AuthModal` - модальное окно авторизации
- `ProtectedRoute` - защищенный маршрут

### 5. Обновленные компоненты
- `Header` - кнопки входа/выхода, приветствие пользователя
- `Layout` - обертка с AuthProvider
- Все страницы защищены `ProtectedRoute`

## Использование

### Проверка авторизации
```tsx
import { useAuth } from '@/contexts/AuthContext'

function MyComponent() {
  const { isAuthenticated, user, loading } = useAuth()
  
  if (loading) return <div>Загрузка...</div>
  
  if (!isAuthenticated) {
    return <div>Необходимо войти в систему</div>
  }
  
  return <div>Привет, {user?.name}!</div>
}
```

### Защита маршрутов
```tsx
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

function MyPage() {
  return (
    <ProtectedRoute>
      <div>Защищенный контент</div>
    </ProtectedRoute>
  )
}
```

### Авторизация в API
Все API функции автоматически добавляют токен авторизации в заголовки запросов.

## Требования к бэкенду

Для работы системы авторизации необходимо:

1. **Laravel Sanctum** настроен и работает
2. **API маршруты** для авторизации:
   - `POST /api/auth/login`
   - `POST /api/auth/register`
   - `POST /api/auth/logout`
   - `GET /api/auth/me`
   - `PUT /api/auth/profile`
   - `POST /api/auth/change-password`

3. **Middleware** `auth:sanctum` на защищенных маршрутах
4. **CORS** настроен для фронтенда

## Переменные окружения

```env
NEXT_PUBLIC_API_URL=https://crm.practic.studio/api
```

## Безопасность

- Токены хранятся в `localStorage`
- Автоматическое удаление токена при ошибках 401
- Защита всех API маршрутов
- Валидация данных на фронтенде и бэкенде

## Состояния авторизации

1. **Загрузка** - проверка токена при инициализации
2. **Не авторизован** - показ форм входа/регистрации
3. **Авторизован** - доступ ко всем функциям
4. **Ошибка** - обработка ошибок авторизации
