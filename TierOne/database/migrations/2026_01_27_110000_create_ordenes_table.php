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
            $table->foreignId('id_usuario')->constrained('users');
            // 'direcciones' table does not exist yet, so we just define the column.
            // When 'direcciones' is created, we can add the constraint in a later migration.
            $table->unsignedBigInteger('id_direccion_envio'); 
            $table->string('numero_orden')->unique();
            $table->decimal('subtotal', 10, 2);
            $table->decimal('impuestos', 10, 2);
            $table->decimal('costo_envio', 10, 2);
            $table->decimal('descuento', 10, 2);
            $table->decimal('total', 10, 2);
            $table->enum('estado', ['pendiente', 'pagada', 'enviada_proveedor', 'en_transito', 'entregada', 'cancelada']);
            $table->dateTime('fecha_orden');
            $table->dateTime('fecha_enviada_proveedor')->nullable();
            $table->dateTime('fecha_actualizacion')->nullable();
            $table->string('tracking_number')->nullable()->comment('del proveedor');
            $table->string('transportista')->nullable()->comment('del proveedor');
            $table->foreignId('id_cancelado_por')->nullable()->constrained('users')->comment('Admin o Usuario');
            $table->dateTime('fecha_cancelacion')->nullable();
            $table->string('razon_cancelacion')->nullable();
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
