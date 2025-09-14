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

// Проверяем, есть ли токен авторизации в cookies
function hasAuthToken(request: NextRequest): boolean {
  const token = request.cookies.get('auth_token')?.value
  return !!token
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Пропускаем статические файлы и API маршруты
  if (pathname.startsWith('/_next/') || 
      pathname.startsWith('/api/') || 
      pathname.includes('.')) {
    return NextResponse.next()
  }

  // Если это публичный маршрут
  if (isPublicRoute(pathname)) {
    // Если пользователь авторизован и заходит на главную страницу, перенаправляем на задачи
    if (pathname === '/' && hasAuthToken(request)) {
      const url = request.nextUrl.clone()
      url.pathname = '/tasks'
      return NextResponse.redirect(url)
    }
    return NextResponse.next()
  }

  // Если нет токена, перенаправляем на главную
  if (!hasAuthToken(request)) {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
