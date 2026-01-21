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
            $table->foreignId('id_orden')->constrained('ordenes')->onDelete('cascade');
            $table->foreignId('id_proveedor')->constrained('proveedores')->onDelete('cascade');
            $table->enum('tipo', ['pedido', 'seguimiento', 'entrega', 'incidencia']);
            $table->string('asunto');
            $table->text('contenido_email');
            $table->string('email_from');
            $table->string('email_to');
            $table->timestamp('fecha_envio')->useCurrent();
            $table->timestamp('fecha_respuesta')->nullable();
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
