<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class CreateTelescopeUser extends Command
{
    protected $signature = 'telescope:user {email} {password}';
    protected $description = 'Create a user for Telescope access';

    public function handle()
    {
        $email = $this->argument('email');
        $password = $this->argument('password');

        $user = User::create([
            'name' => 'Telescope Admin',
            'email' => $email,
            'password' => Hash::make($password),
            'email_verified_at' => now(),
        ]);

        $this->info("Telescope user created successfully!");
        $this->info("Email: {$email}");
        $this->info("Password: {$password}");
    }
}
