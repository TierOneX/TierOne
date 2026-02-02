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
            $table->unsignedBigInteger('id_usuario');
            $table->string('nombre_completo');
            $table->string('direccion_linea1');
            $table->string('ciudad');
            $table->string('estado_provincia')->nullable();
            $table->string('codigo_postal'); // String para permitir guiones y formatos internacionales
            $table->string('pais');
            $table->string('telefono'); // String para permitir prefijos (+34) y guiones
            $table->boolean('predeterminada')->default(true);
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
