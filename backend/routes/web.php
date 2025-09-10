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
    
    // Простой вход для Telescope
    Route::get('/telescope-login', function () {
        $user = \App\Models\User::where('email', 'telescope@crm.practic.studio')->first();
        if ($user) {
            auth()->login($user);
            return redirect('/telescope');
        }
        return 'User not found';
    });
}
