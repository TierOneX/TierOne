<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Juego;
use App\Services\GameService;
use App\Services\TwitchStreamService;
use Inertia\Inertia;

class GameCommunityController extends Controller
{
    public function __construct(
        protected GameService $gameService,
        protected TwitchStreamService $twitchStreamService
    ) {
    }

    /**
     * Página principal de comunidad: listado de juegos enriquecidos.
     */
    public function index()
    {
        $juegos = Juego::where('activo', true)
            ->whereNotNull('igdb_id')
            ->orderByDesc('community_rating')
            ->get();

        $topGames = $this->twitchStreamService->getTopGames(10);

        $topGames = $this->twitchStreamService->getTopGames(10);

        // Enriquecer topGames con slugs locales para enlazar a las fichas
        $igdbIds = collect($topGames)->pluck('igdb_id')->filter()->toArray();
        $names = collect($topGames)->pluck('name')->toArray();

        $localGames = Juego::whereIn('igdb_id', $igdbIds)
            ->orWhereIn('nombre', $names)
            ->get(['igdb_id', 'slug', 'nombre']);

        $topGames = collect($topGames)->map(function ($game) use ($localGames) {
            // Intentar por IGDB ID primero
            $local = $localGames->firstWhere('igdb_id', $game['igdb_id']);

            // Fallback por nombre si no hay match por ID
            if (!$local) {
                $local = $localGames->firstWhere('nombre', $game['name']);
            }

            $game['slug'] = $local ? $local->slug : null;
            return $game;
        })->toArray();

        return Inertia::render('Community/Index', [
            'juegos' => $juegos,
            'topGames' => $topGames,
        ]);
    }

    /**
     * Ficha individual de juego con toda la información.
     */
    public function show(string $slug)
    {
        $juego = Juego::where('slug', $slug)
            ->where('activo', true)
            ->firstOrFail();

        $liveStreams = [];
        $topClips = [];

        if ($juego->twitch_game_id) {
            // Priorizamos streams en español para la zona del usuario
            $liveStreams = $this->twitchStreamService->getLiveStreams($juego->twitch_game_id, 8, 'es');
            
            // Si no hay suficientes en español, podríamos traer globales, pero el usuario pidió por zonas.
            // Para cumplir "la primera del país", traemos 'es'.
            
            $topClips = $this->twitchStreamService->getTopClips($juego->twitch_game_id);
        }

        // Relación con torneos (asumiendo que existe el método torneos() en Juego)
        // Si no existe, fallará, pero el plan asume que sí (Resumen Ejecutivo dice Torneos Parcial)
        $torneos = $juego->relationLoaded('torneos') || method_exists($juego, 'torneos')
            ? $juego->torneos()
                ->whereIn('estado', ['inscripciones', 'en_curso', 'proximamente'])
                ->withCount('inscripciones')
                ->orderBy('fecha_inicio')
                ->take(4)
                ->get()
            : [];

        return Inertia::render('Community/GameProfile', [
            'juego' => $juego,
            'liveStreams' => $liveStreams,
            'topClips' => $topClips,
            'torneos' => $torneos,
        ]);
    }
}
