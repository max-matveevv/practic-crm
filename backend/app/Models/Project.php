<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    protected $fillable = [
        'title', 
        'description', 
        'login', 
        'password', 
        'url', 
        'accesses',
        'accesses_login',
        'accesses_password',
        'admin_url',
        'admin_login',
        'admin_password',
        'admin_accesses',
        'ssh_host',
        'ssh_user',
        'ssh_password',
        'ssh_port',
        'build_commands',
        'notes',
        'user_id'
    ];

    protected $casts = [
        'ssh_port' => 'integer',
    ];

    // Отношение к пользователю
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Отношение к задачам
    public function tasks()
    {
        return $this->hasMany(Task::class);
    }

}
