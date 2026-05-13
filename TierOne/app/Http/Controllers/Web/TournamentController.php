<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\InscripcionTorneo;
use App\Models\Juego;
use App\Models\Torneo;
use App\Services\GameImageService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TournamentController extends Controller
{
    public function __construct(private readonly GameImageService $gameImageService)
    {
    }

    public function index(): Response
    {
        $juegos = Juego::query()
            ->where('activo', true)
            ->withCount([
                'torneos as total_torneos' => fn ($query) => $query,
                'torneos as torneos_abiertos' => fn ($query) => $query->whereIn('estado', ['inscripciones', 'en_curso']),
            ])
            ->with([
                'torneos' => function ($query) {
                    $query->withCount(['inscripciones' => function ($q) {
                        $q->where('estado', 'confirmada');
                    }])
                        ->with(['inscripciones' => function ($q) {
                            $q->where('estado', 'confirmada')->with('usuario:id,username,nombre');
                        }])
                        ->orderByRaw("case when estado = 'inscripciones' then 0 when estado = 'en_curso' then 1 else 2 end")
                        ->orderBy('fecha_inicio')
                        ->orderByDesc('id');
                },
            ])
            ->get()
            ->map(function (Juego $juego) {
                $torneos = $juego->torneos->map(function (Torneo $torneo) {
                    $inscripcionesCount = $torneo->inscripciones_count ?? $torneo->inscripciones->count();
                    $maxParticipantes = (int) $torneo->max_participantes;

                    return [
                        'id' => $torneo->id,
                        'nombre' => $torneo->nombre,
                        'descripcion' => $torneo->descripcion,
                        'formato' => $torneo->formato,
                        'cuota_inscripcion' => (float) $torneo->cuota_inscripcion,
                        'premio_total' => (float) $torneo->premio_total,
                        'fecha_inicio' => $torneo->fecha_inicio?->toIso8601String(),
                        'fecha_fin' => $torneo->fecha_fin?->toIso8601String(),
                        'estado' => $torneo->estado,
                        'max_participantes' => $maxParticipantes,
                        'inscripciones_count' => $inscripcionesCount,
                        'plazas_disponibles' => max($maxParticipantes - $inscripcionesCount, 0),
                        'inscripciones' => $torneo->inscripciones->map(fn (InscripcionTorneo $inscripcion) => [
                            'id' => $inscripcion->id,
                            'id_usuario' => $inscripcion->id_usuario,
                            'username' => $inscripcion->usuario?->username,
                            'nombre' => $inscripcion->usuario?->nombre,
                            'estado' => $inscripcion->estado,
                        ])->values(),
                    ];
                })->values();

                return [
                    'id' => $juego->id,
                    'nombre' => $juego->nombre,
                    'slug' => $juego->slug,
                    'descripcion' => $juego->descripcion,
                    'imagen_url' => $this->gameImageService->resolveTournamentImageUrl(
                        gameName: $juego->nombre,
                        storedImageUrl: $juego->imagen_url,
                        gameSlug: $juego->slug
                    ),
                    'imagen_url_local' => $this->gameImageService->resolveTournamentLocalImageUrl(
                        storedImageUrl: $juego->imagen_url,
                        gameSlug: $juego->slug
                    ),
                    'categoria' => $juego->categoria,
                    'total_torneos' => (int) $juego->total_torneos,
                    'torneos_abiertos' => (int) $juego->torneos_abiertos,
                    'popularidad' => (int) $juego->torneos_abiertos * 3 + (int) $juego->total_torneos,
                    'torneos' => $torneos,
                ];
            })
            ->sortByDesc('popularidad')
            ->values();

        $categorias = $juegos
            ->pluck('categoria')
            ->filter()
            ->unique()
            ->sort()
            ->values();

        $myTournaments = collect();

        if (request()->user()) {
            $myTournaments = InscripcionTorneo::query()
                ->where('id_usuario', request()->user()->id)
                ->with([
                    'torneo' => function ($query) {
                        $query
                            ->with('juego')
                            ->withCount(['inscripciones' => function ($q) {
                                $q->where('estado', 'confirmada');
                            }]);
                    },
                ])
                ->orderByDesc('fecha_inscripcion')
                ->get()
                ->filter(fn (InscripcionTorneo $inscripcion) => $inscripcion->torneo !== null)
                ->map(function (InscripcionTorneo $inscripcion) {
                    $torneo = $inscripcion->torneo;
                    $juego = $torneo->juego;

                    return [
                        'id' => $torneo->id,
                        'nombre' => $torneo->nombre,
                        'formato' => $torneo->formato,
                        'estado' => $torneo->estado,
                        'cuota_inscripcion' => (float) $torneo->cuota_inscripcion,
                        'premio_total' => (float) $torneo->premio_total,
                        'fecha_inicio' => $torneo->fecha_inicio?->toIso8601String(),
                        'fecha_fin' => $torneo->fecha_fin?->toIso8601String(),
                        'max_participantes' => (int) $torneo->max_participantes,
                        'inscripciones_count' => (int) ($torneo->inscripciones_count ?? 0),
                        'inscripcion' => [
                            'id' => $inscripcion->id,
                            'estado' => $inscripcion->estado,
                            'pago_cuota' => (float) $inscripcion->pago_cuota,
                            'fecha_inscripcion' => $inscripcion->fecha_inscripcion?->toIso8601String(),
                        ],
                        'juego' => [
                            'id' => $juego?->id,
                            'nombre' => $juego?->nombre,
                            'categoria' => $juego?->categoria,
                            'imagen_url' => $this->gameImageService->resolveTournamentImageUrl(
                                gameName: $juego?->nombre,
                                storedImageUrl: $juego?->imagen_url,
                                gameSlug: $juego?->slug
                            ),
                            'imagen_url_local' => $this->gameImageService->resolveTournamentLocalImageUrl(
                                storedImageUrl: $juego?->imagen_url,
                                gameSlug: $juego?->slug
                            ),
                        ],
                    ];
                })
                ->values();
        }

        return Inertia::render('Tournaments', [
            'juegos' => $juegos,
            'categorias' => $categorias,
            'myTournaments' => $myTournaments,
        ]);
    }

    public function join(Request $request, Torneo $torneo)
    {
        if (! $request->user()) {
            return back()->with('error', 'Debes iniciar sesion para unirte a un torneo.');
        }

        if (! in_array($torneo->estado, ['inscripciones', 'en_curso'], true)) {
            return back()->with('error', 'Este torneo no acepta nuevas inscripciones.');
        }

        $existingInscription = InscripcionTorneo::where('id_torneo', $torneo->id)
            ->where('id_usuario', $request->user()->id)
            ->first();

        if ($existingInscription && $existingInscription->estado === 'confirmada') {
            return back()->with('error', 'Ya estás inscrito y confirmado en este torneo.');
        }

        $inscritos = InscripcionTorneo::where('id_torneo', $torneo->id)
            ->where('estado', 'confirmada')
            ->count();
        if ($inscritos >= (int) $torneo->max_participantes) {
            return back()->with('error', 'El torneo ya esta completo.');
        }

        // Si el torneo tiene cuota, crear inscripción pendiente y redirigir al checkout interno
        if ($torneo->cuota_inscripcion > 0) {
            InscripcionTorneo::updateOrCreate(
                ['id_torneo' => $torneo->id, 'id_usuario' => $request->user()->id],
                [
                    'pago_cuota' => $torneo->cuota_inscripcion,
                    'fecha_inscripcion' => now(),
                    'estado' => 'pendiente',
                ]
            );

            return redirect()->route('tournaments.checkout', $torneo->id);
        }

        // Si es gratuito, confirmar directamente
        InscripcionTorneo::create([
            'id_torneo' => $torneo->id,
            'id_usuario' => $request->user()->id,
            'id_equipo' => null,
            'pago_cuota' => 0,
            'fecha_inscripcion' => now(),
            'estado' => 'confirmada',
        ]);

        return back()->with('success', 'Te has inscrito al torneo correctamente.');
    }
}
