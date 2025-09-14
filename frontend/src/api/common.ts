// Общие функции для работы с API

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

// Получить токен из localStorage
export const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token')
  }
  return null
}

// Получить CSRF токен из cookies
export const getCsrfToken = (): string | null => {
  if (typeof window !== 'undefined') {
    const cookies = document.cookie.split(';')
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=')
      if (name === 'XSRF-TOKEN') {
        return decodeURIComponent(value)
      }
    }
  }
  return null
}

// Получить заголовки с авторизацией
export const getAuthHeaders = (includeAuth = true): HeadersInit => {
  const token = getToken()
  const csrfToken = getCsrfToken()
  
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    ...(includeAuth && token && { 'Authorization': `Bearer ${token}` }),
    ...(csrfToken && { 'X-XSRF-TOKEN': csrfToken })
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
    credentials: 'include'
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Ошибка сервера' }))
    throw new Error(errorData.message || `HTTP ${response.status}`)
  }

  return response.json()
}

export { API_BASE_URL }
