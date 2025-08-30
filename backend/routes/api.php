<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TaskController;


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::resource('projects', ProjectController::class)->only([
    'index',
    'store',
    'show',
    'destroy'
]);

// Маршруты для задач
Route::resource('tasks', TaskController::class);
Route::get('tasks/projects/{project}', [TaskController::class, 'projectTasks']);
