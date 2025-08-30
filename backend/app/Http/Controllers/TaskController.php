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
        $query = Task::with('project');
        
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
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'in:pending,in_progress,completed',
            'project_id' => 'nullable|exists:projects,id',
            'priority' => 'integer|min:1|max:3'
        ]);

        $task = Task::create($validated);
        return response()->json($task->load('project'), 201);
    }

    // GET /tasks/{task} - получить задачу
    public function show(Task $task)
    {
        return response()->json($task->load('project'));
    }

    // PUT /tasks/{task} - обновить задачу
    public function update(Request $request, Task $task)
    {
        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'sometimes|in:pending,in_progress,completed',
            'project_id' => 'nullable|exists:projects,id',
            'priority' => 'sometimes|integer|min:1|max:3'
        ]);

        $task->update($validated);
        return response()->json($task->load('project'));
    }

    // DELETE /tasks/{task} - удалить задачу
    public function destroy(Task $task)
    {
        $task->delete();
        return response()->json(['message' => 'Task deleted']);
    }

    // GET /tasks/projects/{project} - получить задачи проекта
    public function projectTasks(Project $project)
    {
        return response()->json($project->tasks()->orderBy('priority', 'desc')->orderBy('created_at', 'desc')->get());
    }
}
