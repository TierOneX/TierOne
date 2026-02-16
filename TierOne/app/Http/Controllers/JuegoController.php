<?php

namespace App\Http\Controllers;

use App\Models\Juego;
use Illuminate\Http\JsonResponse;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\Request;

class JuegoController extends Controller
{
    use ApiResponseTrait;
    /**
     * Summary of index
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        try {
            $juegos = Juego::all();
            return $this->successResponse($juegos, 'Juegos obtenidos correctamente');
        } catch (\Exception $e) {
            return $this->errorResponse('Error al obtener los datos', $e->getMessage());
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
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
                'nombre' => 'required|string|max:255',
                'slug' => 'required|string|max:255|unique:juegos,slug',
                'descripcion' => 'nullable|string',
                'imagen_url' => 'nullable|url|max:255',
                'categoria' => 'required|string|max:50',
                'activo' => 'nullable|boolean',
            ]);
            $juego = Juego::create($validated);
            return $this->successResponse($juego, 'Juego ha sido creado correctamente', 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
<<<<<<< HEAD
            return $this->validationErrorResponse($e->errors());
=======
            return $this->validationErrorResponse($e->validator->errors());
>>>>>>> dev
        } catch (\Exception $e) {
            return $this->errorResponse('Error al crear juego', $e->getMessage());
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
            $juego = Juego::findOrFail($id);
<<<<<<< HEAD
            return $this->successResponse($juego, 'Juego obtenido correctamente', 200);
=======
            return $this->successResponse($juego, 'Juego obtenido correctamente');
>>>>>>> dev
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Juego no encontrado');
        } catch (\Exception $e) {
            return $this->errorResponse('Error al obtener juego', $e->getMessage());
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
            $juego = Juego::findOrFail($id);

            $validated = $request->validate([
                'nombre' => 'sometimes|required|string|max:255',
                'slug' => 'sometimes|required|string|max:255|unique:juegos,slug,' . $id,
                'descripcion' => 'nullable|string',
                'imagen_url' => 'nullable|url|max:255',
                'categoria' => 'sometimes|required|string|max:50',
                'activo' => 'nullable|boolean',
            ]);

            $juego->update($validated);
<<<<<<< HEAD
            return $this->successResponse($juego, 'Juego actualizado correctamente', 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Juego no encontrado');
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
=======
            return $this->successResponse($juego, 'Juego actualizado correctamente');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Juego no encontrado');
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->validator->errors());
>>>>>>> dev
        } catch (\Exception $e) {
            return $this->errorResponse('Error al actualizar juego', $e->getMessage());
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
            $juego = Juego::findOrFail($id);
            $juego->delete();
<<<<<<< HEAD
            return $this->successResponse(null, 'Juego eliminado correctamente', 200);
=======
            return $this->successResponse(null, 'Juego eliminado correctamente');
>>>>>>> dev
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Juego no encontrado');
        } catch (\Exception $e) {
            return $this->errorResponse('Error al eliminar juego', $e->getMessage());
        }
    }
}
