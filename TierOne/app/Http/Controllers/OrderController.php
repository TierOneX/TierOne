<?php

namespace App\Http\Controllers;

use App\Models\Orden;
use Inertia\Inertia;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    /**
     * Lista todas las órdenes con filtrado y paginación.
     */
    public function index(Request $request)
    {
        $filters = $request->only(['numero', 'cliente', 'estado', 'fecha_desde', 'fecha_hasta', 'total_min', 'search', 'sort_by', 'sort_dir']);
        $sortBy = $request->input('sort_by', 'fecha_orden');
        $sortDir = $request->input('sort_dir', 'desc');

        $sortMap = [
            'numero' => 'numero_orden',
            'fecha'  => 'fecha_orden',
            'total'  => 'total',
            'estado' => 'estado'
        ];

        $orderCol = $sortMap[$sortBy] ?? 'fecha_orden';

        return Inertia::render('PanelAdminEcommerce/Orders', [
            'ordenes' => Orden::with('usuario')
                ->when($filters['search'] ?? null, function($q, $v) {
                    $q->where(function($sq) use ($v) {
                        $sq->where('numero_orden', 'like', "%$v%")
                           ->orWhere('tracking_number', 'like', "%$v%")
                           ->orWhere('transportista', 'like', "%$v%")
                           ->orWhereHas('usuario', function($uq) use ($v) {
                               $uq->where('nombre', 'like', "%$v%")
                                  ->orWhere('email', 'like', "%$v%");
                           });
                    });
                })
                ->when($filters['numero'] ?? null, fn($q, $v) => $q->where('numero_orden', 'like', "%$v%"))
                ->when($filters['cliente'] ?? null, fn($q, $v) => $q->whereHas('usuario', fn($sq) => $sq->where('nombre', 'like', "%$v%")))
                ->when($filters['estado'] ?? null, fn($q, $v) => $q->where('estado', $v))
                ->when($filters['fecha_desde'] ?? null, fn($q, $v) => $q->whereDate('fecha_orden', '>=', $v))
                ->when($filters['fecha_hasta'] ?? null, fn($q, $v) => $q->whereDate('fecha_orden', '<=', $v))
                ->when($filters['total_min'] ?? null, fn($q, $v) => $q->where('total', '>=', $v))
                ->orderBy($orderCol, $sortDir)
                ->paginate(20)
                ->withQueryString()
                ->through(fn($o) => [
                    'id'       => $o->id,
                    'numero'   => $o->numero_orden,
                    'cliente'  => $o->usuario?->nombre ?? 'N/A',
                    'email'    => $o->usuario?->email ?? '',
                    'total'    => $o->total,
                    'estado'   => $o->estado,
                    'fecha'    => $o->fecha_orden?->format('d/m/Y'),
                    'tracking' => $o->tracking_number,
                ]),
            'filters' => $filters
        ]);
    }
}
