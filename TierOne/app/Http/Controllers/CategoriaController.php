<?php

namespace App\Http\Controllers;

use App\Models\Categoria;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

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
    public function create()
    {

    }

    /**
     * Summary of store
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'id_parent' => 'nullable|integer|exists:categorias,id',
                'nombre' => 'required|string|max:255',
                'slug' => 'required|string|max:255|unique:categorias,slug',
                'descripcion' => 'nullable|string',
                'activa' => 'nullable|boolean',
            ]);

            $categoria = Categoria::create($validated);
            return $this->successResponse($categoria, 'Categoría creada correctamente', 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->validator->errors());
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
            return $this->errorResponse('Error al obtener categoría', $e->getMessage());
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Summary of update
     * @param Request $request
     * @param string $id
     * @return JsonResponse
     */
    public function update(Request $request, string $id): JsonResponse
    {
        try {
            $categoria = Categoria::findOrFail($id);

            $validated = $request->validate([
                'id_parent' => 'nullable|integer|exists:categorias,id',
                'nombre' => 'sometimes|required|string|max:255',
                'slug' => 'sometimes|required|string|max:255|unique:categorias,slug,' . $id,
                'descripcion' => 'nullable|string',
                'activa' => 'nullable|boolean',
            ]);

            $categoria->update($validated);
            return $this->successResponse($categoria, 'Categoría actualizada correctamente');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Categoría no encontrada');
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->validator->errors());
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
