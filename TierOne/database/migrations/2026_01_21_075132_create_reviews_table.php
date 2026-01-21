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
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_producto')->constrained('productos')->onDelete('cascade');
            $table->foreignId('id_usuario')->constrained('users')->onDelete('cascade');
            $table->integer('calificacion'); // 1-5
            $table->text('comentario')->nullable();
            $table->timestamp('fecha_review')->useCurrent();
            $table->boolean('verificado_compra')->default(false);
            $table->boolean('aprobado')->default(false);
            $table->boolean('reportado')->default(false);
            $table->foreignId('id_moderado_por')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('fecha_moderacion')->nullable();
            $table->text('razon_rechazo')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
