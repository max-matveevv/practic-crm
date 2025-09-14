'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { sendPasswordResetLink, resetPassword } from '@/api/auth';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

function ResetPasswordContent() {
  const [step, setStep] = useState<'email' | 'reset'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    // Проверяем, есть ли токен и email в URL
    const urlToken = searchParams.get('token');
    const urlEmail = searchParams.get('email');
    
    if (urlToken && urlEmail) {
      setToken(urlToken);
      setEmail(urlEmail);
      setStep('reset');
    }
  }, [searchParams]);

  const handleSendResetLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await sendPasswordResetLink(email);
      setMessage(response.message);
      
      // Если есть reset_url, показываем его для демо
      if (response.reset_url) {
        setMessage(`${response.message}\n\nСсылка для сброса: ${response.reset_url}`);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== passwordConfirmation) {
      setError('Пароли не совпадают');
      return;
    }

    if (password.length < 8) {
      setError('Пароль должен содержать минимум 8 символов');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await resetPassword(email, token, password, passwordConfirmation);
      setMessage(response.message);
      
      // Через 2 секунды перенаправляем на страницу входа
      setTimeout(() => {
        router.push('/auth?tab=login');
      }, 2000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            {step === 'email' ? 'Сброс пароля' : 'Новый пароль'}
          </h2>
          <p className="mt-2 text-center text-sm text-white/70">
            {step === 'email' ? (
              <>Введите email для получения ссылки сброса пароля</>
            ) : (
              <>Введите новый пароль</>
            )}
          </p>
        </div>

        {step === 'email' ? (
          <form className="mt-8 space-y-6" onSubmit={handleSendResetLink}>
            <Input
              label="Email адрес"
              type="email"
              name="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Введите ваш email"
            />

            <div>
              <Button
                type="submit"
                loading={loading}
                className="w-full"
              >
                {loading ? 'Отправка...' : 'Отправить ссылку для сброса'}
              </Button>
            </div>

            <div className="text-center">
              <Link 
                href="/auth?tab=login" 
                className="font-medium text-green-400 hover:text-green-300"
              >
                Вернуться к входу
              </Link>
            </div>
          </form>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleResetPassword}>
            <Input
              label="Email адрес"
              type="email"
              name="email"
              value={email}
              disabled
            />

            <Input
              label="Новый пароль"
              type="password"
              name="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Введите новый пароль"
            />

            <Input
              label="Подтвердите пароль"
              type="password"
              name="password_confirmation"
              autoComplete="new-password"
              required
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              placeholder="Подтвердите новый пароль"
            />

            <div>
              <Button
                type="submit"
                loading={loading}
                className="w-full"
              >
                {loading ? 'Сброс пароля...' : 'Сбросить пароль'}
              </Button>
            </div>

            <div className="text-center">
              <Link 
                href="/auth?tab=login" 
                className="font-medium text-green-400 hover:text-green-300"
              >
                Вернуться к входу
              </Link>
            </div>
          </form>
        )}

        {message && (
          <div className="rounded-md bg-green-900/50 border border-green-500 p-4">
            <div className="text-sm text-green-300 whitespace-pre-line">
              {message}
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-md bg-red-900/50 border border-red-500 p-4">
            <div className="text-sm text-red-300">
              {error}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
