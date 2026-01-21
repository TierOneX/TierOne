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
        Schema::create('reportes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_partida')->constrained('partidas')->onDelete('cascade');
            $table->foreignId('id_usuario_reporta')->constrained('users')->onDelete('cascade');
            $table->foreignId('id_resuelto_por')->nullable()->constrained('users')->onDelete('set null');
            $table->enum('tipo', ['trampa', 'comportamiento', 'resultado_erroneo', 'otro']);
            $table->text('descripcion');
            $table->string('evidencia_url')->nullable();
            $table->enum('estado', ['pendiente', 'en_revision', 'resuelta', 'desestimada'])->default('pendiente');
            $table->text('resolucion')->nullable();
            $table->timestamp('fecha_reporte')->useCurrent();
            $table->timestamp('fecha_resolucion')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reportes');
    }
};
