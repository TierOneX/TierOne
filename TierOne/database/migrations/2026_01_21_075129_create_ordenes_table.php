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
        Schema::create('ordenes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_usuario')->constrained('users')->onDelete('cascade');
            $table->foreignId('id_direccion_envio')->nullable()->constrained('direcciones_envio')->onDelete('set null');
            $table->string('numero_orden')->unique();
            $table->decimal('subtotal', 10, 2);
            $table->decimal('impuestos', 10, 2)->default(0);
            $table->decimal('costo_envio', 10, 2)->default(0);
            $table->decimal('descuento', 10, 2)->default(0);
            $table->decimal('total', 10, 2);
            $table->enum('estado', ['pendiente', 'pagada', 'enviada_proveedor', 'en_transito', 'entregada', 'cancelada'])->default('pendiente');
            $table->timestamp('fecha_orden')->useCurrent();
            $table->timestamp('fecha_enviada_proveedor')->nullable();
            $table->string('tracking_number')->nullable();
            $table->string('transportista')->nullable();
            $table->foreignId('id_cancelado_por')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('fecha_cancelacion')->nullable();
            $table->text('razon_cancelacion')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ordenes');
    }
};
