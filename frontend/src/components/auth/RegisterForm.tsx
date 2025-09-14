'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { RegisterCredentials } from '@/lib/types'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

interface RegisterFormProps {
  onSuccess?: () => void
  onSwitchToLogin?: () => void
}

export function RegisterForm({ onSuccess, onSwitchToLogin }: RegisterFormProps) {
  const { register, loading } = useAuth()
  const [formData, setFormData] = useState<RegisterCredentials>({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  })
  const [error, setError] = useState<string>('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Валидация паролей
    if (formData.password !== formData.password_confirmation) {
      setError('Пароли не совпадают')
      return
    }

    if (formData.password.length < 8) {
      setError('Пароль должен содержать минимум 8 символов')
      return
    }

    try {
      await register(formData)
      onSuccess?.()
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Ошибка регистрации')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="max-w-md mx-auto bg-bg-1 rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-center mb-6 text-white">
        Регистрация
      </h2>

      {error && (
        <div className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Имя"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Введите ваше имя"
          required
        />

        <Input
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Введите ваш email"
          required
        />

        <Input
          label="Пароль"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Минимум 8 символов"
          minLength={8}
          required
        />

        <Input
          label="Подтверждение пароля"
          type="password"
          name="password_confirmation"
          value={formData.password_confirmation}
          onChange={handleChange}
          placeholder="Повторите пароль"
          minLength={8}
          required
        />

        <Button
          type="submit"
          loading={loading}
          className="w-full"
        >
          {loading ? 'Регистрация...' : 'Зарегистрироваться'}
        </Button>
      </form>

      {onSwitchToLogin && (
        <div className="mt-4 text-center">
          <p className="text-white/70">
            Уже есть аккаунт?{' '}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-green-400 hover:text-green-300 font-medium"
            >
              Войти
            </button>
          </p>
        </div>
      )}
    </div>
  )
}
