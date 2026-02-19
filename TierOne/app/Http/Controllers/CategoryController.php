<?php

namespace App\Http\Controllers;

use App\Models\Categoria;
use Inertia\Inertia;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    /**
     * Lista todas las categorías con filtrado.
     */
    public function index(Request $request)
    {
        $filters = $request->only(['nombre', 'activa', 'id_parent']);

        return Inertia::render('PanelAdminEcommerce/Categories', [
            'categorias' => Categoria::withCount('subcategorias')
                ->when($filters['nombre'] ?? null, fn($q, $v) => $q->where('nombre', 'like', "%$v%"))
                ->when($filters['activa'] ?? null, fn($q, $v) => $q->where('activa', $v === '1'))
                ->when($filters['id_parent'] ?? null, fn($q, $v) => $q->where('id_parent', $v))
                ->orderBy('nombre')
                ->get()
                ->map(fn($c) => [
                    'id'               => $c->id,
                    'nombre'           => $c->nombre,
                    'slug'             => $c->slug,
                    'descripcion'      => $c->descripcion,
                    'activa'           => $c->activa,
                    'subcategorias'    => $c->subcategorias_count,
                    'padre'            => $c->id_parent,
                ]),
            'filters' => $filters
        ]);
    }
}
