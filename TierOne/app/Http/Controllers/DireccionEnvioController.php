<?php

namespace App\Http\Controllers;

use App\Models\DireccionEnvio;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DireccionEnvioController extends Controller
{
    use ApiResponseTrait;

    public function index(Request $request): JsonResponse
    {
        try {
            // Filtrar por usuario
            $id_usuario = $request->query('id_usuario');
            if (!$id_usuario)
                return $this->errorResponse('Falta parametro id_usuario', 400);

            $direcciones = DireccionEnvio::where('id_usuario', $id_usuario)->get();
            return $this->successResponse($direcciones, 'Direcciones obtenidas correctamente');
        } catch (\Exception $e) {
            return $this->errorResponse('Error al obtener direcciones', $e->getMessage());
        }
    }

    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'id_usuario' => 'required|exists:users,id',
                'nombre_completo' => 'required|string|max:255',
                'direccion_linea1' => 'required|string|max:255',
                'ciudad' => 'required|string|max:100',
                'estado_provincia' => 'nullable|string|max:100',
                'codigo_postal' => 'required|string|max:20',
                'pais' => 'required|string|max:100',
                'telefono' => 'required|string|max:20',
                'predeterminada' => 'boolean'
            ]);

            // Si se marca como predeterminada, desmarcar las otras del usuario
            if (!empty($validated['predeterminada']) && $validated['predeterminada']) {
                DireccionEnvio::where('id_usuario', $validated['id_usuario'])->update(['predeterminada' => false]);
            }

            $direccion = DireccionEnvio::create($validated);
            return $this->successResponse($direccion, 'Dirección creada correctamente', 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->validator->errors());
        } catch (\Exception $e) {
            return $this->errorResponse('Error al crear dirección', $e->getMessage());
        }
    }

    public function show(string $id): JsonResponse
    {
        try {
            $direccion = DireccionEnvio::findOrFail($id);
            return $this->successResponse($direccion, 'Dirección obtenida');
        } catch (\Exception $e) {
            return $this->errorResponse('Error al obtener dirección', $e->getMessage());
        }
    }

    public function update(Request $request, string $id): JsonResponse
    {
        try {
            $direccion = DireccionEnvio::findOrFail($id);

            $validated = $request->validate([
                'nombre_completo' => 'sometimes|string',
                'direccion_linea1' => 'sometimes|string',
                'ciudad' => 'sometimes|string',
                'estado_provincia' => 'nullable|string',
                'codigo_postal' => 'sometimes|string',
                'pais' => 'sometimes|string',
                'telefono' => 'sometimes|string',
                'predeterminada' => 'boolean'
            ]);

            if (isset($validated['predeterminada']) && $validated['predeterminada']) {
                DireccionEnvio::where('id_usuario', $direccion->id_usuario)
                    ->where('id', '!=', $id)
                    ->update(['predeterminada' => false]);
            }

            $direccion->update($validated);
            return $this->successResponse($direccion, 'Dirección actualizada');

        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->validator->errors());
        } catch (\Exception $e) {
            return $this->errorResponse('Error al actualizar dirección', $e->getMessage());
        }
    }

    public function destroy(string $id): JsonResponse
    {
        try {
            $direccion = DireccionEnvio::findOrFail($id);
            $direccion->delete();
            return $this->successResponse(null, 'Dirección eliminada');
        } catch (\Exception $e) {
            return $this->errorResponse('Error al eliminar dirección', $e->getMessage());
        }
    }
}
