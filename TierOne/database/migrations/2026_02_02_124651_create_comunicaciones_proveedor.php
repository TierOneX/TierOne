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
        Schema::create('comunicaciones_proveedor', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_orden');
            $table->unsignedBigInteger('id_proveedor');
            $table->enum('tipo', ['pedido', 'seguimiento', 'entrega', 'incidencia']);
            $table->string('asunto');
            $table->text('contenido_email');
            $table->string('email_from');
            $table->string('email_to');
            // fecha_envio se gestiona con created_at
            $table->dateTime('fecha_respuesta')->nullable();
            $table->text('respuesta_contenido')->nullable();
            $table->boolean('leido')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('comunicaciones_proveedor');
    }
};
