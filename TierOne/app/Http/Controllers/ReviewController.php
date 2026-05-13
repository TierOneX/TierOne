<?php

namespace App\Http\Controllers;

use App\Models\Review;
use App\Traits\ApiResponseTrait;
use App\Http\Requests\StoreReviewRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReviewController extends Controller
{
    use ApiResponseTrait;

    /**
     * Display a listing of reviews, filterable by product or user.
     * Soporta respuesta Inertia (Panel) o JSON (API).
     */
    public function index(Request $request)
    {
        try {
            if (!$request->wantsJson()) {
                $filters = $request->only(['search', 'calificacion', 'verificado', 'sort_by', 'sort_dir']);
                $sortBy = $request->input('sort_by', 'created_at');
                $sortDir = $request->input('sort_dir', 'desc');

                $sortMap = [
                    'fecha' => 'created_at',
                    'calificacion' => 'calificacion'
                ];

                $orderCol = $sortMap[$sortBy] ?? 'created_at';

                $reviews = Review::with(['producto', 'usuario'])
                    ->when($filters['search'] ?? null, function ($q, $v) {
                        $q->where('comentario', 'like', "%$v%")
                            ->orWhereHas('producto', fn($sq) => $sq->where('nombre', 'like', "%$v%"))
                            ->orWhereHas('usuario', fn($sq) => $sq->where('nombre', 'like', "%$v%"));
                    })
                    ->when($filters['calificacion'] ?? null, fn($q, $v) => $q->where('calificacion', $v))
                    ->when($filters['verificado'] ?? null, fn($q, $v) => $q->where('verificado_compra', $v === '1'))
                    ->orderBy($orderCol, $sortDir)
                    ->paginate(15)
                    ->withQueryString()
                    ->through(fn($r) => [
                        'id' => $r->id,
                        'producto' => $r->producto?->nombre,
                        'usuario' => $r->usuario?->nombre,
                        'calificacion' => $r->calificacion,
                        'comentario' => $r->comentario,
                        'verificado' => $r->verificado_compra,
                        'fecha' => $r->created_at?->format('d/m/Y H:i'),
                    ]);

                return Inertia::render('PanelAdminEcommerce/Reviews', [
                    'reviews' => $reviews,
                    'filters' => $filters
                ]);
            }

            // Lógica API JSON
            $query = Review::with('usuario');

            if ($request->has('id_producto')) {
                $query->where('id_producto', $request->query('id_producto'));
            }
            if ($request->has('id_usuario')) {
                $query->where('id_usuario', $request->query('id_usuario'));
            }

            $reviews = $query->latest()->get();
            return $this->successResponse($reviews, 'Reviews obtenidas');

        } catch (\Exception $e) {
            return $request->wantsJson()
                ? $this->errorResponse('Error al obtener reviews', $e->getMessage())
                : back()->withErrors(['message' => 'Error al obtener reviews: ' . $e->getMessage()]);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreReviewRequest $request)
    {
        try {
            $review = Review::create($request->validated());

            if ($request->wantsJson()) {
                return $this->successResponse($review, 'Review creada', 201);
            }

            return redirect()->back()->with('success', 'Review creada correctamente.');
        } catch (\Exception $e) {
            return $request->wantsJson()
                ? $this->errorResponse('Error al crear review', $e->getMessage())
                : back()->withErrors(['message' => 'Error al crear review: ' . $e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        try {
            $review = Review::findOrFail($id);
            return $this->successResponse($review, 'Review obtenida');
        } catch (\Exception $e) {
            return $this->errorResponse('Error al obtener review', $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $review = Review::findOrFail($id);
            $review->delete();

            if (request()->wantsJson()) {
                return $this->successResponse(null, 'Review eliminada');
            }

            return redirect()->back()->with('success', 'Review eliminada correctamente.');
        } catch (\Exception $e) {
            return request()->wantsJson()
                ? $this->errorResponse('Error al eliminar review', $e->getMessage())
                : back()->withErrors(['message' => 'Error al eliminar review: ' . $e->getMessage()]);
        }
    }
}
