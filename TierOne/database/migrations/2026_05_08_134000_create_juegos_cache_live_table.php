<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('juegos_cache_live', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_juego')->constrained('juegos')->onDelete('cascade');
            $table->unsignedInteger('viewer_count_total')->default(0);
            $table->unsignedInteger('stream_count')->default(0);
            $table->unsignedSmallInteger('ranking_global')->nullable();
            $table->json('top_streams')->nullable();
            // Formato: [{"user_name": "...", "title": "...", "viewer_count": 1234, "thumbnail_url": "..."}]
            $table->json('top_clips')->nullable();
            // Formato: [{"title": "...", "embed_url": "...", "view_count": 5678, "thumbnail_url": "..."}]
            $table->timestamp('updated_at')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('juegos_cache_live');
    }
};
