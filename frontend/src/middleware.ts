import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Проверяем, является ли маршрут публичным
function isPublicRoute(pathname: string): boolean {
  // Главная страница
  if (pathname === '/') return true
  
  // Страницы авторизации
  if (pathname.startsWith('/auth')) return true
  
  // Страница сброса пароля
  if (pathname.startsWith('/reset-password')) return true
  
  return false
}

// Проверяем, является ли маршрут защищенным
function isProtectedRoute(pathname: string): boolean {
  // Защищенные маршруты
  const protectedRoutes = ['/dashboard', '/tasks', '/projects', '/profile']
  return protectedRoutes.some(route => pathname.startsWith(route))
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // КРИТИЧЕСКИ ВАЖНО: /admin обрабатывается Laravel/Filament через nginx
  // Если запрос все равно попал сюда, возвращаем пустой ответ
  // чтобы Next.js не обрабатывал этот путь
  if (pathname.startsWith('/admin')) {
    // Возвращаем пустой ответ, чтобы запрос не обрабатывался Next.js
    // Nginx должен перехватить запрос до того, как он попадет сюда
    return new NextResponse(null, { status: 200 })
  }

  // Пропускаем статические файлы и API маршруты
  if (pathname.startsWith('/_next/') || 
      pathname.startsWith('/api/') || 
      pathname.includes('.')) {
    return NextResponse.next()
  }

  // Если это публичный маршрут, пропускаем
  if (isPublicRoute(pathname)) {
    return NextResponse.next()
  }

  // Если это защищенный маршрут, пропускаем - проверка авторизации будет на клиенте
  // AuthGuard компонент проверит авторизацию и сделает редирект при необходимости
  if (isProtectedRoute(pathname)) {
    return NextResponse.next()
  }

  // Для всех остальных маршрутов пропускаем
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Исключаем /admin из обработки - он обрабатывается Laravel/Filament через nginx
     * Используем более простой паттерн, который точно исключает /admin
     */
    '/((?!admin|_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
