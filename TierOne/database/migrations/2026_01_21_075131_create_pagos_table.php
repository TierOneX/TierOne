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
        Schema::create('pagos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_orden')->unique()->constrained('ordenes')->onDelete('cascade');
            $table->decimal('monto', 10, 2);
            $table->enum('metodo', ['tarjeta', 'paypal', 'transferencia', 'balance']);
            $table->string('transaction_id')->unique();
            $table->enum('estado', ['pendiente', 'completado', 'fallido', 'reembolsado'])->default('pendiente');
            $table->timestamp('fecha_pago')->useCurrent();
            $table->json('detalles_json')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pagos');
    }
};
