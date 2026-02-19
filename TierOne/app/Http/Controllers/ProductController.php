<?php

namespace App\Http\Controllers;

use App\Models\Producto;
use App\Models\Categoria;
use Inertia\Inertia;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * Lista todos los productos con filtrado y paginación.
     */
    public function index(Request $request)
    {
        $filters = $request->only(['nombre', 'id_categoria', 'activo', 'destacado', 'precio_min', 'precio_max']);
        
        return Inertia::render('PanelAdminEcommerce/Products', [
            'productos' => Producto::with('categoria')
                ->when($filters['nombre'] ?? null, fn($q, $v) => $q->where('nombre', 'like', "%$v%"))
                ->when($filters['id_categoria'] ?? null, fn($q, $v) => $q->where('id_categoria', $v))
                ->when($filters['activo'] ?? null, fn($q, $v) => $q->where('activo', $v === '1'))
                ->when($filters['destacado'] ?? null, fn($q, $v) => $q->where('destacado', $v === '1'))
                ->when($filters['precio_min'] ?? null, fn($q, $v) => $q->where('precio_venta', '>=', $v))
                ->when($filters['precio_max'] ?? null, fn($q, $v) => $q->where('precio_venta', '<=', $v))
                ->orderBy('id', 'desc')
                ->paginate(15)
                ->withQueryString()
                ->through(fn($p) => [
                    'id'              => $p->id,
                    'nombre'          => $p->nombre,
                    'categoria'       => $p->categoria?->nombre ?? 'Sin categoría',
                    'precio_venta'    => $p->precio_venta,
                    'precio_proveedor'=> $p->precio_proveedor,
                    'imagen_principal'=> $p->imagen_principal,
                    'activo'          => $p->activo,
                    'destacado'       => $p->destacado,
                    'ventas_totales'  => $p->ventas_totales,
                    'rating_promedio' => $p->rating_promedio,
                ]),
            'categorias' => Categoria::where('activa', true)->get(['id', 'nombre']),
            'filters' => $filters
        ]);
    }
}
