<?php

namespace App\Http\Controllers;

use App\Models\Review;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReviewController extends Controller
{
    /**
     * Lista todas las reviews para moderación.
     */
    public function index(Request $request)
    {
        $filters = $request->only(['search', 'calificacion', 'verificado', 'sort_by', 'sort_dir']);
        $sortBy = $request->input('sort_by', 'created_at');
        $sortDir = $request->input('sort_dir', 'desc');

        $sortMap = [
            'fecha' => 'created_at',
            'calificacion' => 'calificacion'
        ];

        $orderCol = $sortMap[$sortBy] ?? 'created_at';

        $reviews = Review::with(['producto', 'usuario'])
            ->when($filters['search'] ?? null, function($q, $v) {
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

    /**
     * Elimina una review (moderación).
     */
    public function destroy(Review $review)
    {
        $review->delete();
        return redirect()->back()->with('success', 'Review eliminada correctamente.');
    }
}
