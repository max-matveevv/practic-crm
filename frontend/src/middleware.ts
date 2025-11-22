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

  // Пропускаем /admin - это обрабатывается Laravel/Filament через nginx
  if (pathname.startsWith('/admin')) {
    return NextResponse.next()
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
     * Match all request paths except for the ones starting with:
     * - /admin (обрабатывается Laravel/Filament)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!admin|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
