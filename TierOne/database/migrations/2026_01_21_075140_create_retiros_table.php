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
        Schema::create('retiros', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_usuario')->constrained('users')->onDelete('cascade');
            $table->foreignId('id_procesado_por')->nullable()->constrained('users')->onDelete('set null');
            $table->decimal('monto', 10, 2);
            $table->enum('metodo', ['paypal', 'transferencia', 'cripto']);
            $table->string('detalles_cuenta');
            $table->enum('estado', ['pendiente', 'procesando', 'completado', 'rechazado'])->default('pendiente');
            $table->timestamp('fecha_solicitud')->useCurrent();
            $table->timestamp('fecha_procesado')->nullable();
            $table->text('notas_admin')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('retiros');
    }
};
