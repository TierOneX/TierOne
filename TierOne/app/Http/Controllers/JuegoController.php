<?php

namespace App\Http\Controllers;

use App\Models\Juego;
use Illuminate\Http\JsonResponse;
use App\Traits\ApiResponseTrait;
use App\Http\Requests\StoreJuegoRequest;
use App\Http\Requests\UpdateJuegoRequest;
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
    // Metodo create eliminado

    /**
     * Summary of store
     * @param Request $request
     * @return JsonResponse
     */
    /**
     * Summary of store
     * @param StoreJuegoRequest $request
     * @return JsonResponse
     */
    public function store(StoreJuegoRequest $request): JsonResponse
    {
        try {
            $juego = Juego::create($request->validated());
            return $this->successResponse($juego, 'Juego ha sido creado correctamente', 201);
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
            return $this->successResponse($juego, 'Juego obtenido correctamente', 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Juego no encontrado');
        } catch (\Exception $e) {
            return $this->errorResponse('Error al obtener juego', $e->getMessage());
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
     * @param UpdateJuegoRequest $request
     * @param string $id
     * @return JsonResponse
     */
    public function update(UpdateJuegoRequest $request, string $id)
    {
        try {
            $juego = Juego::findOrFail($id);
            $juego->update($request->validated());
            return $this->successResponse($juego, 'Juego actualizado correctamente', 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Juego no encontrado');
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
            return $this->successResponse(null, 'Juego eliminado correctamente', 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Juego no encontrado');
        } catch (\Exception $e) {
            return $this->errorResponse('Error al eliminar juego', $e->getMessage());
        }
    }
}
