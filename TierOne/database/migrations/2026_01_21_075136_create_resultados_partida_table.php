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
        Schema::create('resultados_partida', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_partida')->unique()->constrained('partidas')->onDelete('cascade');
            $table->foreignId('id_verificado_por')->nullable()->constrained('users')->onDelete('set null');
            $table->enum('ganador', ['team_a', 'team_b', 'empate'])->nullable();
            $table->json('detalles_json')->nullable();
            $table->timestamp('fecha_sincronizacion_api')->nullable();
            $table->boolean('verificado_automaticamente')->default(false);
            $table->boolean('disputado')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('resultados_partida');
    }
};
