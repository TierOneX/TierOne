<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Throwable;

class GameImageService
{
    private const DEFAULT_MATCH_IMAGE = '/images/landing/Partidas.jpg';
    private const TWITCH_HELIX_BASE = 'https://api.twitch.tv/helix';

    public function __construct(
        private readonly TwitchAuthService $twitchAuthService
    ) {
    }

    public function resolveMatchImageUrl(string $gameName, ?string $storedImageUrl = null, ?string $gameSlug = null): string
    {
        $twitchImage = $this->getTwitchGameImage($gameName);

        if ($twitchImage) {
            return $twitchImage;
        }

        return $this->resolveMatchLocalImageUrl($storedImageUrl, $gameSlug);
    }

    public function resolveMatchLocalImageUrl(?string $storedImageUrl = null, ?string $gameSlug = null): string
    {
        $fallbackCandidates = array_filter([
            $this->normalizePublicPath($storedImageUrl),
            $gameSlug ? '/images/juegos/portada_' . Str::slug($gameSlug, '_') . '.png' : null,
        ]);

        foreach ($fallbackCandidates as $candidate) {
            if ($this->publicImageExists($candidate)) {
                return $candidate;
            }
        }

        return self::DEFAULT_MATCH_IMAGE;
    }

    private function getTwitchGameImage(string $gameName): ?string
    {
        $clientId = config('services.twitch.client_id');

        if (! $clientId || trim($gameName) === '') {
            return null;
        }

        $cacheKey = 'twitch.game.image.' . md5(Str::lower(trim($gameName)));
        $cachedImage = Cache::get($cacheKey);
        if (is_string($cachedImage) && $cachedImage !== '') {
            return $cachedImage;
        }

        $token = $this->twitchAuthService->getAccessToken();

        if (in_array($token, ['MISSING_TWITCH_CREDENTIALS', 'TWITCH_AUTH_ERROR'], true)) {
            return null;
        }

        try {
            $client = Http::withHeaders($this->twitchAuthService->getHeaders())
                ->withOptions([
                    'verify' => config('services.twitch.verify_ssl', true),
                ])
                ->timeout(8)
                ->acceptJson();

            $response = $client->get(self::TWITCH_HELIX_BASE . '/games', [
                'name' => $gameName,
            ]);

            $boxArt = data_get($response->json(), 'data.0.box_art_url');
            $imageUrl = $this->normalizeTwitchImageUrl($boxArt);

            if (! $imageUrl) {
                $searchResponse = $client->get(self::TWITCH_HELIX_BASE . '/search/categories', [
                    'query' => $gameName,
                    'first' => 5,
                ]);

                if ($searchResponse->ok()) {
                    $items = collect($searchResponse->json('data', []));
                    $query = Str::lower(trim($gameName));

                    $best = $items->first(function (array $item) use ($query) {
                        $name = Str::lower((string) data_get($item, 'name', ''));
                        return $name === $query
                            || Str::contains($name, $query)
                            || Str::contains($query, $name);
                    }) ?? $items->first();

                    $imageUrl = $this->normalizeTwitchImageUrl(data_get($best, 'box_art_url'));
                }
            }

            if (! $imageUrl) {
                return null;
            }

            Cache::put($cacheKey, $imageUrl, now()->addHours(24));
            return $imageUrl;
        } catch (Throwable) {
            return null;
        }
    }

    private function normalizeTwitchImageUrl(?string $imageUrl): ?string
    {
        if (! is_string($imageUrl) || $imageUrl === '') {
            return null;
        }

        return str_replace(
            ['{width}x{height}', '{width}', '{height}'],
            ['600x800', '600', '800'],
            $imageUrl
        );
    }

    private function normalizePublicPath(?string $path): ?string
    {
        if (! $path || trim($path) === '') {
            return null;
        }

        if (Str::startsWith($path, ['http://', 'https://'])) {
            return null;
        }

        return '/' . ltrim($path, '/');
    }

    private function publicImageExists(string $publicPath): bool
    {
        $absolutePath = public_path(ltrim($publicPath, '/'));

        return is_file($absolutePath);
    }
}
