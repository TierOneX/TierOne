<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('partidas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_juego')->constrained('juegos')->onDelete('cascade');
            $table->foreignId('id_creador')->constrained('users')->onDelete('cascade');
            $table->string('partida_api_id')->unique()->nullable()->comment('ID de la API del juego');
            $table->string('titulo');
            $table->enum('tipo', ['1v1', '2v2', '5v5', 'custom']);
            $table->decimal('buy_in', 10, 2)->default(0.00);
            $table->decimal('premio_total', 10, 2)->default(0.00);
            $table->decimal('comision_plataforma', 10, 2)->default(0.00);
            $table->dateTime('fecha_inicio')->nullable();
            $table->dateTime('fecha_fin')->nullable();
            $table->enum('estado', ['pendiente', 'en_proceso', 'completada', 'cancelada'])->default('pendiente');
            $table->enum('origen', ['api_automatica', 'manual'])->default('manual');
            $table->json('datos_api_json')->nullable()->comment('datos raw de la API');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('partidas');
    }
};
