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
}
