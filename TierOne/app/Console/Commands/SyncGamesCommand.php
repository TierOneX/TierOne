<?php

namespace App\Console\Commands;

use App\Models\Juego;
use App\Services\GameService;
use App\Services\TwitchStreamService;
use Illuminate\Console\Command;

class SyncGamesCommand extends Command
{
    protected $signature = 'games:sync {--slug= : Sincronizar un juego específico} {--all : Sincronizar todos}';
    protected $description = 'Sincroniza juegos de TierOne con datos de IGDB y Twitch';

    public function handle(GameService $gameService, TwitchStreamService $twitchService): int
    {
        if ($slug = $this->option('slug')) {
            $juego = Juego::where('slug', $slug)->first();
            if (!$juego) {
                $this->error("Juego con slug '{$slug}' no encontrado.");
                return 1;
            }
            $this->syncOne($juego, $gameService, $twitchService);
        } elseif ($this->option('all')) {
            Juego::where('activo', true)->each(fn($j) => $this->syncOne($j, $gameService, $twitchService));
        } else {
            $this->info('Usa --slug=nombre o --all');
        }

        return 0;
    }

    private function syncOne(Juego $juego, GameService $gameService, TwitchStreamService $twitchService): void
    {
        $this->info("Sincronizando: {$juego->nombre}...");

        // 1. Buscar en IGDB por nombre
        $results = $gameService->searchIGDB($juego->nombre, 1);
        if (empty($results)) {
            $this->warn("  → No encontrado en IGDB.");
            return;
        }

        // 2. Obtener datos completos
        $igdbData = $gameService->getFromIGDB($results[0]['id']);
        if (!$igdbData) {
            $this->warn("  → Error al obtener datos completos.");
            return;
        }

        // 3. Sincronizar con la BD
        $gameService->syncJuego($juego, $igdbData);
        $this->info("  → IGDB sincronizado (ID: {$igdbData['id']})");

        // 4. Obtener twitch_game_id
        if (!$juego->twitch_game_id) {
            $twitchId = $twitchService->findGameId($juego->nombre);
            if ($twitchId) {
                $juego->update(['twitch_game_id' => $twitchId]);
                $this->info("  → Twitch Game ID: {$twitchId}");
            }
        }
    }
}
