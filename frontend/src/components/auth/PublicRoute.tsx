'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface PublicRouteProps {
  children: React.ReactNode
  redirectTo?: string
}

export function PublicRoute({ children, redirectTo = '/tasks' }: PublicRouteProps) {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && isAuthenticated) {
      // Если пользователь авторизован, перенаправляем на защищенную страницу
      router.push(redirectTo)
    }
  }, [isAuthenticated, loading, router, redirectTo])

  // Показываем загрузку пока проверяем авторизацию
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Если авторизован, не показываем содержимое (будет редирект)
  if (isAuthenticated) {
    return null
  }

  // Если не авторизован, показываем содержимое
  return <>{children}</>
}
