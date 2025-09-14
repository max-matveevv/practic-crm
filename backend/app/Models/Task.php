<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    protected $fillable = [
        'title',
        'description',
        'status',
        'project_id',
        'priority',
        'user_id',
        'images'
    ];

    protected $casts = [
        'priority' => 'integer',
        'images' => 'array',
    ];

    // Отношение к пользователю
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Отношение к проекту
    public function project()
    {
        return $this->belongsTo(Project::class);
    }

}
