<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class TelescopeAccess
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        // Разрешаем доступ к Telescope в продакшене
        // В реальном проекте здесь должна быть проверка авторизации
        if (app()->environment('production')) {
            return $next($request);
        }

        // В разработке разрешаем всем
        return $next($request);
    }
}
