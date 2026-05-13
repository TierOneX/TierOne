<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;

use App\Models\Orden;
use App\Services\OrderService;
use App\Traits\ApiResponseTrait;
use App\Http\Requests\StoreOrdenRequest;
use App\Http\Requests\UpdateOrdenRequest;
use Illuminate\Http\JsonResponse;

class OrderController extends Controller
{
    use ApiResponseTrait;

    public function __construct(
        protected OrderService $orderService
    ) {}

    /**
     * Display a listing of the resource.
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        try {
            $user = auth()->user();
            if ($user->rol === 'admin') {
                $ordenes = $this->orderService->getAllOrders();
            } else {
                $ordenes = Orden::where('id_usuario', $user->id)
                    ->with(['usuario', 'items.producto', 'direccionEnvio'])
                    ->get();
            }
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
            $orden = $this->orderService->createOrder($validated);

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
            $orden = $this->orderService->getOrderById($id);
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
            $orden = $this->orderService->updateOrder($orden, $request->validated());
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
            $this->orderService->deleteOrder($orden);
            return $this->successResponse(null, 'Orden eliminada correctamente');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Orden no encontrada');
        } catch (\Exception $e) {
            return $this->errorResponse('Error al eliminar la orden', $e->getMessage());
        }
    }
}

