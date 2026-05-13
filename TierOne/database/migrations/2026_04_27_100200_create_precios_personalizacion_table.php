<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('precios_personalizacion', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_producto')->nullable()->constrained('productos')->onDelete('cascade');
            $table->string('tipo_elemento'); // 'texto' | 'imagen'
            $table->decimal('precio', 10, 2)->default(0);
            $table->timestamps();

            $table->unique(['id_producto', 'tipo_elemento']);
        });

        // Insertar precios globales por defecto (editables desde admin)
        DB::table('precios_personalizacion')->insert([
            ['id_producto' => null, 'tipo_elemento' => 'texto', 'precio' => 2.00, 'created_at' => now(), 'updated_at' => now()],
            ['id_producto' => null, 'tipo_elemento' => 'imagen', 'precio' => 3.00, 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('precios_personalizacion');
    }
};
