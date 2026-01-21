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
        Schema::create('direcciones_envio', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_usuario')->constrained('users')->onDelete('cascade');
            $table->string('nombre_completo');
            $table->string('direccion_linea1');
            $table->string('ciudad');
            $table->string('estado_provincia')->nullable();
            $table->string('codigo_postal');
            $table->string('pais');
            $table->string('telefono');
            $table->boolean('predeterminada')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('direcciones_envio');
    }
};
