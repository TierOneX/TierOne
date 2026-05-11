<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class TranslationService
{
    /**
     * Traduce un texto de Inglés a Español usando un endpoint público de Google Translate.
     * Nota: Para producción real, se recomendaría usar Google Cloud Translation API o DeepL.
     */
    public function translate(string $text): string
    {
        if (empty($text)) return '';

        try {
            $response = Http::get('https://translate.googleapis.com/translate_a/single', [
                'client' => 'gtx',
                'sl'     => 'en',
                'tl'     => 'es',
                'dt'     => 't',
                'q'      => $text,
            ]);

            if ($response->successful()) {
                $result = $response->json();
                // Google devuelve un array anidado con las partes traducidas
                if (isset($result[0])) {
                    return collect($result[0])->pluck(0)->implode('');
                }
            }
        } catch (\Exception $e) {
            Log::warning('Error en traducción automática: ' . $e->getMessage());
        }

        return $text; // Si falla, devolvemos el original
    }
}
