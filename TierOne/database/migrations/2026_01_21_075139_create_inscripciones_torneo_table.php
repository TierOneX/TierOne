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
        Schema::create('inscripciones_torneo', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_torneo')->constrained('torneos')->onDelete('cascade');
            $table->foreignId('id_usuario')->constrained('users')->onDelete('cascade');
            $table->integer('id_equipo')->nullable();
            $table->decimal('pago_cuota', 10, 2)->default(0);
            $table->timestamp('fecha_inscripcion')->useCurrent();
            $table->enum('estado', ['pendiente', 'confirmada', 'rechazada'])->default('pendiente');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inscripciones_torneo');
    }
};
