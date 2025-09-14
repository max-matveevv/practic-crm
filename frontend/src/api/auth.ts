import { AuthResponse, LoginCredentials, RegisterCredentials, User } from '@/lib/types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

// Получить токен из localStorage
const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token')
  }
  return null
}

// Сохранить токен в localStorage и cookies
const setToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_token', token)
    // Устанавливаем cookie для middleware
    document.cookie = `auth_token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`
  }
}

// Удалить токен из localStorage и cookies
const removeToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token')
    // Удаляем cookie
    document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
  }
}

// Получить заголовки с авторизацией
const getAuthHeaders = (): HeadersInit => {
  const token = getToken()
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  }
}

// Вход в систему
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(credentials)
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Ошибка входа в систему')
    }

    const data: AuthResponse = await response.json()
    setToken(data.token)
    return data
  } catch (error) {
    console.error('Login error:', error)
    throw error
  }
}

// Регистрация
export const register = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(credentials)
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Ошибка регистрации')
    }

    const data: AuthResponse = await response.json()
    setToken(data.token)
    return data
  } catch (error) {
    console.error('Register error:', error)
    throw error
  }
}

// Выход из системы
export const logout = async (): Promise<void> => {
  try {
    const token = getToken()
    if (token) {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: getAuthHeaders()
      })
    }
  } catch (error) {
    console.error('Logout error:', error)
  } finally {
    removeToken()
  }
}

// Получить текущего пользователя
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const token = getToken()
    if (!token) {
      return null
    }

    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: getAuthHeaders()
    })

    if (!response.ok) {
      if (response.status === 401) {
        removeToken()
        return null
      }
      throw new Error('Ошибка получения данных пользователя')
    }

    const data: { user: User } = await response.json()
    return data.user
  } catch (error) {
    console.error('Get current user error:', error)
    removeToken()
    return null
  }
}

// Проверить, авторизован ли пользователь
export const isAuthenticated = (): boolean => {
  return getToken() !== null
}

// Обновить профиль пользователя
export const updateProfile = async (userData: Partial<User>): Promise<User> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData)
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Ошибка обновления профиля')
    }

    const data: { user: User } = await response.json()
    return data.user
  } catch (error) {
    console.error('Update profile error:', error)
    throw error
  }
}

// Изменить пароль
export const changePassword = async (passwordData: {
  current_password: string
  password: string
  password_confirmation: string
}): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(passwordData)
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Ошибка изменения пароля')
    }
  } catch (error) {
    console.error('Change password error:', error)
    throw error
  }
}
