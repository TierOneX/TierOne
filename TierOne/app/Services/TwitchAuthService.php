<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Throwable;

class TwitchAuthService
{
    /**
     * Returns a valid app access token from cache or Twitch OAuth.
     */
    public function getAccessToken(): string
    {
        $token = Cache::get('twitch:access_token');

        if ($token && ! in_array($token, ['MISSING_TWITCH_CREDENTIALS', 'TWITCH_AUTH_ERROR'], true)) {
            return $token;
        }

        $clientId = config('services.twitch.client_id');
        $clientSecret = config('services.twitch.client_secret');

        if (empty($clientId) || empty($clientSecret)) {
            return 'MISSING_TWITCH_CREDENTIALS';
        }

        try {
            $response = Http::asForm()
                ->withOptions([
                    'verify' => config('services.twitch.verify_ssl', true),
                ])
                ->timeout(8)
                ->post('https://id.twitch.tv/oauth2/token', [
                    'client_id' => $clientId,
                    'client_secret' => $clientSecret,
                    'grant_type' => 'client_credentials',
                ]);
        } catch (Throwable $e) {
            Log::error('Twitch OAuth connection failed', [
                'message' => $e->getMessage(),
            ]);
            Cache::put('twitch:access_token', 'TWITCH_AUTH_ERROR', now()->addMinutes(5));
            return 'TWITCH_AUTH_ERROR';
        }

        if ($response->failed()) {
            Log::error('Twitch OAuth failed', ['body' => $response->body()]);
            Cache::put('twitch:access_token', 'TWITCH_AUTH_ERROR', now()->addMinutes(5));
            return 'TWITCH_AUTH_ERROR';
        }

        $token = (string) $response->json('access_token', '');
        if ($token === '') {
            Cache::put('twitch:access_token', 'TWITCH_AUTH_ERROR', now()->addMinutes(5));
            return 'TWITCH_AUTH_ERROR';
        }

        Cache::put('twitch:access_token', $token, now()->addDays(55));

        return $token;
    }

    /**
     * Shared headers for Twitch API calls.
     */
    public function getHeaders(): array
    {
        return [
            'Client-ID' => config('services.twitch.client_id'),
            'Authorization' => 'Bearer ' . $this->getAccessToken(),
        ];
    }

    public function refreshToken(): string
    {
        Cache::forget('twitch:access_token');

        return $this->getAccessToken();
    }
}
