<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('carritos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_usuario')->constrained('users')->onDelete('cascade');
            $table->decimal('subtotal', 10, 2)->default(0.00);
            $table->dateTime('fecha_creacion')->nullable();
            $table->dateTime('fecha_actualizacion')->nullable();
            $table->timestamps();
        });

        Schema::create('items_carrito', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_carrito')->constrained('carritos')->onDelete('cascade');
            // 'productos' y 'variantes' no existen aún, definimos solo la columna
            $table->unsignedBigInteger('id_producto');
            $table->unsignedBigInteger('id_variante')->nullable();
            $table->integer('cantidad')->default(1);
            $table->decimal('precio_unitario', 10, 2);
            $table->decimal('subtotal', 10, 2);
            $table->dateTime('fecha_agregado')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('items_carrito');
        Schema::dropIfExists('carritos');
    }
};
