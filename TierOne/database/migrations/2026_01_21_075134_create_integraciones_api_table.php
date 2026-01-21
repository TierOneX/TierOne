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
        Schema::create('integraciones_api', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_juego')->unique()->constrained('juegos')->onDelete('cascade');
            $table->string('proveedor'); // Riot, Steam, Epic, etc.
            $table->string('api_endpoint');
            $table->string('api_key_encrypted');
            $table->boolean('sincronizacion_activa')->default(false);
            $table->integer('intervalo_sincronizacion')->default(300); // segundos
            $table->timestamp('ultima_sincronizacion')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('integraciones_api');
    }
};
