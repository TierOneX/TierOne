<?php

namespace App\Http\Controllers;

use App\Models\Partida;
use App\Traits\ApiResponseTrait;
use App\Http\Requests\StorePartidaRequest;
use App\Http\Requests\UpdatePartidaRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PartidaController extends Controller
{
    use ApiResponseTrait;


    /**
     * Join a match.
     * @param Request $request
     * @param string $id
     * @return JsonResponse
     */
    public function join(Request $request, string $id): JsonResponse
    {
        try {
            $partida = Partida::with('participantes')->findOrFail($id);

            $validated = $request->validate([
                'id_usuario' => 'required|exists:users,id',
                'equipo_asignado' => 'nullable|string',
            ]);

            // 1. Validar Estado de la Partida
            if ($partida->estado !== 'pendiente') {
                return $this->errorResponse('No te puedes unir a una partida que ya ha comenzado o finalizado.', 400);
            }

            // 2. Validar si ya está unido
            $yaInscrito = $partida->participantes->contains('id_usuario', $validated['id_usuario']);
            if ($yaInscrito) {
                return $this->errorResponse('Ya estás participando en esta partida.', 409);
            }

            // 3. Validar Cupos (Lógica simple basada en tipo)
            $cuposMaximos = $this->obtenerCuposPorTipo($partida->tipo);
            if ($partida->participantes->count() >= $cuposMaximos) {
                return $this->errorResponse('La partida está llena.', 400);
            }

            // 4. (TODO) Validar Saldo del Usuario vs $partida->buy_in
            // Esto se descomentará cuando integremos el sistema de Wallets
            /*
            $user = User::find($validated['id_usuario']);
            if ($user->saldo < $partida->buy_in) {
                 return $this->errorResponse('Saldo insuficiente.', 402);
            }
            */

            // 5. Crear Participación
            $participacion = \App\Models\ParticipantePartida::create([
                'id_partida' => $partida->id,
                'id_usuario' => $validated['id_usuario'],
                'equipo_asignado' => $validated['equipo_asignado'] ?? 'A', // Default team
                'pago_entrada' => $partida->buy_in,
                'confirmado' => true, // O false si requiere aprobación
                'fecha_union' => now(),
            ]);

            return $this->successResponse($participacion, 'Te has unido a la partida correctamente.', 201);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Partida no encontrada');
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->validator->errors());
        } catch (\Exception $e) {
            return $this->errorResponse('Error al unirse a la partida', $e->getMessage());
        }
    }

    /**
     * Helper para determinar cupos
     */
    private function obtenerCuposPorTipo($tipo)
    {
        return match (strtolower($tipo)) {
            '1v1' => 2,
            '2v2' => 4,
            '5v5' => 10,
            default => 100 // Sin limite estricto definido
        };
    }
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
     * @param StorePartidaRequest $request
     * @return JsonResponse
     */
    public function store(StorePartidaRequest $request): JsonResponse
    {
        try {
            $partida = Partida::create($request->validated());
            return $this->successResponse($partida, 'Partida creada correctamente', 201);
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
     * @param UpdatePartidaRequest $request
     * @param string $id
     * @return JsonResponse
     */
    public function update(UpdatePartidaRequest $request, string $id): JsonResponse
    {
        try {
            $partida = Partida::findOrFail($id);
            $partida->update($request->validated());
            return $this->successResponse($partida, 'Partida actualizada correctamente');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Partida no encontrada');
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
