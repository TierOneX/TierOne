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
        Schema::create('partidas_torneo', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_torneo')->constrained('torneos')->onDelete('cascade');
            $table->foreignId('id_partida')->constrained('partidas')->onDelete('cascade');
            $table->foreignId('id_siguiente_partida')->nullable()->constrained('partidas_torneo')->onDelete('set null');
            $table->integer('ronda');
            $table->integer('bracket_posicion');
            $table->enum('tipo_bracket', ['winners', 'losers', 'final']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('partidas_torneo');
    }
};
