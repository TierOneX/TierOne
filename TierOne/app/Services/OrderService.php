<?php

namespace App\Services;

use App\Models\Orden;
use App\Models\ItemOrden;
use App\Models\DireccionEnvio;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OrderService
{
    /**
     * Obtiene órdenes paginadas y filtradas para Web/Admin
     */
    public function getFilteredOrders(array $filters, string $sortBy = 'fecha_orden', string $sortDir = 'desc', int $perPage = 20)
    {
        $sortMap = [
            'numero' => 'numero_orden',
            'fecha'  => 'fecha_orden',
            'total'  => 'total',
            'estado' => 'estado'
        ];

        $orderCol = $sortMap[$sortBy] ?? 'fecha_orden';

        return Orden::with(['usuario', 'items.producto'])
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
            ->paginate($perPage)
            ->withQueryString();
    }

    /**
     * Obtiene el listado completo para API
     */
    public function getAllOrders()
    {
        return Orden::with(['usuario', 'items', 'direccionEnvio'])->get();
    }

    /**
     * Obtiene una orden individual con todo su árbol de relaciones
     */
    public function getOrderById(string|int $id)
    {
        return Orden::with(['usuario', 'items.producto', 'direccionEnvio', 'transacciones', 'canceladoPor'])->findOrFail($id);
    }

    /**
     * Crea una orden compleja asegurando estructura transaccional (Header + Items + Direccion)
     */
    public function createOrder(array $data): Orden
    {
        return DB::transaction(function () use ($data) {
            // Manejar la creación de dirección de envío manual si es solicitada desde Admin (vía Web)
            if (empty($data['id_direccion_envio']) && isset($data['nombre_completo'])) {
                $direccion = DireccionEnvio::create([
                    'id_usuario'       => $data['id_usuario'],
                    'nombre_completo'  => $data['nombre_completo'],
                    'direccion_linea1' => $data['direccion_linea1'] ?? '',
                    'ciudad'           => $data['ciudad'] ?? '',
                    'codigo_postal'    => $data['codigo_postal'] ?? '',
                    'pais'             => $data['pais'] ?? '',
                    'telefono'         => $data['telefono'] ?? '',
                    'predeterminada'   => false
                ]);
                $data['id_direccion_envio'] = $direccion->id;
            }

            if (empty($data['numero_orden'])) {
                $data['numero_orden'] = 'ORD-' . strtoupper(uniqid());
            }

            if (empty($data['fecha_orden'])) {
                $data['fecha_orden'] = now();
            }

            if (!isset($data['descuento'])) {
                $data['descuento'] = 0;
            }

            // Crear Cabecera
            $orden = Orden::create($data);

            // Crear Detalle si la petición incluyera items (desde la API)
            if (isset($data['items']) && is_array($data['items'])) {
                foreach ($data['items'] as $item) {
                    ItemOrden::create([
                        'id_orden' => $orden->id,
                        'id_producto' => $item['id_producto'],
                        'id_variante' => $item['id_variante'] ?? null,
                        'id_proveedor' => $item['id_proveedor'] ?? null,
                        'cantidad' => $item['cantidad'],
                        'precio_unitario' => $item['precio_unitario'],
                        'subtotal' => $item['cantidad'] * $item['precio_unitario'],
                    ]);
                }
            }

            return $orden;
        });
    }

    /**
     * Actualiza metadatos de una orden (estado, transito, tracking)
     */
    public function updateOrder(Orden $orden, array $data): Orden
    {
        $orden->update($data);
        return $orden;
    }

    /**
     * Elimina una orden (Hard delete)
     */
    public function deleteOrder(Orden $orden): void
    {
        $orden->delete();
    }
}
