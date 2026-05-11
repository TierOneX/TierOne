<?php

namespace App\Services;

use App\Models\Juego;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class GameService
{
    private const IGDB_BASE = 'https://api.igdb.com/v4';

    // Todos los campos que extraemos de IGDB
    private const IGDB_FIELDS = 'fields name, slug, summary, storyline, '
        . 'cover.image_id, screenshots.image_id, artworks.image_id, '
        . 'videos.video_id, videos.name, '
        . 'genres.name, themes.name, game_modes.name, platforms.name, '
        . 'involved_companies.company.name, involved_companies.developer, involved_companies.publisher, '
        . 'similar_games.name, similar_games.cover.image_id, similar_games.slug, '
        . 'aggregated_rating, aggregated_rating_count, rating, rating_count, '
        . 'first_release_date, websites.url, websites.category, '
        . 'franchises.name, collections.name;';

    public function __construct(
        protected TwitchAuthService $authService
    ) {}

    /**
     * Buscar un juego en IGDB por nombre.
     * Devuelve un array de resultados para que el admin elija.
     */
    public function searchIGDB(string $query, int $limit = 10): array
    {
        $body = self::IGDB_FIELDS . "\nsearch \"{$query}\"; limit {$limit};";

        $response = Http::withHeaders($this->authService->getHeaders())
            ->withBody($body, 'text/plain')
            ->post(self::IGDB_BASE . '/games');

        if ($response->failed()) {
            Log::error('IGDB search failed', ['query' => $query, 'body' => $response->body()]);
            return [];
        }

        return $response->json();
    }

    /**
     * Obtener un juego específico de IGDB por su igdb_id.
     */
    public function getFromIGDB(int $igdbId): ?array
    {
        $body = self::IGDB_FIELDS . "\nwhere id = {$igdbId};";

        $response = Http::withHeaders($this->authService->getHeaders())
            ->withBody($body, 'text/plain')
            ->post(self::IGDB_BASE . '/games');

        if ($response->failed() || empty($response->json())) {
            return null;
        }

        return $response->json()[0];
    }

    /**
     * Sincronizar un juego de TierOne con sus datos de IGDB.
     * Mapea la respuesta de IGDB a los campos de la tabla `juegos`.
     */
    public function syncJuego(Juego $juego, array $igdbData): Juego
    {
        $companies = collect($igdbData['involved_companies'] ?? []);

        $juego->update([
            'igdb_id'               => $igdbData['id'],
            'summary'               => $igdbData['summary'] ?? null,
            'storyline'             => $igdbData['storyline'] ?? null,
            'cover_image_id'        => $igdbData['cover']['image_id'] ?? null,
            'screenshot_ids'        => collect($igdbData['screenshots'] ?? [])
                                        ->pluck('image_id')->values()->toArray(),
            'artwork_ids'           => collect($igdbData['artworks'] ?? [])
                                        ->pluck('image_id')->values()->toArray(),
            'video_ids'             => collect($igdbData['videos'] ?? [])
                                        ->map(fn($v) => [
                                            'video_id' => $v['video_id'],
                                            'name' => $v['name'] ?? 'Trailer',
                                        ])->values()->toArray(),
            'genres'                => collect($igdbData['genres'] ?? [])
                                        ->pluck('name')->values()->toArray(),
            'themes'                => collect($igdbData['themes'] ?? [])
                                        ->pluck('name')->values()->toArray(),
            'game_modes'            => collect($igdbData['game_modes'] ?? [])
                                        ->pluck('name')->values()->toArray(),
            'platforms'             => collect($igdbData['platforms'] ?? [])
                                        ->pluck('name')->values()->toArray(),
            'developer'             => $companies->firstWhere('developer', true)['company']['name'] ?? null,
            'publisher'             => $companies->firstWhere('publisher', true)['company']['name'] ?? null,
            'critic_rating'         => $igdbData['aggregated_rating'] ?? null,
            'critic_rating_count'   => $igdbData['aggregated_rating_count'] ?? null,
            'community_rating'      => $igdbData['rating'] ?? null,
            'community_rating_count'=> $igdbData['rating_count'] ?? null,
            'fecha_lanzamiento'     => isset($igdbData['first_release_date'])
                                        ? Carbon::createFromTimestamp($igdbData['first_release_date'])->toDateString()
                                        : null,
            'similar_game_ids'      => collect($igdbData['similar_games'] ?? [])
                                        ->map(fn($g) => [
                                            'igdb_id' => $g['id'] ?? null,
                                            'name' => $g['name'],
                                            'cover_image_id' => $g['cover']['image_id'] ?? null,
                                            'slug' => $g['slug'] ?? null,
                                        ])->values()->toArray(),
            'websites'              => collect($igdbData['websites'] ?? [])
                                        ->map(fn($w) => [
                                            'category' => $w['category'],
                                            'url' => $w['url'],
                                        ])->values()->toArray(),
            'igdb_synced_at'        => now(),
        ]);

        // Si no tenía descripción propia, usar el summary de IGDB
        if (empty($juego->descripcion) && !empty($igdbData['summary'])) {
            $juego->update(['descripcion' => \Illuminate\Support\Str::limit($igdbData['summary'], 255)]);
        }

        return $juego->fresh();
    }
}
