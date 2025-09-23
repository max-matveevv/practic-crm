'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

interface ProtectedContentProps {
    children: React.ReactNode
}

export function ProtectedContent({ children }: ProtectedContentProps) {
    const { isAuthenticated, loading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push('/auth')
        }
    }, [isAuthenticated, loading, router])

    // Показываем загрузку пока проверяется авторизация
    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-white">Загрузка...</div>
            </div>
        )
    }

    // Если не авторизован, не показываем содержимое
    if (!isAuthenticated) {
        return null
    }

    return <>{children}</>
}
