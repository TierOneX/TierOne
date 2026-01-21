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
        Schema::create('sponsors_torneo', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_torneo')->constrained('torneos')->onDelete('cascade');
            $table->string('nombre_sponsor');
            $table->string('logo_url')->nullable();
            $table->decimal('aportacion', 10, 2)->default(0);
            $table->string('enlace_web')->nullable();
            $table->enum('nivel', ['oro', 'plata', 'bronce'])->default('bronce');
            $table->boolean('activo')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sponsors_torneo');
    }
};
