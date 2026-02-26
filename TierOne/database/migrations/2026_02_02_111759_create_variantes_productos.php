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
        Schema::create('variantes_productos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_producto')->constrained('productos')->onDelete('cascade');
            $table->string('nombre');
            $table->string('sku')->nullable();
            $table->decimal('precio', 10, 2)->default(0);
            $table->boolean('disponible')->default(true);
            $table->dateTime('ultima_verificacion_stock')->nullable();
            $table->timestamps();
        });

        // Add FKs for items_carrito here since now both products and variants exist
        Schema::table('items_carrito', function (Blueprint $table) {
            $table->foreign('id_producto')->references('id')->on('productos')->onDelete('cascade');
            $table->foreign('id_variante')->references('id')->on('variantes_productos')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Drop FKs from items_carrito first
        Schema::table('items_carrito', function (Blueprint $table) {
            $table->dropForeign(['id_producto']);
            $table->dropForeign(['id_variante']);
        });

        Schema::dropIfExists('variantes_productos');
    }
};
