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
        Schema::create('torneos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_juego')->constrained('juegos')->onDelete('cascade');
            $table->foreignId('id_organizador')->constrained('users')->onDelete('cascade');
            $table->string('nombre');
            $table->text('descripcion')->nullable();
            $table->string('imagen_banner')->nullable();
            $table->enum('formato', ['eliminacion_simple', 'doble_eliminacion', 'round_robin', 'swiss']);
            $table->integer('max_participantes');
            $table->decimal('cuota_inscripcion', 10, 2)->default(0);
            $table->decimal('premio_total', 10, 2)->default(0);
            $table->decimal('comision_plataforma_porcentaje', 5, 2)->default(0);
            $table->boolean('es_gratuito')->default(false);
            $table->timestamp('fecha_inicio')->nullable();
            $table->timestamp('fecha_fin')->nullable();
            $table->timestamp('cierre_inscripciones')->nullable();
            $table->enum('estado', ['inscripciones', 'en_curso', 'finalizado', 'cancelado'])->default('inscripciones');
            $table->string('reglas_url')->nullable();
            $table->string('stream_url')->nullable();
            $table->boolean('verificado')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('torneos');
    }
};
