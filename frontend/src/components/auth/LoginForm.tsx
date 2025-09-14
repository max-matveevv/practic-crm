'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { LoginCredentials } from '@/lib/types'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

interface LoginFormProps {
  onSuccess?: () => void
  onSwitchToRegister?: () => void
}

export function LoginForm({ onSuccess, onSwitchToRegister }: LoginFormProps) {
  const { login, loading } = useAuth()
  const [formData, setFormData] = useState<LoginCredentials>({
    email: '',
    password: ''
  })
  const [error, setError] = useState<string>('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      await login(formData)
      onSuccess?.()
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Ошибка входа в систему')
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
        Вход в систему
      </h2>

      {error && (
        <div className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
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
          placeholder="Введите ваш пароль"
          required
        />

        <Button
          type="submit"
          loading={loading}
          className="w-full"
        >
          {loading ? 'Вход...' : 'Войти'}
        </Button>
      </form>

      <div className="mt-3 text-center">
        <a
          href="/reset-password"
          className="text-sm text-white/70 hover:text-white font-medium"
        >
          Забыли пароль?
        </a>
      </div>

      {onSwitchToRegister && (
        <div className="mt-4 text-center">
          <p className="text-white/70">
            Нет аккаунта?{' '}
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="text-green-400 hover:text-green-300 font-medium"
            >
              Зарегистрироваться
            </button>
          </p>
        </div>
      )}
    </div>
  )
}
