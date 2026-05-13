<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Juego;
use App\Models\Partida;
use App\Models\ParticipantePartida;
use App\Models\User;
use App\Services\GameImageService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MatchController extends Controller
{
    public function __construct(private readonly GameImageService $gameImageService)
    {
    }

    public function index(): Response
    {
        $juegos = Juego::query()
            ->where('activo', true)
            ->withCount([
                'partidas as total_partidas' => fn ($query) => $query,
                'partidas as partidas_abiertas' => fn ($query) => $query->where('estado', 'pendiente'),
            ])
            ->with([
                'partidas' => function ($query) {
                    $query->with(['creador:id,username,nombre,apellido', 'participantes.usuario:id,username,nombre'])
                        ->withCount('participantes')
                        ->orderByRaw("case when estado = 'pendiente' then 0 else 1 end")
                        ->orderBy('fecha_inicio')
                        ->orderByDesc('id');
                },
            ])
            ->get()
            ->map(function (Juego $juego) {
                $partidas = $juego->partidas->map(function (Partida $partida) {
                    $capacidad = $this->matchCapacity($partida->tipo);
                    $participantesCount = $partida->participantes_count ?? $partida->participantes->count();

                    return [
                        'id' => $partida->id,
                        'titulo' => $partida->titulo,
                        'tipo' => $partida->tipo,
                        'buy_in' => (float) $partida->buy_in,
                        'premio_total' => (float) $partida->premio_total,
                        'comision_plataforma' => (float) $partida->comision_plataforma,
                        'fecha_inicio' => $partida->fecha_inicio?->toIso8601String(),
                        'estado' => $partida->estado,
                        'origen' => $partida->origen,
                        'capacidad' => $capacidad,
                        'participantes_count' => $participantesCount,
                        'slots_disponibles' => max($capacidad - $participantesCount, 0),
                        'creador' => [
                            'username' => $partida->creador?->username,
                            'nombre' => trim(($partida->creador?->nombre ?? '') . ' ' . ($partida->creador?->apellido ?? '')),
                        ],
                        'participantes' => $partida->participantes->map(fn (ParticipantePartida $participante) => [
                            'id' => $participante->id,
                            'id_usuario' => $participante->id_usuario,
                            'username' => $participante->usuario?->username,
                            'nombre' => $participante->usuario?->nombre,
                            'equipo_asignado' => $participante->equipo_asignado,
                            'confirmado' => (bool) $participante->confirmado,
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
                    'activo' => (bool) $juego->activo,
                    'total_partidas' => (int) $juego->total_partidas,
                    'partidas_abiertas' => (int) $juego->partidas_abiertas,
                    'popularidad' => (int) $juego->partidas_abiertas * 3 + (int) $juego->total_partidas,
                    'partidas' => $partidas,
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

        return Inertia::render('Matches', [
            'juegos' => $juegos,
            'categorias' => $categorias,
            'demoUser' => null,
        ]);
    }

    public function show(Partida $partida): Response
    {
        $partida->load(['creador:id,username,nombre,apellido', 'juego', 'participantes.usuario:id,username,nombre']);

        $capacidad = $this->matchCapacity($partida->tipo);
        $participantesCount = $partida->participantes->count();

        $formattedMatch = [
            'id' => $partida->id,
            'titulo' => $partida->titulo,
            'tipo' => $partida->tipo,
            'buy_in' => (float) $partida->buy_in,
            'premio_total' => (float) $partida->premio_total,
            'comision_plataforma' => (float) $partida->comision_plataforma,
            'fecha_inicio' => $partida->fecha_inicio?->toIso8601String(),
            'estado' => $partida->estado,
            'origen' => $partida->origen,
            'capacidad' => $capacidad,
            'participantes_count' => $participantesCount,
            'slots_disponibles' => max($capacidad - $participantesCount, 0),
            'creador' => [
                'username' => $partida->creador?->username,
                'nombre' => trim(($partida->creador?->nombre ?? '') . ' ' . ($partida->creador?->apellido ?? '')),
            ],
            'juego' => [
                'id' => $partida->juego?->id,
                'nombre' => $partida->juego?->nombre,
                'slug' => $partida->juego?->slug,
                'imagen_url' => $this->gameImageService->resolveTournamentImageUrl(
                    gameName: $partida->juego?->nombre,
                    storedImageUrl: $partida->juego?->imagen_url,
                    gameSlug: $partida->juego?->slug
                ),
                'imagen_url_local' => $this->gameImageService->resolveTournamentLocalImageUrl(
                    storedImageUrl: $partida->juego?->imagen_url,
                    gameSlug: $partida->juego?->slug
                ),
                'categoria' => $partida->juego?->categoria,
            ],
            'participantes' => $partida->participantes->map(fn ($p) => [
                'id' => $p->id,
                'id_usuario' => $p->id_usuario,
                'username' => $p->usuario?->username,
                'nombre' => $p->usuario?->nombre,
                'equipo_asignado' => $p->equipo_asignado,
                'confirmado' => (bool) $p->confirmado,
                'fecha_union' => $p->fecha_union?->toIso8601String(),
            ])->values(),
        ];

        return Inertia::render('MatchDetail', [
            'partida' => $formattedMatch,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        if (! $request->user()) {
            return back()->with('error', 'Debes iniciar sesion para crear una partida.');
        }

        $validated = $request->validate([
            'id_juego' => ['required', 'exists:juegos,id'],
            'titulo' => ['required', 'string', 'max:255'],
            'tipo' => ['required', 'in:1v1,2v2,5v5,custom'],
            'buy_in' => ['nullable', 'numeric', 'min:0'],
            'premio_total' => ['nullable', 'numeric', 'min:0'],
            'fecha_inicio' => ['nullable', 'date'],
        ]);

        $creador = $request->user();
        $buyIn = (float) ($validated['buy_in'] ?? 0);

        $premioTotal = (float) ($validated['premio_total'] ?? max($buyIn * $this->matchCapacity($validated['tipo']), 0));
        $partida = Partida::create([
            'id_juego' => $validated['id_juego'],
            'id_creador' => $creador->id,
            'titulo' => $validated['titulo'],
            'tipo' => $validated['tipo'],
            'buy_in' => $buyIn,
            'premio_total' => $premioTotal,
            'comision_plataforma' => round($premioTotal * 0.08, 2),
            'fecha_inicio' => $validated['fecha_inicio'] ?? now()->addHour(),
            'fecha_fin' => null,
            'estado' => 'pendiente',
            'origen' => 'manual',
        ]);

        ParticipantePartida::create([
            'id_partida' => $partida->id,
            'id_usuario' => $creador->id,
            'equipo_asignado' => 'team_a',
            'pago_entrada' => $buyIn,
            'confirmado' => true,
            'fecha_union' => now(),
        ]);

        return back()->with('success', 'Partida creada correctamente.');
    }

    public function join(Request $request, Partida $partida): RedirectResponse
    {
        if (! $request->user()) {
            return back()->with('error', 'Debes iniciar sesion para unirte a una partida.');
        }

        $jugador = $this->resolveJoinUser($request, $partida);

        if (! $jugador) {
            return back()->with('error', 'No puedes unirte a esta partida.');
        }

        if ($partida->estado !== 'pendiente') {
            return back()->with('error', 'Solo puedes unirte a partidas pendientes.');
        }

        if ($partida->participantes()->where('id_usuario', $jugador->id)->exists()) {
            return back()->with('error', 'Ya formas parte de esta partida.');
        }

        $capacidad = $this->matchCapacity($partida->tipo);
        $participantesCount = $partida->participantes()->count();

        if ($participantesCount >= $capacidad) {
            return back()->with('error', 'La partida ya esta llena.');
        }

        // Validar saldo
        if ($jugador->balance_tokens < $partida->buy_in) {
            return back()->with('error', 'Saldo insuficiente. Necesitas ' . $partida->buy_in . ' HC para unirte.');
        }

        ParticipantePartida::create([
            'id_partida' => $partida->id,
            'id_usuario' => $jugador->id,
            'equipo_asignado' => $participantesCount % 2 === 0 ? 'team_a' : 'team_b',
            'pago_entrada' => $partida->buy_in,
            'confirmado' => true,
            'fecha_union' => now(),
        ]);

        // Descontar saldo
        $jugador->decrement('balance_tokens', $partida->buy_in);

        // Generar orden para factura/auditoría (PTD- prefix)
        // Conversión HC → EUR: 500 HC = 4.99€ → 1 HC = 0.00998€
        $hcToEur = 0.00998;
        $buyInEur = round((float)$partida->buy_in * $hcToEur, 2);
        $numeroOrden = 'PTD-' . strtoupper(uniqid());

        $partida->load('juego');

        $orden = \App\Models\Orden::create([
            'id_usuario' => $jugador->id,
            'id_direccion_envio' => null, // Digital: no shipping
            'numero_orden' => $numeroOrden,
            'subtotal' => $buyInEur,
            'impuestos' => 0, // HC internal transaction
            'costo_envio' => 0,
            'descuento' => 0,
            'total' => $buyInEur,
            'estado' => 'pagada',
            'fecha_orden' => now(),
        ]);

        \App\Models\ItemOrden::create([
            'id_orden' => $orden->id,
            'id_producto' => 1, // Placeholder for digital services
            'id_proveedor' => 1,
            'cantidad' => 1,
            'precio_unitario' => $buyInEur,
            'subtotal' => $buyInEur,
            'personalizacion_data' => [
                'tipo' => 'partida',
                'partida_id' => $partida->id,
                'titulo' => $partida->titulo,
                'juego' => $partida->juego->nombre ?? 'Juego',
                'buy_in_hc' => (float)$partida->buy_in,
            ],
        ]);

        \App\Models\Pago::create([
            'id_orden' => $orden->id,
            'monto' => $buyInEur,
            'metodo' => 'hydra_coins',
            'id_transaccion' => 'HC-' . strtoupper(uniqid()),
            'estado' => 'completado',
            'fecha_pago' => now(),
        ]);

        return back()->with('success', 'Te has unido a la partida correctamente.');
    }

    public function leave(Request $request, Partida $partida): RedirectResponse
    {
        if (! $request->user()) {
            return back()->with('error', 'Debes iniciar sesion para salir de una partida.');
        }

        $participacion = $partida->participantes()
            ->where('id_usuario', $request->user()->id)
            ->first();

        if (! $participacion) {
            return back()->with('error', 'No formas parte de esta partida.');
        }

        $participacion->delete();

        return back()->with('success', 'Has salido de la partida correctamente.');
    }

    private function resolveJoinUser(Request $request, Partida $partida): ?User
    {
        if ($request->user() instanceof User && ! $partida->participantes()->where('id_usuario', $request->user()->id)->exists()) {
            return $request->user();
        }

        return null;
    }

    private function matchCapacity(string $tipo): int
    {
        return match ($tipo) {
            '1v1' => 2,
            '2v2' => 4,
            '5v5' => 10,
            default => 12,
        };
    }
}

