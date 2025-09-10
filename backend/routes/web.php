<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// Telescope маршруты (только для продакшена)
if (app()->environment('production')) {
    Route::get('/telescope', function () {
        return redirect('/telescope/requests');
    });
    
    // Страница входа в Telescope
    Route::get('/telescope-login', function () {
        return view('telescope-login');
    });
    
    // Обработка входа в Telescope
    Route::post('/telescope-auth', function (\Illuminate\Http\Request $request) {
        $email = $request->input('email');
        $password = $request->input('password');
        
        $user = \App\Models\User::where('email', $email)->first();
        
        if ($user && \Hash::check($password, $user->password)) {
            auth()->login($user);
            return redirect('/telescope');
        }
        
        return redirect('/telescope-login')->with('error', 'Invalid credentials');
    });
    
    // Быстрый вход для Telescope (без пароля)
    Route::get('/telescope-quick', function () {
        $user = \App\Models\User::where('email', 'telescope@crm.practic.studio')->first();
        if ($user) {
            auth()->login($user);
            return redirect('/telescope');
        }
        return 'User not found. Run: php artisan telescope:user telescope@crm.practic.studio telescope123';
    });
}
