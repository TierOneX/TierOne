<?php

namespace App\Http\Controllers;

use App\Models\Torneo;
use App\Traits\ApiResponseTrait;
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
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'id_juego' => 'required|exists:juegos,id',
                'id_organizador' => 'required|exists:users,id',
                'nombre' => 'required|string|max:255',
                'descripcion' => 'required|string',
                'imagen_banner' => 'required|string|max:255', // En producción sería validación de upload
                'formato' => 'required|in:eliminacion_simple,doble_eliminacion,round_robin,swiss',
                'max_participantes' => 'required|integer|min:2',
                'cuota_inscripcion' => 'required|numeric|min:0',
                'premio_total' => 'required|numeric|min:0',
                'comision_plataforma_porcentaje' => 'required|numeric|min:0|max:100',
                'es_gratuito' => 'required|boolean',
                'fecha_inicio' => 'required|date',
                'fecha_fin' => 'required|date|after:fecha_inicio',
                'cierre_inscripciones' => 'required|date|before:fecha_inicio',
                'estado' => 'required|in:inscripciones,en_curso,finalizado,cancelado',
                'reglas_url' => 'required|url',
                'stream_url' => 'required|url',
                'verificado' => 'required|boolean',
            ]);

            $torneo = Torneo::create($validated);
            return $this->successResponse($torneo, 'Torneo creado correctamente', 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->validator->errors());
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
     * @param Request $request
     * @param string $id
     * @return JsonResponse
     */
    public function update(Request $request, string $id): JsonResponse
    {
        try {
            $torneo = Torneo::findOrFail($id);

            $validated = $request->validate([
                'id_juego' => 'sometimes|exists:juegos,id',
                'id_organizador' => 'sometimes|exists:users,id',
                'nombre' => 'sometimes|string|max:255',
                'descripcion' => 'sometimes|string',
                'imagen_banner' => 'sometimes|string',
                'formato' => 'sometimes|in:eliminacion_simple,doble_eliminacion,round_robin,swiss',
                'max_participantes' => 'sometimes|integer|min:2',
                'cuota_inscripcion' => 'sometimes|numeric|min:0',
                'premio_total' => 'sometimes|numeric|min:0',
                'comision_plataforma_porcentaje' => 'sometimes|numeric|min:0|max:100',
                'es_gratuito' => 'sometimes|boolean',
                'fecha_inicio' => 'sometimes|date',
                'fecha_fin' => 'sometimes|date|after:fecha_inicio',
                'cierre_inscripciones' => 'sometimes|date|before:fecha_inicio',
                'estado' => 'sometimes|in:inscripciones,en_curso,finalizado,cancelado',
                'reglas_url' => 'sometimes|url',
                'stream_url' => 'sometimes|url',
                'verificado' => 'sometimes|boolean',
            ]);

            $torneo->update($validated);
            return $this->successResponse($torneo, 'Torneo actualizado correctamente');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Torneo no encontrado');
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->validator->errors());
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
