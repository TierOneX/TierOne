<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('zonas_personalizacion', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_producto')->constrained('productos')->onDelete('cascade');
            $table->string('nombre');
            $table->string('slug');
            $table->string('imagen_base');
            $table->integer('area_x')->default(0);
            $table->integer('area_y')->default(0);
            $table->integer('area_width')->default(300);
            $table->integer('area_height')->default(350);
            $table->integer('canvas_width')->default(600);
            $table->integer('canvas_height')->default(700);
            $table->integer('orden')->default(0);
            $table->boolean('activa')->default(true);
            $table->timestamps();

            $table->unique(['id_producto', 'slug']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('zonas_personalizacion');
    }
};
