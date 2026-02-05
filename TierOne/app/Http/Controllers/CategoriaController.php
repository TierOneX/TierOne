<?php

namespace App\Http\Controllers;

use App\Models\Categoria;
use App\Traits\ApiResponseTrait;
use App\Http\Requests\StoreCategoriaRequest;
use App\Http\Requests\UpdateCategoriaRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CategoriaController extends Controller
{
    use ApiResponseTrait;
    /**
     * Summary of index
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        try {
            $categorias = Categoria::all();
            return $this->successResponse($categorias, 'Categorías obtenidas correctamente');
        } catch (\Exception $e) {
            return $this->errorResponse('Error al obtener los datos', $e->getMessage());
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    // Metodo create eliminado

    /**
     * Summary of store
     * @param Request $request
     * @return JsonResponse
     */
    /**
     * Summary of store
     * @param StoreCategoriaRequest $request
     * @return JsonResponse
     */
    public function store(StoreCategoriaRequest $request): JsonResponse
    {
        try {
            $categoria = Categoria::create($request->validated());
            return $this->successResponse($categoria, 'Categoría creada correctamente', 201);
        } catch (\Exception $e) {
            return $this->errorResponse('Error al crear la categoría', $e->getMessage());
        }
    }

    /**
     * Summary of show
     * @param string $id
     * @return JsonResponse
     */
    public function show(string $id): JsonResponse
    {
        try {
            $categoria = Categoria::findOrFail($id);
            return $this->successResponse($categoria, 'Categoria obtenida correctamente');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Categoría no encontrada');
        } catch (\Exception $e) {
            return $this->errorResponse('Error al obtener categorías', $e->getMessage());
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    // Metodo edit eliminado

    /**
     * Summary of update
     * @param Request $request
     * @param string $id
     * @return JsonResponse
     */
    /**
     * Summary of update
     * @param UpdateCategoriaRequest $request
     * @param string $id
     * @return JsonResponse
     */
    public function update(UpdateCategoriaRequest $request, string $id): JsonResponse
    {
        try {
            $categoria = Categoria::findOrFail($id);
            $categoria->update($request->validated());
            return $this->successResponse($categoria, 'Categoría actualizada correctamente');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Categoría no encontrada');
        } catch (\Exception $e) {
            return $this->errorResponse('Error al actualizar la categoría', $e->getMessage());
        }
    }

    /**
     * Summary of destroy
     * @param string $id
     * @return JsonResponse
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $categoria = Categoria::findOrFail($id);
            $categoria->delete();
            return $this->successResponse(null, 'Categoría eliminada correctamente');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Categoría no encontrada');
        } catch (\Exception $e) {
            return $this->errorResponse('Error al eliminar categoría', $e->getMessage());
        }
    }
}
