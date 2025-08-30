@echo off
echo �� Запуск CRM проекта...
echo.

echo 🔧 Запуск backend и frontend...
echo.

:: Запуск backend в новом окне
start "CRM Backend" cmd /k "cd /d %~dp0backend && php artisan serve --host=0.0.0.0 --port=8000"

:: Небольшая задержка для запуска backend
timeout /t 3 /nobreak > nul

:: Запуск frontend в новом окне
start "CRM Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo ✅ Проект запущен!
echo 🌐 Frontend: http://localhost:3000
echo 🔧 Backend API: http://localhost:8000/api
echo.
echo 💡 Для остановки закройте окна командной строки
pause
