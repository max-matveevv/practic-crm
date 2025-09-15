<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Project;
use App\Models\User;

class CreateTestProject extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'project:create-test';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create a test project for development';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $user = User::where('email', 'test@example.com')->first();
        
        if (!$user) {
            $this->error('Test user not found. Please run: php artisan user:create-test');
            return 1;
        }

        $project = Project::firstOrCreate(
            ['title' => 'Test Project'],
            [
                'description' => 'Test project for development',
                'user_id' => $user->id,
            ]
        );

        $this->info("Test project created/updated:");
        $this->info("Title: {$project->title}");
        $this->info("ID: {$project->id}");
        $this->info("User ID: {$project->user_id}");

        return 0;
    }
}