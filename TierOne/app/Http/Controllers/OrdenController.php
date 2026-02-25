<?php

namespace App\Http\Controllers;

use App\Models\Orden;
use App\Models\ItemOrden;
use App\Traits\ApiResponseTrait;
use App\Http\Requests\StoreOrdenRequest;
use App\Http\Requests\UpdateOrdenRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrdenController extends Controller
{
    use ApiResponseTrait;

    /**
     * Display a listing of the resource.
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        try {
            $ordenes = Orden::with(['usuario', 'items', 'direccionEnvio'])->get();
            return $this->successResponse($ordenes, 'Órdenes obtenidas correctamente');
        } catch (\Exception $e) {
            return $this->errorResponse('Error al obtener las órdenes', $e->getMessage());
        }
    }

    /**
     * Store a newly created resource in storage.
     * @param StoreOrdenRequest $request
     * @return JsonResponse
     */
    public function store(StoreOrdenRequest $request): JsonResponse
    {
        try {
            $validated = $request->validated();

            $orden = DB::transaction(function () use ($validated) {
                // 1. Crear la cabecera de la orden
                $orden = Orden::create($validated);

                // 2. Crear los detalles (Items)
                foreach ($validated['items'] as $item) {
                    ItemOrden::create([
                        'id_orden' => $orden->id,
                        'id_producto' => $item['id_producto'],
                        'id_variante' => $item['id_variante'] ?? null,
                        'id_proveedor' => $item['id_proveedor'],
                        'cantidad' => $item['cantidad'],
                        'precio_unitario' => $item['precio_unitario'],
                        'subtotal' => $item['cantidad'] * $item['precio_unitario'],
                    ]);
                }

                return $orden;
            });

            return $this->successResponse($orden, 'Orden creada correctamente', 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->validator->errors());
        } catch (\Exception $e) {
            return $this->errorResponse('Error al crear la orden', $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     * @param string $id
     * @return JsonResponse
     */
    public function show(string $id): JsonResponse
    {
        try {
            $orden = Orden::with(['usuario', 'items.producto', 'direccionEnvio', 'transacciones', 'canceladoPor'])->findOrFail($id);
            return $this->successResponse($orden, 'Orden obtenida correctamente');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Orden no encontrada');
        } catch (\Exception $e) {
            return $this->errorResponse('Error al obtener la orden', $e->getMessage());
        }
    }

    /**
     * Update the specified resource in storage.
     * @param UpdateOrdenRequest $request
     * @param string $id
     * @return JsonResponse
     */
    public function update(UpdateOrdenRequest $request, string $id): JsonResponse
    {
        try {
            $orden = Orden::findOrFail($id);
            $orden->update($request->validated());
            return $this->successResponse($orden, 'Orden actualizada correctamente');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Orden no encontrada');
        } catch (\Exception $e) {
            return $this->errorResponse('Error al actualizar la orden', $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     * @param string $id
     * @return JsonResponse
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $orden = Orden::findOrFail($id);
            $orden->delete();
            return $this->successResponse(null, 'Orden eliminada correctamente');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Orden no encontrada');
        } catch (\Exception $e) {
            return $this->errorResponse('Error al eliminar la orden', $e->getMessage());
        }
    }
}
