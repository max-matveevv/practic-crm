'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function PublicHomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-6">
            PracticCRM
          </h1>
          <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
            Эффективная система управления проектами и задачами. 
            Организуйте свою работу, отслеживайте прогресс и достигайте целей.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth">
              <Button size="lg" className="px-8 py-3">
                Начать работу
              </Button>
            </Link>
            <Link href="/auth">
              <Button variant="secondary" size="lg" className="px-8 py-3">
                Войти в систему
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-bg-1 p-6 rounded-lg border border-white/10 text-center">
            <div className="text-4xl mb-4">📁</div>
            <h3 className="text-xl font-semibold mb-3 text-blue-400">
              Управление проектами
            </h3>
            <p className="text-white/70">
              Создавайте и организуйте проекты, храните важную информацию о доступах, 
              настройках и документации.
            </p>
          </div>

          <div className="bg-bg-1 p-6 rounded-lg border border-white/10 text-center">
            <div className="text-4xl mb-4">✅</div>
            <h3 className="text-xl font-semibold mb-3 text-green-400">
              Управление задачами
            </h3>
            <p className="text-white/70">
              Создавайте задачи, устанавливайте приоритеты, отслеживайте статус 
              и связывайте с проектами.
            </p>
          </div>

          <div className="bg-bg-1 p-6 rounded-lg border border-white/10 text-center">
            <div className="text-4xl mb-4">👤</div>
            <h3 className="text-xl font-semibold mb-3 text-purple-400">
              Персональные данные
            </h3>
            <p className="text-white/70">
              Каждый пользователь видит только свои проекты и задачи. 
              Полная изоляция данных и конфиденциальность.
            </p>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="bg-bg-1 rounded-lg border border-white/10 p-8">
          <h2 className="text-3xl font-bold text-center mb-8 text-white">
            Почему PracticCRM?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-white">
                🚀 Быстрый старт
              </h3>
              <p className="text-white/70 mb-6">
                Простая регистрация и интуитивный интерфейс позволят вам 
                начать работу за считанные минуты.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4 text-white">
                🔒 Безопасность
              </h3>
              <p className="text-white/70 mb-6">
                Современная система авторизации с CSRF защитой и токенной аутентификацией.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4 text-white">
                📱 Адаптивность
              </h3>
              <p className="text-white/70 mb-6">
                Полностью адаптивный дизайн для работы на любых устройствах 
                - от смартфонов до десктопов.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4 text-white">
                ⚡ Производительность
              </h3>
              <p className="text-white/70 mb-6">
                Быстрая работа благодаря современным технологиям Next.js и Laravel.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <h2 className="text-3xl font-bold mb-4 text-white">
            Готовы начать?
          </h2>
          <p className="text-white/70 mb-8">
            Присоединяйтесь к PracticCRM и организуйте свою работу уже сегодня
          </p>
          <Link href="/auth">
            <Button size="lg" className="px-8 py-3">
              Создать аккаунт
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
