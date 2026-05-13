<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('productos', function (Blueprint $table) {
            $table->boolean('personalizable')->default(false)->after('activo');
        });

        Schema::table('items_carrito', function (Blueprint $table) {
            $table->json('personalizacion_data')->nullable()->after('subtotal');
        });

        Schema::table('items_orden', function (Blueprint $table) {
            $table->json('personalizacion_data')->nullable()->after('subtotal');
            $table->string('personalizacion_imagen')->nullable()->after('personalizacion_data');
        });
    }

    public function down(): void
    {
        Schema::table('productos', function (Blueprint $table) {
            $table->dropColumn('personalizable');
        });
        Schema::table('items_carrito', function (Blueprint $table) {
            $table->dropColumn('personalizacion_data');
        });
        Schema::table('items_orden', function (Blueprint $table) {
            $table->dropColumn(['personalizacion_data', 'personalizacion_imagen']);
        });
    }
};
