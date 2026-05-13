<?php

namespace App\Http\Controllers;

use App\Models\Torneo;
use App\Traits\ApiResponseTrait;
use App\Http\Requests\StoreTorneoRequest;
use App\Http\Requests\UpdateTorneoRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TorneoController extends Controller
{
    use ApiResponseTrait;

    /**
     * Display a listing of the resource.
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        try {
            $torneos = Torneo::with(['juego', 'organizador', 'sponsors'])->get();
            return $this->successResponse($torneos, 'Torneos obtenidos correctamente');
        } catch (\Exception $e) {
            return $this->errorResponse('Error al obtener los torneos', $e->getMessage());
        }
    }

    /**
     * Store a newly created resource in storage.
     * @param StoreTorneoRequest $request
     * @return JsonResponse
     */
    public function store(StoreTorneoRequest $request): JsonResponse
    {
        try {
            $torneo = Torneo::create($request->validated());
            return $this->successResponse($torneo, 'Torneo creado correctamente', 201);
        } catch (\Exception $e) {
            return $this->errorResponse('Error al crear el torneo', $e->getMessage());
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
            $torneo = Torneo::with(['juego', 'organizador', 'sponsors', 'premios', 'partidas'])->findOrFail($id);
            return $this->successResponse($torneo, 'Torneo obtenido correctamente');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Torneo no encontrado');
        } catch (\Exception $e) {
            return $this->errorResponse('Error al obtener el torneo', $e->getMessage());
        }
    }

    /**
     * Update the specified resource in storage.
     * @param UpdateTorneoRequest $request
     * @param string $id
     * @return JsonResponse
     */
    public function update(UpdateTorneoRequest $request, string $id): JsonResponse
    {
        try {
            $torneo = Torneo::findOrFail($id);
            $torneo->update($request->validated());
            return $this->successResponse($torneo, 'Torneo actualizado correctamente');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Torneo no encontrado');
        } catch (\Exception $e) {
            return $this->errorResponse('Error al actualizar el torneo', $e->getMessage());
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
            $torneo = Torneo::findOrFail($id);
            $torneo->delete();
            return $this->successResponse(null, 'Torneo eliminado correctamente');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Torneo no encontrado');
        } catch (\Exception $e) {
            return $this->errorResponse('Error al eliminar el torneo', $e->getMessage());
        }
    }
}
