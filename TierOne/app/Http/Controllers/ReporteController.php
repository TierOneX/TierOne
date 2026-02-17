<?php

namespace App\Http\Controllers;

use App\Models\Reporte;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class ReporteController extends Controller
{
    use ApiResponseTrait;

    /**
     * Listar reportes
     * Admin: ve todos.
     * Usuario: ve solo los suyos.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $user = Auth::user();
            $query = Reporte::with(['partida', 'usuarioReporta', 'resueltoPor']);

            // Si no es admin/staff, filtrar por sus propios reportes
            // Asumiendo que hay un campo 'rol' o metodo isAdmin() en User, 
            // si no ajustaremos esta lógica. Por seguridad, filtramos por ID si no es admin.
            // NOTA: Ajustar lógica de roles según implementación real de User.
            if ($user->rol !== 'admin') { 
                $query->where('id_usuario_reporta', $user->id);
            } else {
                // Filtros para admin
                if ($request->has('estado')) {
                    $query->where('estado', $request->query('estado'));
                }
                if ($request->has('tipo')) {
                    $query->where('tipo', $request->query('tipo'));
                }
            }

            $reportes = $query->orderBy('created_at', 'desc')->get();

            return $this->successResponse($reportes, 'Reportes obtenidos');

        } catch (\Exception $e) {
            return $this->errorResponse('Error al obtener reportes', $e->getMessage());
        }
    }

    /**
     * Crear un nuevo reporte
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'id_partida' => 'required|exists:partidas,id',
                'tipo' => 'required|string', // ej: trampa, toxicidad, bug
                'descripcion' => 'required|string|max:1000',
                'evidencia_url' => 'nullable|url'
            ]);

            $reporte = Reporte::create([
                'id_partida' => $validated['id_partida'],
                'id_usuario_reporta' => Auth::id(), // ID del usuario autenticado
                'tipo' => $validated['tipo'],
                'descripcion' => $validated['descripcion'],
                'evidencia_url' => $validated['evidencia_url'] ?? null,
                'estado' => 'pendiente',
                'fecha_reporte' => now()
            ]);

            return $this->successResponse($reporte, 'Reporte enviado correctamente', 201);

        } catch (ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse('Error al crear reporte', $e->getMessage());
        }
    }

    /**
     * Ver detalles de un reporte
     */
    public function show($id): JsonResponse
    {
        try {
            $reporte = Reporte::with(['partida', 'usuarioReporta', 'resueltoPor'])->findOrFail($id);
            $user = Auth::user();

            // Verificar permisos: dueño del reporte o admin
            if ($user->rol !== 'admin' && $reporte->id_usuario_reporta !== $user->id) {
                return $this->errorResponse('No autorizado', null, 403);
            }

            return $this->successResponse($reporte, 'Detalle del reporte');

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Reporte no encontrado');
        } catch (\Exception $e) {
            return $this->errorResponse('Error al ver reporte', $e->getMessage());
        }
    }

    /**
     * Actualizar/Resolver un reporte (Admin)
     */
    public function update(Request $request, $id): JsonResponse
    {
        try {
            // Verificar rol admin
            if (Auth::user()->rol !== 'admin') {
                return $this->errorResponse('No autorizado. Solo administradores pueden resolver reportes.', null, 403);
            }

            $reporte = Reporte::findOrFail($id);

            $validated = $request->validate([
                'estado' => 'required|in:pendiente,en_proceso,resuelto,desestimado',
                'resolucion' => 'nullable|string'
            ]);

            $reporte->update([
                'estado' => $validated['estado'],
                'resolucion' => $validated['resolucion'] ?? $reporte->resolucion,
                'fecha_resolucion' => ($validated['estado'] === 'resuelto' || $validated['estado'] === 'desestimado') ? now() : null,
                'id_resuelto_por' => Auth::id()
            ]);

            return $this->successResponse($reporte, 'Reporte actualizado');

        } catch (ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse('Error al actualizar reporte', $e->getMessage());
        }
    }
}
