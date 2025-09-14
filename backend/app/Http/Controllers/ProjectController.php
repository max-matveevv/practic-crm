<?php
namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    // GET /projects
    public function index(Request $request)
    {
        return Project::where('user_id', $request->user()->id)->get();
    }

    // POST /projects
    public function store(Request $request)
    {
        $data = $request->all();
        $data['user_id'] = $request->user()->id;
        
        $project = Project::create($data);
        return response()->json($project, 201);
    }

    // GET /projects/{project}
    public function show(Request $request, Project $project)
    {
        // Проверяем, что проект принадлежит текущему пользователю
        if ($project->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        return response()->json($project);
    }

    // DELETE /projects/{project}
    public function destroy(Request $request, Project $project)
    {
        // Проверяем, что проект принадлежит текущему пользователю
        if ($project->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $project->delete();
        return response()->json(['message' => 'Project deleted']);
    }
}
