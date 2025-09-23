<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\Project;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    // GET /tasks - получить все задачи
    public function index(Request $request)
    {
        $query = Task::with('project')->where('user_id', $request->user()->id);
        
        // Фильтрация по проекту
        if ($request->has('project_id')) {
            $query->where('project_id', $request->project_id);
        }
        
        // Фильтрация по статусу
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        
        return $query->orderBy('priority', 'desc')->orderBy('created_at', 'desc')->get();
    }

    // POST /tasks - создать задачу
    public function store(Request $request)
    {
        try {
            // Проверяем авторизацию пользователя
            $user = $request->user();
            if (!$user) {
                return response()->json(['message' => 'Unauthorized'], 401);
            }

            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'nullable|string',
                'status' => 'nullable|in:pending,in_progress,completed',
                'project_id' => 'nullable|exists:projects,id',
                'priority' => 'nullable|integer|min:1|max:3',
                'images' => 'nullable|array'
            ]);

            // Проверяем, что проект принадлежит пользователю (если указан)
            if (isset($validated['project_id'])) {
                $project = \App\Models\Project::where('id', $validated['project_id'])
                    ->where('user_id', $user->id)
                    ->first();
                if (!$project) {
                    return response()->json(['message' => 'Project not found or access denied'], 404);
                }
            }

            // Добавляем user_id к валидированным данным
            $validated['user_id'] = $user->id;
            
            // Устанавливаем значения по умолчанию
            $validated['status'] = $validated['status'] ?? 'pending';
            $validated['priority'] = $validated['priority'] ?? 1;

            $task = Task::create($validated);
            return response()->json($task->load('project'), 201);
        } catch (\Exception $e) {
            \Log::error('Task creation error: ' . $e->getMessage());
            \Log::error('Stack trace: ' . $e->getTraceAsString());
            return response()->json(['message' => 'Server Error', 'error' => $e->getMessage()], 500);
        }
    }

    // GET /tasks/{task} - получить задачу
    public function show(Request $request, Task $task)
    {
        // Проверяем, что задача принадлежит текущему пользователю
        if ($task->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        return response()->json($task->load('project'));
    }

    // PUT /tasks/{task} - обновить задачу
    public function update(Request $request, Task $task)
    {
        // Проверяем, что задача принадлежит текущему пользователю
        if ($task->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'sometimes|in:pending,in_progress,completed',
            'project_id' => 'nullable|exists:projects,id',
            'priority' => 'sometimes|integer|min:1|max:3',
            'images' => 'nullable|array'
        ]);

        $task->update($validated);
        return response()->json($task->load('project'));
    }

    // DELETE /tasks/{task} - удалить задачу
    public function destroy(Request $request, Task $task)
    {
        // Проверяем, что задача принадлежит текущему пользователю
        if ($task->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $task->delete();
        return response()->json(['message' => 'Task deleted']);
    }

    // GET /tasks/projects/{project} - получить задачи проекта
    public function projectTasks(Request $request, Project $project)
    {
        // Проверяем, что проект принадлежит текущему пользователю
        if ($project->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($project->tasks()->where('user_id', $request->user()->id)->orderBy('priority', 'desc')->orderBy('created_at', 'desc')->get());
    }
}
