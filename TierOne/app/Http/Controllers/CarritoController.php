<?php

namespace App\Http\Controllers;

use App\Models\Carrito;
use App\Models\ItemCarrito;
use App\Models\Producto;
use App\Traits\ApiResponseTrait;
use App\Http\Requests\StoreCarritoRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CarritoController extends Controller
{
    use ApiResponseTrait;

    /**
     * Obtener el carrito del usuario autenticado o especificado
     */
    public function index(Request $request): JsonResponse
    {
        try {
            // Asumiendo que se pasa id_usuario por ahora (en futuro Auth::id())
            $id_usuario = $request->query('id_usuario');

            if (!$id_usuario) {
                return $this->errorResponse('Falta el parámetro id_usuario', 400);
            }

            $carrito = Carrito::with(['items.producto.imagenes'])->where('id_usuario', $id_usuario)->first();

            if (!$carrito) {
                return $this->successResponse(null, 'El usuario no tiene carrito activo');
            }

            return $this->successResponse($carrito, 'Carrito obtenido correctamente');
        } catch (\Exception $e) {
            return $this->errorResponse('Error al obtener el carrito', $e->getMessage());
        }
    }

    /**
     * Agregar un item al carrito
     * @param StoreCarritoRequest $request
     * @return JsonResponse
     */
    public function store(StoreCarritoRequest $request): JsonResponse
    {
        try {
            $validated = $request->validated();

            // 1. Obtener o crear el carrito
            $carrito = Carrito::firstOrCreate(
                ['id_usuario' => $validated['id_usuario']],
                ['subtotal' => 0]
            );

            // 2. Obtener precio del producto/variante
            // Nota: Aquí deberíamos buscar el precio real en la BBDD, no confiar en el request
            $producto = Producto::find($validated['id_producto']);
            $precio = $producto->precio_venta;
            // Si hubiera variante, habría que chequear si tiene sobrecoste o precio distinto

            // 3. Buscar si el item ya existe en el carrito (solo si NO es personalizado)
            $item = null;
            if (!isset($validated['personalizacion_data'])) {
                $item = ItemCarrito::where('id_carrito', $carrito->id)
                    ->where('id_producto', $validated['id_producto'])
                    ->where('id_variante', $validated['id_variante'])
                    ->whereNull('personalizacion_data')
                    ->first();
            }

            if ($item) {
                $item->cantidad += $validated['cantidad'];
                $item->subtotal = $item->cantidad * $precio;
                $item->save();
            } else {
                ItemCarrito::create([
                    'id_carrito' => $carrito->id,
                    'id_producto' => $validated['id_producto'],
                    'id_variante' => $validated['id_variante'],
                    'cantidad' => $validated['cantidad'],
                    'precio_unitario' => $precio,
                    'subtotal' => $precio * $validated['cantidad'],
                    'personalizacion_data' => $validated['personalizacion_data'] ?? null,
                    'fecha_agregado' => now()
                ]);
            }

            // 4. Recalcular total del carrito
            $this->recalcularTotal($carrito);

            // Recargar con relaciones
            $carrito->load('items.producto');

            return $this->successResponse($carrito, 'Producto agregado al carrito', 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->validator->errors());
        } catch (\Exception $e) {
            return $this->errorResponse('Error al agregar item al carrito', $e->getMessage());
        }
    }

    /**
     * Actualizar cantidad de un item
     */
    public function update(Request $request, string $id): JsonResponse
    {
        try {
            // $id es el id del ItemCarrito
            $item = ItemCarrito::findOrFail($id);

            $validated = $request->validate([
                'cantidad' => 'required|integer|min:1'
            ]);

            $item->cantidad = $validated['cantidad'];
            $item->subtotal = $item->cantidad * $item->precio_unitario;
            $item->save();

            $this->recalcularTotal($item->carrito);

            return $this->successResponse($item->carrito->load('items'), 'Cantidad actualizada');

        } catch (\Exception $e) {
            return $this->errorResponse('Error al actualizar item', $e->getMessage());
        }
    }

    /**
     * Eliminar un item del carrito
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $item = ItemCarrito::findOrFail($id);
            $carrito = $item->carrito;

            $item->delete();
            $this->recalcularTotal($carrito);

            return $this->successResponse($carrito->load('items'), 'Item eliminado del carrito');
        } catch (\Exception $e) {
            return $this->errorResponse('Error al eliminar item', $e->getMessage());
        }
    }

    /**
     * Helper para recalcular el subtotal del carrito
     */
    private function recalcularTotal(Carrito $carrito)
    {
        $total = 0;
        foreach ($carrito->items as $item) {
            $recargo = 0;
            if ($item->personalizacion_data) {
                $data = $item->personalizacion_data;
                $recargo = $data['precio_elementos']['total_recargo'] ?? 0;
            }
            $total += ($item->precio_unitario + $recargo) * $item->cantidad;
        }
        $carrito->subtotal = $total;
        $carrito->save();
    }
}
