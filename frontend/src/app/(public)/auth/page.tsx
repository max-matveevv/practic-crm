'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { LoginForm } from '@/components/auth/LoginForm'
import { RegisterForm } from '@/components/auth/RegisterForm'

export default function AuthPage() {
    const [mode, setMode] = useState<'login' | 'register'>('login')
    const router = useRouter()
    const { isAuthenticated, loading } = useAuth()

    useEffect(() => {
        if (!loading && isAuthenticated) {
            // Если уже авторизован, перенаправляем на dashboard
            router.push('/dashboard')
        }
    }, [isAuthenticated, loading, router])

    const handleAuthSuccess = () => {
        // Редирект на страницу задач после успешной авторизации
        router.push('/tasks')
    }

    // Показываем загрузку пока проверяется авторизация
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-white">Загрузка...</div>
            </div>
        )
    }

    // Если уже авторизован, не показываем форму
    if (isAuthenticated) {
        return null
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                {mode === 'login' ? (
                    <LoginForm 
                        onSuccess={handleAuthSuccess}
                        onSwitchToRegister={() => setMode('register')}
                    />
                ) : (
                    <RegisterForm 
                        onSuccess={handleAuthSuccess}
                        onSwitchToLogin={() => setMode('login')}
                    />
                )}
            </div>
        </div>
    )
}
