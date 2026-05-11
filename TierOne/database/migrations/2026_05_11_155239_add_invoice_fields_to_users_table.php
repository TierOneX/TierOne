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
        Schema::table('users', function (Blueprint $table) {
            $table->string('dni_cif', 20)->nullable()->after('apellido');
            $table->string('telefono', 20)->nullable()->after('dni_cif');
            $table->string('direccion')->nullable()->after('telefono');
            $table->string('codigo_postal', 10)->nullable()->after('direccion');
            $table->string('ciudad', 100)->nullable()->after('codigo_postal');
            $table->string('provincia', 100)->nullable()->after('ciudad');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['dni_cif', 'telefono', 'direccion', 'codigo_postal', 'ciudad', 'provincia']);
        });
    }
};
