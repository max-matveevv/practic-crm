import { AuthResponse, LoginCredentials, RegisterCredentials, User } from '@/lib/types'
import { getToken, getAuthHeaders, API_BASE_URL } from './common'

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

// Получить CSRF cookie
const getCsrfCookie = async (): Promise<void> => {
  const baseUrl = API_BASE_URL.replace('/api', '')
  const response = await fetch(`${baseUrl}/sanctum/csrf-cookie`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    }
  })
  
  if (!response.ok) {
    throw new Error(`Failed to get CSRF cookie: ${response.status}`)
  }
}


// Вход в систему
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    // Получаем CSRF cookie перед авторизацией
    await getCsrfCookie()
    
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: getAuthHeaders(false), // Не включаем Authorization для login
      credentials: 'include',
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
    // Получаем CSRF cookie перед регистрацией
    await getCsrfCookie()
    
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: getAuthHeaders(false), // Не включаем Authorization для register
      credentials: 'include',
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
        headers: getAuthHeaders(),
        credentials: 'include'
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
      headers: getAuthHeaders(),
      credentials: 'include'
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
      credentials: 'include',
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
      credentials: 'include',
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

// Отправить ссылку для сброса пароля
export const sendPasswordResetLink = async (email: string): Promise<{ message: string; reset_url?: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: getAuthHeaders(false),
      credentials: 'include',
      body: JSON.stringify({ email })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Ошибка отправки ссылки для сброса пароля')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Send password reset link error:', error)
    throw error
  }
}

// Сбросить пароль по токену
export const resetPassword = async (email: string, token: string, password: string, passwordConfirmation: string): Promise<{ message: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: getAuthHeaders(false),
      credentials: 'include',
      body: JSON.stringify({
        email,
        token,
        password,
        password_confirmation: passwordConfirmation
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Ошибка сброса пароля')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Reset password error:', error)
    throw error
  }
}
