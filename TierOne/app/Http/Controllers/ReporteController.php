<?php

namespace App\Http\Controllers;

use App\Models\Reporte;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReporteController extends Controller
{
    /**
     * Lista todos los reportes con sus relaciones y estadísticas
     */
    public function index()
    {
        $filters = request()->only(['id_partida', 'id_usuario_reporta', 'id_resuelto_por', 'tipo', 'estado', 'fecha_desde', 'fecha_hasta', 'search', 'sort_by', 'sort_dir']);
        $sortBy = request()->input('sort_by', 'fecha_reporte');
        $sortDir = request()->input('sort_dir', 'desc');

        $sortMap = [
            'fecha' => 'fecha_reporte'
        ];

        $orderCol = $sortMap[$sortBy] ?? 'fecha_reporte';

        return \Inertia\Inertia::render('PanelAdminEcommerce/Reports', [
            'reportes' => \App\Models\Reporte::with(['usuarioReporta', 'resueltoPor'])
                ->when($filters['search'] ?? null, function($q, $v) {
                    $q->where(function($sq) use ($v) {
                        $sq->where('id', 'like', "%$v%")
                           ->orWhere('tipo', 'like', "%$v%")
                           ->orWhere('descripcion', 'like', "%$v%")
                           ->orWhere('resolucion', 'like', "%$v%");
                    });
                })
                ->when($filters['id_partida'] ?? null, fn($q, $v) => $q->where('id_partida', $v))
                ->when($filters['id_usuario_reporta'] ?? null, fn($q, $v) => $q->where('id_usuario_reporta', $v))
                ->when($filters['id_resuelto_por'] ?? null, fn($q, $v) => $q->where('id_resuelto_por', $v))
                ->when($filters['tipo'] ?? null, fn($q, $v) => $q->where('tipo', $v))
                ->when($filters['estado'] ?? null, fn($q, $v) => $q->where('estado', $v))
                ->when($filters['fecha_desde'] ?? null, fn($q, $v) => $q->whereDate('fecha_reporte', '>=', $v))
                ->when($filters['fecha_hasta'] ?? null, fn($q, $v) => $q->whereDate('fecha_reporte', '<=', $v))
                ->orderBy($orderCol, $sortDir)
                ->get()
                ->map(fn($r) => [
                    'id'               => $r->id,
                    'id_partida'       => $r->id_partida,
                    'tipo'             => $r->tipo,
                    'descripcion'      => $r->descripcion,
                    'estado'           => $r->estado,
                    'fecha_reporte'    => $r->fecha_reporte?->format('d/m/Y H:i'),
                    'fecha_resolucion' => $r->fecha_resolucion?->format('d/m/Y H:i'),
                    'resolucion'       => $r->resolucion,
                    'evidencia_url'    => $r->evidencia_url,
                    'usuario_reporta'  => $r->usuarioReporta?->name ?? 'Sistema',
                    'resuelto_por'     => $r->resueltoPor?->name ?? 'Pendiente',
                    'id_resuelto_por'  => $r->id_resuelto_por,
                ]),
            'stats' => [
                'total_reportes'    => \App\Models\Reporte::count(),
                'reportes_abiertos' => \App\Models\Reporte::whereIn('estado', ['pendiente', 'en_revision'])->count(),
            ],
            'admins' => \App\Models\User::where('rol', 'admin')->get(['id', 'nombre as name']),
            'usuarios' => \App\Models\User::all(['id', 'nombre as name', 'email']),
            'filters' => $filters
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'id_partida'         => 'required|integer',
            'id_usuario_reporta' => 'required|exists:users,id',
            'tipo'               => 'required|string|max:100',
            'descripcion'        => 'required|string',
        ]);

        $validated['estado'] = 'pendiente';
        $validated['fecha_reporte'] = now();

        Reporte::create($validated);

        return redirect()->back()->with('success', 'Reporte creado correctamente');
    }

    public function update(Request $request, $id)
    {
        $reporte = Reporte::findOrFail($id);

        $request->validate([
            'estado' => 'required|string|in:pendiente,en_revision,resuelta,desestimada',
            'resolucion' => 'nullable|string',
            'id_resuelto_por' => 'nullable|exists:users,id',
        ]);

        $reporte->update([
            'estado' => $request->estado,
            'resolucion' => $request->resolucion,
            'id_resuelto_por' => $request->id_resuelto_por,
            'fecha_resolucion' => in_array($request->estado, ['resuelta', 'desestimada']) ? now() : $reporte->fecha_resolucion,
        ]);

        return back()->with('success', 'Reporte actualizado correctamente');
    }
}
