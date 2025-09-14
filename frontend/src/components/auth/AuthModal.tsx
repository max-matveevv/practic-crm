'use client'

import { useState } from 'react'
import { LoginForm } from './LoginForm'
import { RegisterForm } from './RegisterForm'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  defaultMode?: 'login' | 'register'
}

export function AuthModal({ isOpen, onClose, defaultMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>(defaultMode)

  if (!isOpen) return null

  const handleSuccess = () => {
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="relative">
        <button
          onClick={onClose}
          className="absolute -top-2 -right-2 bg-gray-600 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-700 transition-colors z-10"
        >
          ×
        </button>
        
        {mode === 'login' ? (
          <LoginForm 
            onSuccess={handleSuccess}
            onSwitchToRegister={() => setMode('register')}
          />
        ) : (
          <RegisterForm 
            onSuccess={handleSuccess}
            onSwitchToLogin={() => setMode('login')}
          />
        )}
      </div>
    </div>
  )
}
