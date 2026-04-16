<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;

use App\Models\Orden;
use App\Models\User;
use App\Models\Producto;
use App\Models\DireccionEnvio;
use App\Services\OrderService;
use Inertia\Inertia;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function __construct(
        protected OrderService $orderService
    ) {}

    /**
     * Lista todas las órdenes con filtrado y paginación.
     */
    public function index(Request $request)
    {
        $filters = $request->only(['numero', 'cliente', 'estado', 'fecha_desde', 'fecha_hasta', 'total_min', 'search', 'sort_by', 'sort_dir']);
        $sortBy = $request->input('sort_by', 'fecha_orden');
        $sortDir = $request->input('sort_dir', 'desc');

        $paginator = $this->orderService->getFilteredOrders($filters, $sortBy, $sortDir, 20);

        return Inertia::render('PanelAdminEcommerce/Orders', [
            'ordenes' => $paginator->through(fn($o) => [
                'id'       => $o->id,
                'numero'   => $o->numero_orden,
                'cliente'  => $o->usuario?->nombre ?? 'N/A',
                'email'    => $o->usuario?->email ?? '',
                'total'    => $o->total,
                'estado'   => $o->estado,
                'fecha'    => $o->fecha_orden?->format('d/m/Y'),
                'tracking' => $o->tracking_number,
                'items'    => $o->items->map(fn($i) => [
                    'id' => $i->id,
                    'producto' => $i->producto?->nombre ?? 'Producto eliminado',
                    'cantidad' => $i->cantidad,
                    'precio'   => $i->precio_unitario,
                    'subtotal' => $i->subtotal,
                ]),
            ]),
            'filters' => $filters,
            'usuarios' => User::all(['id', 'nombre', 'email']),
            'direcciones' => DireccionEnvio::all(['id', 'id_usuario', 'nombre_completo', 'direccion_linea1', 'ciudad', 'pais']),
            'productos' => Producto::where('activo', true)->get(['id', 'nombre', 'precio_venta'])
        ]);
    }

    /**
     * Crea una orden manualmente.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'id_usuario'         => 'required|exists:users,id',
            'id_direccion_envio' => 'nullable|exists:direcciones_envio,id',
            // Campos de dirección manual (si no se selecciona id_direccion_envio)
            'nombre_completo'    => 'required_without:id_direccion_envio|string|max:255',
            'direccion_linea1'   => 'required_without:id_direccion_envio|string|max:255',
            'ciudad'             => 'required_without:id_direccion_envio|string|max:255',
            'codigo_postal'      => 'required_without:id_direccion_envio|string|max:255',
            'pais'               => 'required_without:id_direccion_envio|string|max:255',
            'telefono'           => 'required_without:id_direccion_envio|string|max:255',
            
            'estado'             => 'required|string',
            'subtotal'           => 'required|numeric|min:0',
            'impuestos'          => 'required|numeric|min:0',
            'costo_envio'        => 'required|numeric|min:0',
            'descuento'          => 'required|numeric|min:0',
            'total'              => 'required|numeric|min:0',
        ]);

        $this->orderService->createOrder($validated);

        return redirect()->back()->with('success', 'Orden creada correctamente');
    }

    /**
     * Actualiza una orden existente.
     */
    public function update(Request $request, Orden $orden)
    {
        $validated = $request->validate([
            'estado'          => 'required|string',
            'tracking_number' => 'nullable|string|max:255',
            'transportista'   => 'nullable|string|max:255',
            'total'           => 'required|numeric|min:0',
        ]);

        $this->orderService->updateOrder($orden, $validated);

        return redirect()->back()->with('success', 'Orden actualizada correctamente');
    }

    /**
     * Elimina una orden.
     */
    public function destroy(Orden $orden)
    {
        $this->orderService->deleteOrder($orden);
        return redirect()->back()->with('success', 'Orden eliminada correctamente');
    }
}

