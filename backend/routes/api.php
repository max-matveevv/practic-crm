<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\FileUploadController;


// Маршруты авторизации (публичные)
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/forgot-password', [AuthController::class, 'sendPasswordResetLink']);
Route::post('/auth/reset-password', [AuthController::class, 'resetPassword']);

// Защищенные маршруты
Route::middleware('auth:sanctum')->group(function () {
    // Авторизация
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::put('/auth/profile', [AuthController::class, 'updateProfile']);
    Route::post('/auth/change-password', [AuthController::class, 'changePassword']);
    
    
    // Проекты
    Route::resource('projects', ProjectController::class)->only([
        'index',
        'store',
        'show',
        'update',
        'destroy'
    ]);
    
    // Задачи
    Route::resource('tasks', TaskController::class);
    Route::get('tasks/projects/{project}', [TaskController::class, 'projectTasks']);
    
    // Загрузка файлов
    Route::post('/upload/images', [FileUploadController::class, 'uploadImages']);
});
