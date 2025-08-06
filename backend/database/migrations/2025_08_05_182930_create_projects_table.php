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
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('login')->nullable();
            $table->string('password')->nullable();
            $table->string('url')->nullable();
            $table->text('description')->nullable();
            $table->text('accesses')->nullable(); // для доступа (markdown, json, и т.д.)
            $table->timestamps(); // created_at и updated_at
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
