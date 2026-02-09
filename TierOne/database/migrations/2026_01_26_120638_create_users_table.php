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
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('username')->unique();
            $table->string('email')->unique();
            $table->string('password_hash');
            $table->string('nombre');
            $table->string('apellido');
            $table->string('pais');
            $table->timestamp('fecha_registro')->useCurrent();
            $table->timestamp('ultima_conexion')->nullable();
            $table->enum('rol', ['player', 'admin', 'streamer'])->default('player');
            $table->boolean('verificado')->default(false);
            $table->boolean('activo')->default(true);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
