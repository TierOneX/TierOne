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
        Schema::create('premios_torneo', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_torneo')->constrained('torneos')->onDelete('cascade');
            $table->foreignId('id_ganador')->nullable()->constrained('users')->onDelete('set null');
            $table->integer('posicion'); // 1, 2, 3, etc.
            $table->decimal('monto', 10, 2);
            $table->string('descripcion')->nullable();
            $table->boolean('entregado')->default(false);
            $table->timestamp('fecha_entrega')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('premios_torneo');
    }
};
