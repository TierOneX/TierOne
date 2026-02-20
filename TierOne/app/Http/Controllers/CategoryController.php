<?php

namespace App\Http\Controllers;

use App\Models\Categoria;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    /**
     * Lista todas las categorías con filtrado.
     */
    public function index(Request $request)
    {
        $filters = $request->only(['nombre', 'activa', 'id_parent', 'search', 'sort_by', 'sort_dir']);
        $sortBy = $request->input('sort_by', 'nombre');
        $sortDir = $request->input('sort_dir', 'asc');

        $sortMap = [
            'nombre' => 'nombre'
        ];

        $orderCol = $sortMap[$sortBy] ?? 'nombre';

        return Inertia::render('PanelAdminEcommerce/Categories', [
            'categorias' => Categoria::withCount('subcategorias')
                ->when($filters['search'] ?? null, function($q, $v) {
                    $q->where(function($sq) use ($v) {
                        $sq->where('id', 'like', "%$v%")
                           ->orWhere('nombre', 'like', "%$v%")
                           ->orWhere('slug', 'like', "%$v%")
                           ->orWhere('descripcion', 'like', "%$v%");
                    });
                })
                ->when($filters['nombre'] ?? null, fn($q, $v) => $q->where('nombre', 'like', "%$v%"))
                ->when($filters['activa'] ?? null, fn($q, $v) => $q->where('activa', $v === '1'))
                ->when($filters['id_parent'] ?? null, fn($q, $v) => $q->where('id_parent', $v))
                ->orderBy($orderCol, $sortDir)
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
            'filters' => $filters,
            'todas_categorias' => Categoria::where('id_parent', null)->get(['id', 'nombre'])
        ]);
    }

    /**
     * Crea una nueva categoría.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre'      => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'id_parent'   => 'nullable|exists:categorias,id',
            'activa'      => 'boolean',
        ]);

        $validated['slug'] = Str::slug($validated['nombre']);
        $validated['activa'] = $request->boolean('activa', true);

        Categoria::create($validated);

        return redirect()->back()->with('success', 'Categoría creada correctamente.');
    }

    /**
     * Actualiza una categoría existente.
     */
    public function update(Request $request, Categoria $categoria)
    {
        $validated = $request->validate([
            'nombre'      => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'id_parent'   => 'nullable|exists:categorias,id',
            'activa'      => 'boolean',
        ]);

        $validated['slug'] = Str::slug($validated['nombre']);
        $validated['activa'] = $request->boolean('activa');

        $categoria->update($validated);

        return redirect()->back()->with('success', 'Categoría actualizada correctamente.');
    }

    /**
     * Elimina una categoría.
     */
    public function destroy(Categoria $categoria)
    {
        // Podríamos verificar si tiene productos asociados aquí
        $categoria->delete();
        return redirect()->back()->with('success', 'Categoría eliminada correctamente.');
    }
}
