<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Juego;
use App\Models\Partida;
use App\Models\Reporte;
use App\Models\Torneo;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class GamingAdminController extends Controller
{
    public function index(Request $request)
    {
        $this->authorizeAdmin($request);

        $section = $request->string('section')->toString() ?: 'torneos';
        $search = trim((string) $request->input('search', ''));
        $incidenciasSort = $request->input('incidencias_sort', 'newest') === 'oldest' ? 'oldest' : 'newest';

        $torneos = Torneo::with(['juego:id,nombre,imagen_url', 'organizador:id,username'])
            ->withCount('inscripciones')
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('nombre', 'like', "%{$search}%")
                        ->orWhere('estado', 'like', "%{$search}%")
                        ->orWhereHas('juego', fn ($jq) => $jq->where('nombre', 'like', "%{$search}%"));
                });
            })
            ->latest('id')
            ->take(40)
            ->get();

        $partidas = Partida::with(['juego:id,nombre', 'creador:id,username'])
            ->withCount('participantes')
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('titulo', 'like', "%{$search}%")
                        ->orWhere('estado', 'like', "%{$search}%")
                        ->orWhereHas('juego', fn ($jq) => $jq->where('nombre', 'like', "%{$search}%"));
                });
            })
            ->latest('id')
            ->take(40)
            ->get();

        $incidencias = Reporte::with(['partida:id,titulo', 'usuarioReporta:id,username', 'resueltoPor:id,username'])
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('tipo', 'like', "%{$search}%")
                        ->orWhere('descripcion', 'like', "%{$search}%")
                        ->orWhereHas('partida', fn ($pq) => $pq->where('titulo', 'like', "%{$search}%"))
                        ->orWhereHas('usuarioReporta', fn ($uq) => $uq->where('username', 'like', "%{$search}%"));
                });
            })
            ->orderBy('fecha_reporte', $incidenciasSort === 'oldest' ? 'asc' : 'desc')
            ->take(40)
            ->get();

        $cuentas = User::query()
            ->select('id', 'username', 'email', 'rol', 'verificado', 'activo', 'fecha_registro', 'ultima_conexion')
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('username', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('rol', 'like', "%{$search}%");
                });
            })
            ->latest('id')
            ->take(60)
            ->get();

        $juegosFull = Juego::query()
            ->when($search !== '', function ($query) use ($search) {
                $query->where('nombre', 'like', "%{$search}%")
                    ->orWhere('categoria', 'like', "%{$search}%");
            })
            ->latest('id')
            ->take(60)
            ->get();

        $juegosSimple = Juego::query()
            ->select('id', 'nombre')
            ->where('activo', true)
            ->orderBy('nombre')
            ->get();

        return Inertia::render('PanelAdminGaming', [
            'filters' => [
                'section' => $section,
                'search' => $search,
                'incidencias_sort' => $incidenciasSort,
            ],
            'juegos' => $juegosSimple,
            'juegosFull' => $juegosFull,
            'torneos' => $torneos,
            'partidas' => $partidas,
            'incidencias' => $incidencias,
            'cuentas' => $cuentas,
        ]);
    }

    public function storeTorneo(Request $request)
    {
        $this->authorizeAdmin($request);

        $data = $request->validate([
            'id_juego' => 'required|exists:juegos,id',
            'nombre' => 'required|string|max:255',
            'descripcion' => 'required|string|max:2000',
            'imagen_banner' => 'required|string|max:1000',
            'formato' => 'required|in:eliminacion_simple,doble_eliminacion,round_robin,swiss',
            'max_participantes' => 'required|integer|min:2|max:512',
            'cuota_inscripcion' => 'required|numeric|min:0',
            'premio_total' => 'required|numeric|min:0',
            'comision_plataforma_porcentaje' => 'required|numeric|min:0|max:100',
            'es_gratuito' => 'required|boolean',
            'fecha_inicio' => 'required|date',
            'fecha_fin' => 'required|date|after_or_equal:fecha_inicio',
            'cierre_inscripciones' => 'required|date|before_or_equal:fecha_inicio',
            'estado' => 'required|in:inscripciones,en_curso,finalizado,cancelado',
            'reglas_url' => 'required|string|max:1000',
            'stream_url' => 'required|string|max:1000',
            'verificado' => 'required|boolean',
        ]);

        Torneo::create([
            ...$data,
            'id_organizador' => $request->user()->id,
        ]);

        return back()->with('success', 'Torneo creado correctamente.');
    }

    public function updateTorneo(Request $request, Torneo $torneo)
    {
        $this->authorizeAdmin($request);

        $data = $request->validate([
            'estado' => 'required|in:inscripciones,en_curso,finalizado,cancelado',
            'max_participantes' => 'required|integer|min:2|max:512',
        ]);

        $torneo->update($data);

        return back()->with('success', 'Torneo actualizado correctamente.');
    }

    public function destroyTorneo(Request $request, Torneo $torneo)
    {
        $this->authorizeAdmin($request);
        $torneo->delete();
        return back()->with('success', 'Torneo eliminado correctamente.');
    }

    public function updatePartida(Request $request, Partida $partida)
    {
        $this->authorizeAdmin($request);

        $data = $request->validate([
            'estado' => 'required|in:pendiente,en_proceso,completada,cancelada',
            'tipo' => 'required|in:1v1,2v2,5v5,custom',
        ]);

        $partida->update($data);

        return back()->with('success', 'Partida actualizada correctamente.');
    }

    public function destroyPartida(Request $request, Partida $partida)
    {
        $this->authorizeAdmin($request);
        $partida->delete();
        return back()->with('success', 'Partida eliminada correctamente.');
    }

    public function updateIncidencia(Request $request, Reporte $reporte)
    {
        $this->authorizeAdmin($request);

        $data = $request->validate([
            'estado' => 'required|in:pendiente,en_revision,resuelta,desestimada',
            'resolucion' => 'nullable|string|max:2000',
        ]);

        $reporte->update([
            ...$data,
            'id_resuelto_por' => $request->user()->id,
            'fecha_resolucion' => in_array($data['estado'], ['resuelta', 'desestimada'], true) ? now() : null,
        ]);

        return back()->with('success', 'Incidencia actualizada correctamente.');
    }

    public function updateCuenta(Request $request, User $user)
    {
        $this->authorizeAdmin($request);

        $data = $request->validate([
            'username' => ['required', 'string', 'max:255', Rule::unique('users', 'username')->ignore($user->id)],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'rol' => 'required|in:player,admin,streamer',
            'activo' => 'required|boolean',
            'verificado' => 'required|boolean',
        ]);

        $user->update($data);

        return back()->with('success', 'Cuenta actualizada correctamente.');
    }

    public function storeJuego(Request $request)
    {
        $this->authorizeAdmin($request);

        $data = $request->validate([
            'nombre' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:juegos,slug',
            'descripcion' => 'nullable|string',
            'imagen_url' => 'nullable|string|max:1000',
            'categoria' => 'required|string|max:255',
            'activo' => 'required|boolean',
        ]);

        Juego::create($data);

        return back()->with('success', 'Juego creado correctamente.');
    }

    public function updateJuego(Request $request, Juego $juego)
    {
        $this->authorizeAdmin($request);

        $data = $request->validate([
            'nombre' => 'required|string|max:255',
            'slug' => ['required', 'string', 'max:255', Rule::unique('juegos', 'slug')->ignore($juego->id)],
            'descripcion' => 'nullable|string',
            'imagen_url' => 'nullable|string|max:1000',
            'categoria' => 'required|string|max:255',
            'activo' => 'required|boolean',
        ]);

        $juego->update($data);

        return back()->with('success', 'Juego actualizado correctamente.');
    }

    public function destroyJuego(Request $request, Juego $juego)
    {
        $this->authorizeAdmin($request);
        
        if ($juego->torneos()->exists() || $juego->partidas()->exists()) {
            return back()->with('error', 'No se puede eliminar el juego porque tiene torneos o partidas asociados.');
        }

        $juego->delete();

        return back()->with('success', 'Juego eliminado correctamente.');
    }

    private function authorizeAdmin(Request $request): void
    {
        abort_unless($request->user() && $request->user()->rol === 'admin', 403);
    }
}
