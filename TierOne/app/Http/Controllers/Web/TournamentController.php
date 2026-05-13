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
                    $query->withCount('inscripciones')
                        ->with(['inscripciones.usuario:id,username,nombre'])
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

        return Inertia::render('Tournaments', [
            'juegos' => $juegos,
            'categorias' => $categorias,
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

        if (InscripcionTorneo::where('id_torneo', $torneo->id)->where('id_usuario', $request->user()->id)->exists()) {
            return back()->with('error', 'Ya estas inscrito en este torneo.');
        }

        $inscritos = InscripcionTorneo::where('id_torneo', $torneo->id)->count();
        if ($inscritos >= (int) $torneo->max_participantes) {
            return back()->with('error', 'El torneo ya esta completo.');
        }

        // Si el torneo tiene cuota, redirigir a Stripe
        if ($torneo->cuota_inscripcion > 0) {
            $stripe = new \Stripe\StripeClient(config('stripe.secret'));
            
            $session = $stripe->checkout->sessions->create([
                'payment_method_types' => ['card'],
                'line_items' => [[
                    'price_data' => [
                        'currency' => 'eur',
                        'product_data' => [
                            'name' => "Inscripción: {$torneo->nombre}",
                            'description' => "Cuota de participación para el torneo de {$torneo->juego->nombre}",
                        ],
                        'unit_amount' => (int)($torneo->cuota_inscripcion * 100),
                    ],
                    'quantity' => 1,
                ]],
                'mode' => 'payment',
                'success_url' => route('tournaments', ['success' => '¡Inscripción completada con éxito!']),
                'cancel_url' => route('tournaments', ['error' => 'Se ha cancelado el proceso de pago.']),
                'customer_email' => $request->user()->email,
                'metadata' => [
                    'type' => 'tournament_registration',
                    'torneo_id' => $torneo->id,
                    'user_id' => $request->user()->id,
                ],
            ]);

            // Crear la inscripción en estado pendiente
            InscripcionTorneo::create([
                'id_torneo' => $torneo->id,
                'id_usuario' => $request->user()->id,
                'pago_cuota' => $torneo->cuota_inscripcion,
                'fecha_inscripcion' => now(),
                'estado' => 'pendiente_pago',
            ]);

            return Inertia::location($session->url);
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
