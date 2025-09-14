'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, LoginCredentials, RegisterCredentials } from '@/lib/types'
import { login, register, logout, getCurrentUser, isAuthenticated } from '@/api/auth'

// Функция для удаления токена (дублируем из auth.ts для использования в контексте)
const removeToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token')
    document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
  }
}

interface AuthContextType {
  user: User | null
  loading: boolean
  isAuthenticated: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  register: (credentials: RegisterCredentials) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Проверить авторизацию при загрузке
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Проверяем токен в localStorage или cookies
        const token = localStorage.getItem('auth_token') || 
          document.cookie.split('; ').find(row => row.startsWith('auth_token='))?.split('=')[1]
        
        if (token) {
          const userData = await getCurrentUser()
          setUser(userData)
        }
      } catch (error) {
        console.error('Auth check error:', error)
        // Если ошибка авторизации, очищаем токены
        removeToken()
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const handleLogin = async (credentials: LoginCredentials) => {
    try {
      setLoading(true)
      const response = await login(credentials)
      setUser(response.user)
    } catch (error) {
      removeToken()
      throw error
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (credentials: RegisterCredentials) => {
    try {
      setLoading(true)
      const response = await register(credentials)
      setUser(response.user)
    } catch (error) {
      removeToken()
      throw error
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      setLoading(true)
      await logout()
      setUser(null)
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setLoading(false)
    }
  }

  const refreshUser = async () => {
    try {
      if (isAuthenticated()) {
        const userData = await getCurrentUser()
        setUser(userData)
      }
    } catch (error) {
      console.error('Refresh user error:', error)
      setUser(null)
    }
  }

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: !!user,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    refreshUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
