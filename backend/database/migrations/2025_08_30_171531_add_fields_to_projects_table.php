<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            // Доступы к админ панели
            $table->string('admin_url')->nullable();
            $table->string('admin_login')->nullable();
            $table->string('admin_password')->nullable();
            
            // SSH доступы
            $table->string('ssh_host')->nullable();
            $table->string('ssh_user')->nullable();
            $table->string('ssh_password')->nullable();
            $table->integer('ssh_port')->default(22);
            
            // Команды для сборки/запуска
            $table->text('build_commands')->nullable();
            
            // Общие заметки
            $table->text('notes')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropColumn([
                'admin_url', 'admin_login', 'admin_password',
                'ssh_host', 'ssh_user', 'ssh_password', 'ssh_port',
                'build_commands', 'notes'
            ]);
        });
    }
};
