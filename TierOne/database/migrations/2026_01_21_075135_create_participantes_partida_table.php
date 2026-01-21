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
        Schema::create('participantes_partida', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_partida')->constrained('partidas')->onDelete('cascade');
            $table->foreignId('id_usuario')->constrained('users')->onDelete('cascade');
            $table->integer('id_equipo')->nullable();
            $table->enum('equipo_asignado', ['team_a', 'team_b'])->nullable();
            $table->decimal('pago_entrada', 10, 2)->default(0);
            $table->boolean('confirmado')->default(false);
            $table->timestamp('fecha_union')->useCurrent();
            $table->string('jugador_api_id')->nullable(); // ID del jugador en la API
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('participantes_partida');
    }
};
