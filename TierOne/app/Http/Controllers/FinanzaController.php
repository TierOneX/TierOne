<?php

namespace App\Http\Controllers;

use App\Models\Pago;
use App\Models\Transaccion;
use App\Models\Retiro;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FinanzaController extends Controller
{
    /**
     * Listado de pagos.
     */
    public function pagos(Request $request)
    {
        $filters = $request->only(['search', 'metodo', 'estado', 'fecha_desde', 'fecha_hasta', 'sort_by', 'sort_dir']);
        $sortBy = $request->input('sort_by', 'fecha_pago');
        $sortDir = $request->input('sort_dir', 'desc');

        $sortMap = [
            'fecha' => 'fecha_pago',
            'monto' => 'monto'
        ];

        $orderCol = $sortMap[$sortBy] ?? 'fecha_pago';

        $pagos = Pago::with('orden.usuario')
            ->when($filters['search'] ?? null, function($q, $v) {
                $q->where('id_transaccion', 'like', "%$v%")
                  ->orWhereHas('orden', function($sq) use ($v) {
                      $sq->where('numero_orden', 'like', "%$v%")
                         ->orWhereHas('usuario', fn($uq) => $uq->where('nombre', 'like', "%$v%"));
                  });
            })
            ->when($filters['metodo'] ?? null, fn($q, $v) => $q->where('metodo', $v))
            ->when($filters['estado'] ?? null, fn($q, $v) => $q->where('estado', $v))
            ->when($filters['fecha_desde'] ?? null, fn($q, $v) => $q->whereDate('fecha_pago', '>=', $v))
            ->when($filters['fecha_hasta'] ?? null, fn($q, $v) => $q->whereDate('fecha_pago', '<=', $v))
            ->orderBy($orderCol, $sortDir)
            ->paginate(20)
            ->withQueryString()
            ->through(fn($p) => [
                'id' => $p->id,
                'id_orden' => $p->id_orden,
                'numero_orden' => $p->orden?->numero_orden,
                'cliente' => $p->orden?->usuario?->nombre,
                'monto' => $p->monto,
                'metodo' => $p->metodo,
                'id_transaccion' => $p->id_transaccion,
                'estado' => $p->estado,
                'fecha' => $p->fecha_pago?->format('d/m/Y H:i'),
            ]);

        return Inertia::render('PanelAdminEcommerce/Finanzas/Pagos', [
            'pagos' => $pagos,
            'filters' => $filters
        ]);
    }

    /**
     * Listado de transacciones.
     */
    public function transacciones(Request $request)
    {
        $filters = $request->only(['search', 'tipo', 'fecha_desde', 'fecha_hasta', 'sort_by', 'sort_dir']);
        $sortBy = $request->input('sort_by', 'fecha_transaccion');
        $sortDir = $request->input('sort_dir', 'desc');

        $sortMap = [
            'fecha' => 'fecha_transaccion',
            'monto' => 'monto'
        ];

        $orderCol = $sortMap[$sortBy] ?? 'fecha_transaccion';

        $transacciones = Transaccion::with('usuario')
            ->when($filters['search'] ?? null, function($q, $v) {
                $q->where('descripcion', 'like', "%$v%")
                  ->orWhereHas('usuario', fn($sq) => $sq->where('nombre', 'like', "%$v%"));
            })
            ->when($filters['tipo'] ?? null, fn($q, $v) => $q->where('tipo', $v))
            ->when($filters['fecha_desde'] ?? null, fn($q, $v) => $q->whereDate('fecha_transaccion', '>=', $v))
            ->when($filters['fecha_hasta'] ?? null, fn($q, $v) => $q->whereDate('fecha_transaccion', '<=', $v))
            ->orderBy($orderCol, $sortDir)
            ->paginate(20)
            ->withQueryString()
            ->through(fn($t) => [
                'id' => $t->id,
                'usuario' => $t->usuario?->nombre,
                'tipo' => $t->tipo,
                'monto' => $t->monto,
                'balance_anterior' => $t->balance_anterior,
                'balance_nuevo' => $t->balance_nuevo,
                'descripcion' => $t->descripcion,
                'fecha' => $t->fecha_transaccion?->format('d/m/Y H:i'),
            ]);

        return Inertia::render('PanelAdminEcommerce/Finanzas/Transacciones', [
            'transacciones' => $transacciones,
            'filters' => $filters
        ]);
    }

    /**
     * Listado de retiros.
     */
    public function retiros(Request $request)
    {
        $filters = $request->only(['search', 'estado', 'metodo', 'sort_by', 'sort_dir']);
        $sortBy = $request->input('sort_by', 'fecha_solicitud');
        $sortDir = $request->input('sort_dir', 'desc');

        $sortMap = [
            'fecha_solicitud' => 'fecha_solicitud',
            'monto' => 'monto'
        ];

        $orderCol = $sortMap[$sortBy] ?? 'fecha_solicitud';

        $retiros = Retiro::with(['usuario', 'procesadoPor'])
            ->when($filters['search'] ?? null, function($q, $v) {
                $q->whereHas('usuario', fn($sq) => $sq->where('nombre', 'like', "%$v%"));
            })
            ->when($filters['estado'] ?? null, fn($q, $v) => $q->where('estado', $v))
            ->when($filters['metodo'] ?? null, fn($q, $v) => $q->where('metodo', $v))
            ->orderBy($orderCol, $sortDir)
            ->paginate(20)
            ->withQueryString()
            ->through(fn($r) => [
                'id' => $r->id,
                'usuario' => $r->usuario?->nombre,
                'monto' => $r->monto,
                'metodo' => $r->metodo,
                'detalles' => $r->detalles_cuenta,
                'estado' => $r->estado,
                'fecha_solicitud' => $r->fecha_solicitud?->format('d/m/Y H:i'),
                'procesado_por' => $r->procesadoPor?->nombre,
                'fecha_procesado' => $r->fecha_procesado?->format('d/m/Y H:i'),
            ]);

        return Inertia::render('PanelAdminEcommerce/Finanzas/Retiros', [
            'retiros' => $retiros,
            'filters' => $filters
        ]);
    }
}
