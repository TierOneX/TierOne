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
        $filters = request()->only(['id_partida', 'id_usuario_reporta', 'id_resuelto_por', 'tipo', 'estado', 'fecha_desde', 'fecha_hasta']);

        return \Inertia\Inertia::render('PanelAdminEcommerce/Reports', [
            'reportes' => \App\Models\Reporte::with(['usuarioReporta', 'resueltoPor'])
                ->when($filters['id_partida'] ?? null, fn($q, $v) => $q->where('id_partida', $v))
                ->when($filters['id_usuario_reporta'] ?? null, fn($q, $v) => $q->where('id_usuario_reporta', $v))
                ->when($filters['id_resuelto_por'] ?? null, fn($q, $v) => $q->where('id_resuelto_por', $v))
                ->when($filters['tipo'] ?? null, fn($q, $v) => $q->where('tipo', $v))
                ->when($filters['estado'] ?? null, fn($q, $v) => $q->where('estado', $v))
                ->when($filters['fecha_desde'] ?? null, fn($q, $v) => $q->whereDate('fecha_reporte', '>=', $v))
                ->when($filters['fecha_hasta'] ?? null, fn($q, $v) => $q->whereDate('fecha_reporte', '<=', $v))
                ->latest('fecha_reporte')
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
                'reportes_abiertos' => \App\Models\Reporte::where('estado', 'abierto')->count(),
            ],
            'admins' => \App\Models\User::where('rol', 'admin')->get(['id', 'nombre as name']),
            'filters' => $filters
        ]);
    }

    public function update(Request $request, $id)
    {
        $reporte = Reporte::findOrFail($id);

        $request->validate([
            'estado' => 'required|string|in:abierto,en_proceso,resuelto',
            'resolucion' => 'nullable|string',
            'id_resuelto_por' => 'nullable|exists:users,id',
        ]);

        $reporte->update([
            'estado' => $request->estado,
            'resolucion' => $request->resolucion,
            'id_resuelto_por' => $request->id_resuelto_por,
            'fecha_resolucion' => $request->estado === 'resuelto' ? now() : $reporte->fecha_resolucion,
        ]);

        return back()->with('success', 'Reporte actualizado correctamente');
    }
}
