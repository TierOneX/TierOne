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
            'fecha'         => 'fecha_transaccion',
            'monto'         => 'monto',
            'balance_nuevo' => 'balance_nuevo'
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
                $q->whereHas('usuario', fn($sq) => $sq->where('nombre', 'like', "%$v%"))
                  ->orWhere('detalles_cuenta', 'like', "%$v%");
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
                'id_procesado_por' => $r->id_procesado_por,
                'fecha_procesado' => $r->fecha_procesado?->format('d/m/Y H:i'),
                'notas_admin' => $r->notas_admin,
            ]);

        return Inertia::render('PanelAdminEcommerce/Finanzas/Retiros', [
            'retiros' => $retiros,
            'filters' => $filters,
            'admins' => \App\Models\User::where('rol', 'admin')->get(['id', 'nombre as name']),
        ]);
    }

    /**
     * Actualizar estado de un retiro.
     */
    public function updateRetiro(Request $request, $id)
    {
        $retiro = Retiro::findOrFail($id);

        $request->validate([
            'estado' => 'required|in:pendiente,procesando,completado,rechazado',
            'metodo' => 'required|in:paypal,transferencia,cripto',
            'notas_admin' => 'nullable|string',
            'id_procesado_por' => 'nullable|exists:users,id',
        ]);

        $retiro->update([
            'estado' => $request->estado,
            'metodo' => $request->metodo,
            'notas_admin' => $request->notas_admin,
            'id_procesado_por' => $request->id_procesado_por ?? auth()->id(),
            'fecha_procesado' => in_array($request->estado, ['completado', 'rechazado']) ? now() : $retiro->fecha_procesado,
        ]);

        return back()->with('success', 'Solicitud de retiro actualizada.');
    }
}
