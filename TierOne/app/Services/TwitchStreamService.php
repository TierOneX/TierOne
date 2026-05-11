<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class TwitchStreamService
{
    private const HELIX_BASE = 'https://api.twitch.tv/helix';

    public function __construct(
        protected TwitchAuthService $authService
    ) {}

    /**
     * Obtener streams en vivo de un juego.
     * Caché: 90 segundos.
     */
    public function getLiveStreams(string $twitchGameId, int $limit = 8, ?string $language = null): array
    {
        $cacheKey = "twitch:streams:{$twitchGameId}:{$language}";

        return Cache::remember($cacheKey, 90, function () use ($twitchGameId, $limit, $language) {
            $params = [
                'game_id' => $twitchGameId,
                'first'   => $limit,
                'type'    => 'live',
            ];

            if ($language) {
                $params['language'] = $language;
            }

            $response = Http::withHeaders($this->authService->getHeaders())
                ->get(self::HELIX_BASE . '/streams', $params);

            if ($response->failed()) return [];

            return collect($response->json('data', []))->map(fn($s) => [
                'user_name'    => $s['user_name'],
                'user_login'   => $s['user_login'],
                'title'        => $s['title'],
                'viewer_count' => $s['viewer_count'],
                'thumbnail_url'=> str_replace(['{width}', '{height}'], ['440', '248'], $s['thumbnail_url']),
                'language'     => $s['language'],
                'started_at'   => $s['started_at'],
            ])->toArray();
        });
    }

    /**
     * Obtener clips populares de la semana de un juego.
     * Caché: 1 hora.
     */
    public function getTopClips(string $twitchGameId, int $limit = 6): array
    {
        $cacheKey = "twitch:clips:{$twitchGameId}";

        return Cache::remember($cacheKey, 3600, function () use ($twitchGameId, $limit) {
            $response = Http::withHeaders($this->authService->getHeaders())
                ->get(self::HELIX_BASE . '/clips', [
                    'game_id'    => $twitchGameId,
                    'first'      => $limit,
                    'started_at' => now()->subDays(7)->toIso8601String(),
                ]);

            if ($response->failed()) return [];

            return collect($response->json('data', []))->map(fn($c) => [
                'title'            => $c['title'],
                'url'              => $c['url'],
                'embed_url'        => $c['embed_url'],
                'broadcaster_name' => $c['broadcaster_name'],
                'creator_name'     => $c['creator_name'],
                'view_count'       => $c['view_count'],
                'thumbnail_url'    => $c['thumbnail_url'],
                'duration'         => $c['duration'],
            ])->toArray();
        });
    }

    /**
     * Obtener el twitch_game_id a partir del nombre del juego.
     * Se usa una sola vez al sincronizar un juego con Twitch.
     */
    public function findGameId(string $gameName): ?string
    {
        $response = Http::withHeaders($this->authService->getHeaders())
            ->get(self::HELIX_BASE . '/games', [
                'name' => $gameName,
            ]);

        if ($response->failed() || empty($response->json('data'))) {
            return null;
        }

        return $response->json('data.0.id');
    }

    /**
     * Obtener el top de juegos en Twitch ahora mismo.
     * Caché: 5 minutos.
     */
    public function getTopGames(int $limit = 20): array
    {
        return Cache::remember('twitch:top_games', 300, function () use ($limit) {
            $response = Http::withHeaders($this->authService->getHeaders())
                ->get(self::HELIX_BASE . '/games/top', [
                    'first' => $limit,
                ]);

            if ($response->failed()) return [];

            return collect($response->json('data', []))->map(fn($g, $i) => [
                'twitch_game_id' => $g['id'],
                'name'           => $g['name'],
                'box_art_url'    => str_replace(['{width}', '{height}'], ['285', '380'], $g['box_art_url']),
                'igdb_id'        => $g['igdb_id'] ?? null,
                'ranking'        => $i + 1,
            ])->toArray();
        });
    }
}
