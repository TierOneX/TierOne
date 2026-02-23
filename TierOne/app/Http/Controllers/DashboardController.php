<?php

namespace App\Http\Controllers;

use App\Models\Orden;
use App\Models\Producto;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Muestra el dashboard administrativo con estadísticas globales.
     */
    public function index()
    {
        return Inertia::render('PanelAdminEcommerce/Dashboard', [
            'stats' => [
                'ventas_mes'        => Orden::whereMonth('fecha_orden', now()->month)->sum('total'),
                'ordenes_hoy'       => Orden::whereDate('fecha_orden', now())->count(),
                'usuarios_mes'      => \App\Models\User::whereMonth('fecha_registro', now()->month)->count(),
                'rating_promedio'   => \App\Models\Review::avg('calificacion') ?? 0,
            ],
            'ordenes_recientes' => Orden::with('usuario')
                ->latest('fecha_orden')
                ->take(5)
                ->get()
                ->map(fn($o) => [
                    'id'       => $o->id,
                    'numero'   => $o->numero_orden,
                    'cliente'  => $o->usuario?->name ?? 'N/A',
                    'total'    => $o->total,
                    'estado'   => $o->estado,
                    'fecha'    => $o->fecha_orden?->format('d/m/Y'),
                ]),
        ]);
    }
}
