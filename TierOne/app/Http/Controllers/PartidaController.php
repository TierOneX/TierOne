<?php

namespace App\Http\Controllers;

use App\Models\Partida;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PartidaController extends Controller
{
    use ApiResponseTrait;

    /**
     * Display a listing of the resource.
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        try {
            $partidas = Partida::with(['juego', 'creador', 'participantes'])->get();
            return $this->successResponse($partidas, 'Partidas obtenidas correctamente');
        } catch (\Exception $e) {
            return $this->errorResponse('Error al obtener las partidas', $e->getMessage());
        }
    }

    /**
     * Store a newly created resource in storage.
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'id_juego' => 'required|exists:juegos,id',
                'id_creador' => 'required|exists:users,id',
                'titulo' => 'required|string|max:255',
                'tipo' => 'required|string', // e.g., '1v1', '5v5'
                'buy_in' => 'required|numeric|min:0',
                'premio_total' => 'required|numeric|min:0',
                'comision_plataforma' => 'required|numeric|min:0',
                'fecha_inicio' => 'nullable|date', // Can be instant
                'fecha_fin' => 'nullable|date|after:fecha_inicio',
                'estado' => 'required|string', // pendiente, en_curso, finalizada
                'origen' => 'required|string', // web, app, api
                'partida_api_id' => 'nullable|string',
                'datos_api_json' => 'nullable|array',
            ]);

            $partida = Partida::create($validated);
            return $this->successResponse($partida, 'Partida creada correctamente', 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->validator->errors());
        } catch (\Exception $e) {
            return $this->errorResponse('Error al crear la partida', $e->getMessage());
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
            $partida = Partida::with(['juego', 'creador', 'participantes.usuario'])->findOrFail($id);
            return $this->successResponse($partida, 'Partida obtenida correctamente');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Partida no encontrada');
        } catch (\Exception $e) {
            return $this->errorResponse('Error al obtener la partida', $e->getMessage());
        }
    }

    /**
     * Update the specified resource in storage.
     * @param Request $request
     * @param string $id
     * @return JsonResponse
     */
    public function update(Request $request, string $id): JsonResponse
    {
        try {
            $partida = Partida::findOrFail($id);

            $validated = $request->validate([
                'id_juego' => 'sometimes|exists:juegos,id',
                'titulo' => 'sometimes|string|max:255',
                'estado' => 'sometimes|string',
                'fecha_fin' => 'nullable|date',
                'premio_total' => 'sometimes|numeric',
                'datos_api_json' => 'nullable|array',
            ]);

            $partida->update($validated);
            return $this->successResponse($partida, 'Partida actualizada correctamente');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Partida no encontrada');
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->validator->errors());
        } catch (\Exception $e) {
            return $this->errorResponse('Error al actualizar la partida', $e->getMessage());
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
            $partida = Partida::findOrFail($id);
            $partida->delete();
            return $this->successResponse(null, 'Partida eliminada correctamente');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Partida no encontrada');
        } catch (\Exception $e) {
            return $this->errorResponse('Error al eliminar la partida', $e->getMessage());
        }
    }
}
