<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class TwitchAuthService
{
    /**
     * Obtener un token válido (de caché o generando uno nuevo).
     * TTL: 55 días (el token dura 60, renovamos con margen).
     */
    public function getAccessToken(): string
    {
        return Cache::remember('twitch:access_token', now()->addDays(55), function () {
            $clientId = config('services.twitch.client_id');
            $clientSecret = config('services.twitch.client_secret');

            if (empty($clientId) || empty($clientSecret)) {
                // Si no hay credenciales, devolvemos un string vacío o lanzamos excepción
                // Para desarrollo, podrías devolver un mock si fuera necesario
                return 'MISSING_TWITCH_CREDENTIALS';
            }

            $response = Http::asForm()->post('https://id.twitch.tv/oauth2/token', [
                'client_id'     => $clientId,
                'client_secret' => $clientSecret,
                'grant_type'    => 'client_credentials',
            ]);

            if ($response->failed()) {
                // En lugar de lanzar excepción que rompa la app, logueamos y devolvemos error
                \Illuminate\Support\Facades\Log::error('Twitch OAuth failed: ' . $response->body());
                return 'TWITCH_AUTH_ERROR';
            }

            return $response->json('access_token');
        });
    }

    /**
     * Headers comunes para todas las llamadas a IGDB y Twitch Helix.
     */
    public function getHeaders(): array
    {
        return [
            'Client-ID'    => config('services.twitch.client_id'),
            'Authorization' => 'Bearer ' . $this->getAccessToken(),
        ];
    }

    /**
     * Forzar renovación del token (si caduca antes de tiempo).
     */
    public function refreshToken(): string
    {
        Cache::forget('twitch:access_token');
        return $this->getAccessToken();
    }
}
