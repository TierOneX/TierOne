<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Permite que id_direccion_envio sea NULL para órdenes digitales
     * (torneos, Hydra Coins, partidas) que no requieren dirección de envío.
     */
    public function up(): void
    {
        Schema::table('ordenes', function (Blueprint $table) {
            $table->dropForeign(['id_direccion_envio']);
        });

        Schema::table('ordenes', function (Blueprint $table) {
            $table->unsignedBigInteger('id_direccion_envio')->nullable()->change();
            $table->foreign('id_direccion_envio')->references('id')->on('direcciones_envio')->onDelete('restrict');
        });
    }

    public function down(): void
    {
        Schema::table('ordenes', function (Blueprint $table) {
            $table->dropForeign(['id_direccion_envio']);
        });

        Schema::table('ordenes', function (Blueprint $table) {
            $table->unsignedBigInteger('id_direccion_envio')->nullable(false)->change();
            $table->foreign('id_direccion_envio')->references('id')->on('direcciones_envio')->onDelete('restrict');
        });
    }
};
