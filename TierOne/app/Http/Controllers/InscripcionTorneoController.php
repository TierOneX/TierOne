<?php

namespace App\Http\Controllers;

use App\Models\InscripcionTorneo;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InscripcionTorneoController extends Controller
{
    use ApiResponseTrait;

    /**
     * Display a listing of tournament registrations, filterable by torneo or usuario.
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = InscripcionTorneo::with(['torneo', 'usuario']);

            if ($request->has('id_torneo')) {
                $query->where('id_torneo', $request->query('id_torneo'));
            }
            if ($request->has('id_usuario')) {
                $query->where('id_usuario', $request->query('id_usuario'));
            }

            $inscripciones = $query->get();
            return $this->successResponse($inscripciones, 'Inscripciones obtenidas');
        } catch (\Exception $e) {
            return $this->errorResponse('Error al obtener inscripciones', $e->getMessage());
        }
    }

    /**
     * Register a user in a tournament.
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'id_torneo' => 'required|exists:torneos,id',
                'id_usuario' => 'required|exists:users,id',
                'id_equipo' => 'nullable|integer', // falta tabla equipos en contexto actual?
                'pago_cuota' => 'required|numeric|min:0',
                'estado' => 'nullable|string'
            ]);

            // Verificar si ya está inscrito
            $existe = InscripcionTorneo::where('id_torneo', $validated['id_torneo'])
                ->where('id_usuario', $validated['id_usuario'])
                ->exists();

            if ($existe) {
                return $this->errorResponse('El usuario ya está inscrito en este torneo', 409);
            }

            $inscripcion = InscripcionTorneo::create([
                'id_torneo' => $validated['id_torneo'],
                'id_usuario' => $validated['id_usuario'],
                'id_equipo' => $validated['id_equipo'] ?? null,
                'pago_cuota' => $validated['pago_cuota'],
                'fecha_inscripcion' => now(),
                'estado' => $validated['estado'] ?? 'pendiente' // pendiente, confirmado, pagado
            ]);

            return $this->successResponse($inscripcion, 'Inscripción realizada con éxito', 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->validator->errors());
        } catch (\Exception $e) {
            return $this->errorResponse('Error al realizar inscripción', $e->getMessage());
        }
    }

    /**
     * Cancel a tournament registration.
     * @param string $id
     * @return JsonResponse
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $inscripcion = InscripcionTorneo::findOrFail($id);
            // Lógica de reembolso podría ir aquí
            $inscripcion->delete();
            return $this->successResponse(null, 'Inscripción cancelada');
        } catch (\Exception $e) {
            return $this->errorResponse('Error al cancelar inscripción', $e->getMessage());
        }
    }
}
