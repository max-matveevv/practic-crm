'use client'

import React from 'react'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'

export default function Home() {
  const { isAuthenticated, user } = useAuth()

  if (isAuthenticated) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Добро пожаловать, {user?.name}!
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-blue-600 mb-4">
                Управление проектами
              </h2>
              <p className="text-gray-600 mb-4">
                Создавайте и управляйте вашими проектами, храните важную информацию о доступах и настройках.
              </p>
              <Link 
                href="/projects"
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Перейти к проектам
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-green-600 mb-4">
                Управление задачами
              </h2>
              <p className="text-gray-600 mb-4">
                Создавайте задачи, отслеживайте их статус и приоритет. Связывайте задачи с проектами.
              </p>
              <Link 
                href="/tasks"
                className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
              >
                Перейти к задачам
              </Link>
            </div>
          </div>

          <div className="mt-8 bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Быстрые действия
            </h3>
            <div className="flex flex-wrap gap-3">
              <Link 
                href="/projects"
                className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm hover:bg-blue-200 transition-colors"
              >
                Все проекты
              </Link>
              <Link 
                href="/tasks"
                className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm hover:bg-green-200 transition-colors"
              >
                Все задачи
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">
          Добро пожаловать в PracticCRM
        </h1>
        
        <p className="text-xl text-gray-600 mb-8">
          Система управления проектами и задачами для эффективной работы
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-3xl mb-4">📁</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Управление проектами
            </h3>
            <p className="text-gray-600 text-sm">
              Создавайте проекты, храните доступы, логины и пароли в безопасном месте
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-3xl mb-4">✅</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Управление задачами
            </h3>
            <p className="text-gray-600 text-sm">
              Создавайте задачи, отслеживайте прогресс и приоритеты
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-3xl mb-4">🔒</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Безопасность
            </h3>
            <p className="text-gray-600 text-sm">
              Все данные защищены авторизацией и хранятся безопасно
            </p>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Начните работу прямо сейчас
          </h2>
          <p className="text-gray-600 mb-6">
            Зарегистрируйтесь или войдите в систему, чтобы получить доступ ко всем возможностям
          </p>
          <div className="flex justify-center gap-4">
            <Link 
              href="/auth"
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Войти / Зарегистрироваться
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
