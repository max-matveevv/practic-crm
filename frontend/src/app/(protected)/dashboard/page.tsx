'use client'

import React from 'react'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'

export default function DashboardPage() {
  const { user } = useAuth()

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">
          Добро пожаловать, {user?.name}!
        </h1>
        <p className="text-white/70">
          Управляйте своими проектами и задачами эффективно
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="p-6 bg-bg-1 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-white">
            📁 Управление проектами
          </h2>
          <p className="text-white/70 mb-4">
            Создавайте и управляйте вашими проектами, храните важную информацию о доступах и настройках.
          </p>
          <Link 
            href="/projects"
            className="inline-block bg-btn hover:bg-blue-600 text-white px-6 py-3 rounded-3xl text-sm font-medium transition-colors"
          >
            Перейти к проектам
          </Link>
        </div>
        
        <div className="p-6 bg-bg-1 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-white">
            ✅ Управление задачами
          </h2>
          <p className="text-white/70 mb-4">
            Создавайте задачи, отслеживайте их статус и приоритет. Связывайте задачи с проектами.
          </p>
          <Link 
            href="/tasks"
            className="inline-block bg-btn hover:bg-blue-600 text-white px-6 py-3 rounded-3xl text-sm font-medium transition-colors"
          >
            Перейти к задачам
          </Link>
        </div>
      </div>

      <div className="bg-bg-1 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-white">
          Быстрые действия
        </h3>
        <div className="flex flex-wrap gap-3">
          <Link 
            href="/projects"
            className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm hover:bg-blue-200 transition-colors"
          >
            Все проекты
          </Link>
          <Link 
            href="/tasks"
            className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm hover:bg-green-200 transition-colors"
          >
            Все задачи
          </Link>
        </div>
      </div>
    </div>
  )
}
