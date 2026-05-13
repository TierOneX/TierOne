<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;

use App\Models\Producto;
use App\Services\ProductService;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Http\Requests\StoreProductoRequest;
use App\Http\Requests\UpdateProductoRequest;

class ProductController extends Controller
{
    use ApiResponseTrait;

    public function __construct(
        protected ProductService $productService
    ) {}

    /**
     * Display a listing of the resource.
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        try {
            $productos = $this->productService->getAllProducts();
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
            $producto = $this->productService->createProduct($validated, $request->file('imagen_archivo'));
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
            $producto = $this->productService->getProductById($id);
            return $this->successResponse($producto, 'Producto obtenido correctamente');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Producto no encontrado');
        } catch (\Exception $e) {
            return $this->errorResponse('Error al obtener el producto', $e->getMessage());
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
            
            $producto = $this->productService->updateProduct($producto, $validated, $request->file('imagen_archivo'));
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
            $this->productService->deleteProduct($producto);
            return $this->successResponse(null, 'Producto eliminado correctamente');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Producto no encontrado');
        } catch (\Exception $e) {
            return $this->errorResponse('Error al eliminar el producto', $e->getMessage());
        }
    }
}

