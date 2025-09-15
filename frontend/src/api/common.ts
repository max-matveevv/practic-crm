// Общие функции для работы с API

// Автоматическое определение API URL в зависимости от окружения
const getApiBaseUrl = () => {
  // Если мы в браузере, сначала проверяем локальную разработку
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const port = window.location.port;
    
    // Приоритет: если это localhost или порт 3000, используем локальный API
    if (hostname === 'localhost' || hostname === '127.0.0.1' || port === '3000') {
      return 'http://127.0.0.1:8000/api';
    }
    
    // Если это продакшн домен
    if (hostname === 'crm.practic.studio') {
      return 'https://crm.practic.studio/api';
    }
  }
  
  // Если есть переменная окружения и мы не в локальной разработке, используем её
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  // По умолчанию для разработки
  return 'http://127.0.0.1:8000/api';
};

const API_BASE_URL = getApiBaseUrl();

// Логируем используемый API URL для отладки (только в development)
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  console.log('API_BASE_URL:', API_BASE_URL);
}

// Получить токен из localStorage
export const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token')
  }
  return null
}

// CSRF токены больше не используются - только Bearer токены

// Получить заголовки с авторизацией
export const getAuthHeaders = (includeAuth = true): HeadersInit => {
  const token = getToken()
  
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    ...(includeAuth && token && { 'Authorization': `Bearer ${token}` })
  }
}

// Базовые настройки fetch для API запросов
export const apiRequest = async (url: string, options: RequestInit = {}) => {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers
    },
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Ошибка сервера' }))
    throw new Error(errorData.message || `HTTP ${response.status}`)
  }

  return response.json()
}

export { API_BASE_URL }
