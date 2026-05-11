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
        Schema::table('juegos', function (Blueprint $table) {
            // --- Identificadores externos ---
            $table->unsignedBigInteger('igdb_id')->nullable()->unique()->after('id');
            $table->string('twitch_game_id')->nullable()->after('igdb_id');

            // --- Contenido textual ---
            $table->text('summary')->nullable()->after('descripcion');
            $table->text('storyline')->nullable()->after('summary');

            // --- Visuales (image_id de IGDB para construir URLs dinámicas) ---
            $table->string('cover_image_id')->nullable()->after('imagen_url');
            $table->json('screenshot_ids')->nullable()->after('cover_image_id');
            $table->json('artwork_ids')->nullable()->after('screenshot_ids');

            // --- Multimedia ---
            $table->json('video_ids')->nullable()->after('artwork_ids');

            // --- Clasificación ---
            $table->json('genres')->nullable()->after('categoria');
            $table->json('themes')->nullable();
            $table->json('game_modes')->nullable();
            $table->json('platforms')->nullable();

            // --- Empresas ---
            $table->string('developer')->nullable();
            $table->string('publisher')->nullable();

            // --- Métricas ---
            $table->decimal('critic_rating', 5, 2)->nullable();
            $table->unsignedInteger('critic_rating_count')->nullable();
            $table->decimal('community_rating', 5, 2)->nullable();
            $table->unsignedInteger('community_rating_count')->nullable();

            // --- Fechas y relaciones ---
            $table->date('fecha_lanzamiento')->nullable();
            $table->json('similar_game_ids')->nullable();

            // --- Webs oficiales ---
            $table->json('websites')->nullable();

            // --- Control de sincronización ---
            $table->timestamp('igdb_synced_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('juegos', function (Blueprint $table) {
            $table->dropColumn([
                'igdb_id',
                'twitch_game_id',
                'summary',
                'storyline',
                'cover_image_id',
                'screenshot_ids',
                'artwork_ids',
                'video_ids',
                'genres',
                'themes',
                'game_modes',
                'platforms',
                'developer',
                'publisher',
                'critic_rating',
                'critic_rating_count',
                'community_rating',
                'community_rating_count',
                'fecha_lanzamiento',
                'similar_game_ids',
                'websites',
                'igdb_synced_at',
            ]);
        });
    }
};
