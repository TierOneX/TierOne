<?php

namespace App\Http\Controllers;

use App\Models\Reporte;
use App\Models\User;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Validation\ValidationException;

class ReporteController extends Controller
{
    use ApiResponseTrait;

    /**
     * Listar reportes
     * Admin: ve todos.
     * Usuario: ve solo los suyos.
     * Soporta respuesta Inertia (Panel) o JSON (API).
     */
    public function index(Request $request)
    {
        try {
            // Si la ruta pertenece al panel o no espera JSON, devolvemos Inertia
            if (!$request->wantsJson()) {
                $filters = $request->only(['id_partida', 'id_usuario_reporta', 'id_resuelto_por', 'tipo', 'estado', 'fecha_desde', 'fecha_hasta', 'search', 'sort_by', 'sort_dir']);
                $sortBy = $request->input('sort_by', 'fecha_reporte');
                $sortDir = $request->input('sort_dir', 'desc');

                $sortMap = [
                    'fecha' => 'fecha_reporte'
                ];

                $orderCol = $sortMap[$sortBy] ?? 'fecha_reporte';

                return Inertia::render('PanelAdminEcommerce/Reports', [
                    'reportes' => Reporte::with(['usuarioReporta', 'resueltoPor'])
                        ->when($filters['search'] ?? null, function ($q, $v) {
                            $q->where(function ($sq) use ($v) {
                                $sq->where('id', 'like', "%$v%")
                                    ->orWhere('tipo', 'like', "%$v%")
                                    ->orWhere('descripcion', 'like', "%$v%")
                                    ->orWhere('resolucion', 'like', "%$v%");
                            });
                        })
                        ->when($filters['id_partida'] ?? null, fn($q, $v) => $q->where('id_partida', $v))
                        ->when($filters['id_usuario_reporta'] ?? null, fn($q, $v) => $q->where('id_usuario_reporta', $v))
                        ->when($filters['id_resuelto_por'] ?? null, fn($q, $v) => $q->where('id_resuelto_por', $v))
                        ->when($filters['tipo'] ?? null, fn($q, $v) => $q->where('tipo', $v))
                        ->when($filters['estado'] ?? null, fn($q, $v) => $q->where('estado', $v))
                        ->when($filters['fecha_desde'] ?? null, fn($q, $v) => $q->whereDate('fecha_reporte', '>=', $v))
                        ->when($filters['fecha_hasta'] ?? null, fn($q, $v) => $q->whereDate('fecha_reporte', '<=', $v))
                        ->orderBy($orderCol, $sortDir)
                        ->get()
                        ->map(fn($r) => [
                            'id' => $r->id,
                            'id_partida' => $r->id_partida,
                            'tipo' => $r->tipo,
                            'descripcion' => $r->descripcion,
                            'estado' => $r->estado,
                            'fecha_reporte' => $r->fecha_reporte?->format('d/m/Y H:i'),
                            'fecha_resolucion' => $r->fecha_resolucion?->format('d/m/Y H:i'),
                            'resolucion' => $r->resolucion,
                            'evidencia_url' => $r->evidencia_url,
                            'usuario_reporta' => $r->usuarioReporta?->name ?? 'Sistema',
                            'resuelto_por' => $r->resueltoPor?->name ?? 'Pendiente',
                            'id_resuelto_por' => $r->id_resuelto_por,
                        ]),
                    'stats' => [
                        'total_reportes' => Reporte::count(),
                        'reportes_abiertos' => Reporte::whereIn('estado', ['pendiente', 'en_revision'])->count(),
                    ],
                    'admins' => User::where('rol', 'admin')->get(['id', 'nombre as name']),
                    'usuarios' => User::all(['id', 'nombre as name', 'email']),
                    'filters' => $filters
                ]);
            }

            // Lógica para API JSON
            $user = Auth::user();
            $query = Reporte::with(['partida', 'usuarioReporta', 'resueltoPor']);

            if ($user->rol !== 'admin') {
                $query->where('id_usuario_reporta', $user->id);
            } else {
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
            return $request->wantsJson()
                ? $this->errorResponse('Error al obtener reportes', $e->getMessage())
                : back()->withErrors(['message' => 'Error al obtener reportes: ' . $e->getMessage()]);
        }
    }

    /**
     * Crear un nuevo reporte
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'id_partida' => $request->wantsJson() ? 'required|exists:partidas,id' : 'required|integer',
                'tipo' => 'required|string|max:100',
                'descripcion' => 'required|string',
                'evidencia_url' => 'nullable' . ($request->wantsJson() ? '|url' : ''),
                'id_usuario_reporta' => $request->wantsJson() ? 'nullable|exists:users,id' : 'required|exists:users,id',
            ]);

            $reporteData = [
                'id_partida' => $validated['id_partida'],
                'id_usuario_reporta' => $validated['id_usuario_reporta'] ?? Auth::id(),
                'tipo' => $validated['tipo'],
                'descripcion' => $validated['descripcion'],
                'evidencia_url' => $validated['evidencia_url'] ?? null,
                'estado' => 'pendiente',
                'fecha_reporte' => now()
            ];

            $reporte = Reporte::create($reporteData);

            if ($request->wantsJson()) {
                return $this->successResponse($reporte, 'Reporte enviado correctamente', 201);
            }

            return redirect()->back()->with('success', 'Reporte creado correctamente');

        } catch (ValidationException $e) {
            return $request->wantsJson()
                ? $this->validationErrorResponse($e->errors())
                : back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            return $request->wantsJson()
                ? $this->errorResponse('Error al crear reporte', $e->getMessage())
                : back()->withErrors(['message' => 'Error al crear reporte: ' . $e->getMessage()]);
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
    public function update(Request $request, $id)
    {
        try {
            if (Auth::user()->rol !== 'admin') {
                return $request->wantsJson()
                    ? $this->errorResponse('No autorizado', null, 403)
                    : back()->withErrors(['message' => 'No autorizado']);
            }

            $reporte = Reporte::findOrFail($id);

            $validated = $request->validate([
                'estado' => 'required|in:pendiente,en_revision,en_proceso,resuelta,resuelto,desestimada,desestimado',
                'resolucion' => 'nullable|string',
                'id_resuelto_por' => 'nullable|exists:users,id',
            ]);

            // Normalizar estados si es necesario (ej: resuelta vs resuelto)
            $estado = $validated['estado'];
            if ($estado === 'resuelta')
                $estado = 'resuelto';
            if ($estado === 'desestimada')
                $estado = 'desestimado';
            if ($estado === 'en_revision')
                $estado = 'en_proceso';

            $reporte->update([
                'estado' => $estado,
                'resolucion' => $validated['resolucion'] ?? $reporte->resolucion,
                'fecha_resolucion' => in_array($estado, ['resuelto', 'desestimado']) ? now() : null,
                'id_resuelto_por' => $validated['id_resuelto_por'] ?? Auth::id()
            ]);

            return $request->wantsJson()
                ? $this->successResponse($reporte, 'Reporte actualizado')
                : back()->with('success', 'Reporte actualizado correctamente');

        } catch (ValidationException $e) {
            return $request->wantsJson()
                ? $this->validationErrorResponse($e->errors())
                : back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            return $request->wantsJson()
                ? $this->errorResponse('Error al actualizar reporte', $e->getMessage())
                : back()->withErrors(['message' => 'Error al actualizar reporte: ' . $e->getMessage()]);
        }
    }
}
