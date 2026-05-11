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
    ) {}

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

        // Enriquecer topGames con slugs locales para enlazar a las fichas
        $igdbIds = collect($topGames)->pluck('igdb_id')->filter()->toArray();
        $localGames = Juego::whereIn('igdb_id', $igdbIds)->get(['igdb_id', 'slug']);
        
        $topGames = collect($topGames)->map(function($game) use ($localGames) {
            $local = $localGames->firstWhere('igdb_id', $game['igdb_id']);
            $game['slug'] = $local ? $local->slug : null;
            return $game;
        })->toArray();

        return Inertia::render('Community/Index', [
            'juegos'   => $juegos,
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
            $liveStreams = $this->twitchStreamService->getLiveStreams($juego->twitch_game_id);
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
            'juego'       => $juego,
            'liveStreams'  => $liveStreams,
            'topClips'    => $topClips,
            'torneos'     => $torneos,
        ]);
    }
}
