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
        'priority'
    ];

    protected $casts = [
        'priority' => 'integer',
    ];

    // Отношение к проекту
    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    // Получить статус на русском языке
    public function getStatusTextAttribute()
    {
        return [
            'pending' => 'Ожидает',
            'in_progress' => 'В работе',
            'completed' => 'Завершена'
        ][$this->status] ?? $this->status;
    }

    // Получить приоритет на русском языке
    public function getPriorityTextAttribute()
    {
        return [
            1 => 'Низкий',
            2 => 'Средний',
            3 => 'Высокий'
        ][$this->priority] ?? $this->priority;
    }
}
