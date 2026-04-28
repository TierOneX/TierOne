<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('zonas_personalizacion', function (Blueprint $table) {
            $table->string('tipo')->default('impresion')->after('slug');
        });
    }

    public function down(): void
    {
        Schema::table('zonas_personalizacion', function (Blueprint $table) {
            $table->dropColumn('tipo');
        });
    }
};
