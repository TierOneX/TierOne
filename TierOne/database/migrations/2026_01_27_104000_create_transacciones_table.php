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
        Schema::create('transacciones', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_usuario')->constrained('users');
            $table->foreignId('id_orden')->nullable();
            $table->foreignId('id_partida')->nullable();
            $table->foreignId('id_torneo')->nullable()->constrained('torneos');
            $table->foreignId('id_retiro')->nullable();
            $table->enum('tipo', ['deposito', 'retiro', 'premio', 'compra', 'reembolso', 'comision']);
            $table->decimal('monto', 10, 2);
            $table->decimal('balance_anterior', 10, 2);
            $table->decimal('balance_nuevo', 10, 2);
            $table->string('descripcion');
            $table->dateTime('fecha_transaccion');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transacciones');
    }
};
