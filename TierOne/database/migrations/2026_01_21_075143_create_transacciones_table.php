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
            $table->foreignId('id_usuario')->constrained('users')->onDelete('cascade');
            $table->foreignId('id_orden')->nullable()->constrained('ordenes')->onDelete('set null');
            $table->foreignId('id_partida')->nullable()->constrained('partidas')->onDelete('set null');
            $table->foreignId('id_torneo')->nullable()->constrained('torneos')->onDelete('set null');
            $table->foreignId('id_retiro')->nullable()->constrained('retiros')->onDelete('set null');
            $table->enum('tipo', ['deposito', 'retiro', 'premio', 'compra', 'reembolso', 'comision']);
            $table->decimal('monto', 10, 2);
            $table->decimal('balance_anterior', 10, 2);
            $table->decimal('balance_nuevo', 10, 2);
            $table->text('descripcion')->nullable();
            $table->timestamp('fecha_transaccion')->useCurrent();
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
