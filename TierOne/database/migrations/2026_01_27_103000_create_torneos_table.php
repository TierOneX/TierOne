<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Ejecuta las migraciones.
     * Crea la tabla 'torneos' en la base de datos.
     */
    public function up(): void
    {
        Schema::create('torneos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_juego'); 
            $table->foreignId('id_organizador')->constrained('users');
            $table->string('nombre');
            $table->string('descripcion');
            $table->string('imagen_banner');
            $table->enum('formato', ['eliminacion_simple', 'doble_eliminacion', 'round_robin', 'swiss']);
            $table->integer('max_participantes');
            $table->decimal('cuota_inscripcion', 10, 2)->comment('0 para torneos gratuitos');
            $table->decimal('premio_total', 10, 2);
            $table->decimal('comision_plataforma_porcentaje', 5, 2);
            $table->boolean('es_gratuito');
            $table->dateTime('fecha_inicio');
            $table->dateTime('fecha_fin');
            $table->dateTime('cierre_inscripciones');
            $table->enum('estado', ['inscripciones', 'en_curso', 'finalizado', 'cancelado']);
            $table->string('reglas_url');
            $table->string('stream_url');
            $table->boolean('verificado');
        
            // Timestamps opcionales
            // $table->timestamps();
        });
    }

    /**
     * Revierte las migraciones.
     * Elimina la tabla 'torneos'.
     */
    public function down(): void
    {
        Schema::dropIfExists('torneos');
    }
};
