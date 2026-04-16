<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;

use App\Models\Categoria;
use App\Services\CategoryService;
use Inertia\Inertia;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function __construct(
        protected CategoryService $categoryService
    ) {}

    /**
     * Lista todas las categorías con filtrado.
     */
    public function index(Request $request)
    {
        $filters = $request->only(['nombre', 'activa', 'id_parent', 'search', 'sort_by', 'sort_dir']);
        $sortBy = $request->input('sort_by', 'nombre');
        $sortDir = $request->input('sort_dir', 'asc');

        $categorias = $this->categoryService->getFilteredCategories($filters, $sortBy, $sortDir);

        return Inertia::render('PanelAdminEcommerce/Categories', [
            'categorias' => $categorias->map(fn($c) => [
                'id'               => $c->id,
                'nombre'           => $c->nombre,
                'slug'             => $c->slug,
                'descripcion'      => $c->descripcion,
                'activa'           => $c->activa,
                'subcategorias'    => $c->subcategorias_count,
                'padre'            => $c->id_parent,
            ]),
            'filters' => $filters,
            'todas_categorias' => $this->categoryService->getMasterCategories()
        ]);
    }

    /**
     * Crea una nueva categoría.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre'      => 'required|string|max:255',
            'slug'        => 'nullable|string|max:255|unique:categorias,slug',
            'descripcion' => 'nullable|string',
            'id_parent'   => 'nullable|exists:categorias,id',
            'activa'      => 'boolean',
        ]);

        $validated['activa'] = $request->boolean('activa', true);

        $this->categoryService->createCategory($validated);

        return redirect()->back()->with('success', 'Categoría creada correctamente.');
    }

    /**
     * Actualiza una categoría existente.
     */
    public function update(Request $request, Categoria $categoria)
    {
        $validated = $request->validate([
            'nombre'      => 'required|string|max:255',
            'slug'        => 'nullable|string|max:255|unique:categorias,slug,' . $categoria->id,
            'descripcion' => 'nullable|string',
            'id_parent'   => 'nullable|exists:categorias,id',
            'activa'      => 'boolean',
        ]);

        $validated['activa'] = $request->boolean('activa');

        $this->categoryService->updateCategory($categoria, $validated);

        return redirect()->back()->with('success', 'Categoría actualizada correctamente.');
    }

    /**
     * Elimina una categoría.
     */
    public function destroy(Categoria $categoria)
    {
        $this->categoryService->deleteCategory($categoria);
        return redirect()->back()->with('success', 'Categoría eliminada correctamente.');
    }
}

