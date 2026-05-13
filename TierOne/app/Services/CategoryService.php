<?php

namespace App\Services;

use App\Models\Categoria;
use Illuminate\Support\Str;

class CategoryService
{
    /**
     * Obtiene categorías filtradas (Ideal para vistas Admin/Web)
     */
    public function getFilteredCategories(array $filters, string $sortBy = 'nombre', string $sortDir = 'asc')
    {
        $sortMap = [
            'nombre' => 'nombre'
        ];

        $orderCol = $sortMap[$sortBy] ?? 'nombre';

        return Categoria::withCount('subcategorias')
            ->when($filters['search'] ?? null, function ($q, $v) {
                $q->where(function ($sq) use ($v) {
                    $sq->where('id', 'like', "%$v%")
                        ->orWhere('nombre', 'like', "%$v%")
                        ->orWhere('slug', 'like', "%$v%")
                        ->orWhere('descripcion', 'like', "%$v%");
                });
            })
            ->when($filters['nombre'] ?? null, fn($q, $v) => $q->where('nombre', 'like', "%$v%"))
            ->when($filters['activa'] ?? null, fn($q, $v) => $q->where('activa', $v === '1' || $v === true))
            ->when($filters['id_parent'] ?? null, fn($q, $v) => $q->where('id_parent', $v))
            ->orderBy($orderCol, $sortDir)
            ->get();
    }

    /**
     * Obtiene el listado simple de categorías maestras (sin padre)
     */
    public function getMasterCategories()
    {
        return Categoria::whereNull('id_parent')->get(['id', 'nombre']);
    }

    /**
     * Obtiene todas las categorías de forma raw (API)
     */
    public function getAllCategories()
    {
        return Categoria::all();
    }

    /**
     * Obtiene una categoría individual
     */
    public function getCategoryById(string|int $id)
    {
        return Categoria::findOrFail($id);
    }

    /**
     * Crea una nueva categoría con normalización de Slugs
     */
    public function createCategory(array $data): Categoria
    {
        if (empty($data['slug'])) {
            $data['slug'] = Str::slug($data['nombre']);
        } else {
            $data['slug'] = Str::slug($data['slug']);
        }

        if (isset($data['activa'])) {
            // Normalizar booleano que a veces viene de Request->boolean() o string
            $data['activa'] = filter_var($data['activa'], FILTER_VALIDATE_BOOLEAN);
        }

        return Categoria::create($data);
    }

    /**
     * Actualiza una categoría existente
     */
    public function updateCategory(Categoria $categoria, array $data): Categoria
    {
        if (isset($data['nombre']) && empty($data['slug'])) {
            $data['slug'] = Str::slug($data['nombre']);
        } elseif (isset($data['slug'])) {
            $data['slug'] = Str::slug($data['slug']);
        }

        if (isset($data['activa'])) {
            $data['activa'] = filter_var($data['activa'], FILTER_VALIDATE_BOOLEAN);
        }

        $categoria->update($data);
        return $categoria;
    }

    /**
     * Elimina la categoría especificada
     */
    public function deleteCategory(Categoria $categoria): void
    {
        $categoria->delete();
    }
}
