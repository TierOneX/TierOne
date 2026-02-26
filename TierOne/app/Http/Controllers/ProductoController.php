<?php

namespace App\Http\Controllers;

use App\Models\Producto;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Http\Requests\StoreProductoRequest;
use App\Http\Requests\UpdateProductoRequest;

class ProductoController extends Controller
{
    use ApiResponseTrait;

    /**
     * Display a listing of the resource.
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        try {
            // Eager load relationships for efficiency
            $productos = Producto::with(['categoria', 'proveedor', 'imagenes', 'variantes'])->get();
            return $this->successResponse($productos, 'Productos obtenidos correctamente');
        } catch (\Exception $e) {
            return $this->errorResponse('Error al obtener los productos', $e->getMessage());
        }
    }

    /**
     * Store a newly created resource in storage.
     * @param StoreProductoRequest $request
     * @return JsonResponse
     */
    public function store(StoreProductoRequest $request): JsonResponse
    {
        try {
            $validated = $request->validated();

            $producto = Producto::create($validated);

            // Reload with relations to return full object (optional but nice)
            $producto->load(['categoria', 'proveedor']);

            return $this->successResponse($producto, 'Producto creado correctamente', 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->validator->errors());
        } catch (\Exception $e) {
            return $this->errorResponse('Error al crear el producto', $e->getMessage());
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
            $producto = Producto::with(['categoria', 'proveedor', 'imagenes', 'variantes', 'reviews'])->findOrFail($id);
            return $this->successResponse($producto, 'Producto obtenido correctamente');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Producto no encontrado');
        } catch (\Exception $e) {
            return $this->errorResponse('Error al obtener the product', $e->getMessage());
        }
    }

    /**
     * Update the specified resource in storage.
     * @param UpdateProductoRequest $request
     * @param string $id
     * @return JsonResponse
     */
    public function update(UpdateProductoRequest $request, string $id): JsonResponse
    {
        try {
            $producto = Producto::findOrFail($id);
            $validated = $request->validated();
            $producto->update($validated);
            $producto->load(['categoria', 'proveedor']);
            return $this->successResponse($producto, 'Producto actualizado correctamente');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Producto no encontrado');
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->validator->errors());
        } catch (\Exception $e) {
            return $this->errorResponse('Error al actualizar el producto', $e->getMessage());
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
            $producto = Producto::findOrFail($id);
            $producto->delete();
            return $this->successResponse(null, 'Producto eliminado correctamente');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Producto no encontrado');
        } catch (\Exception $e) {
            return $this->errorResponse('Error al eliminar el producto', $e->getMessage());
        }
    }
}
