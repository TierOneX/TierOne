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
        $filters = $request->only(['nombre', 'id_categoria', 'activo', 'destacado', 'precio_min', 'precio_max', 'search', 'sort_by', 'sort_dir']);
        $sortBy = $request->input('sort_by', 'fecha_creacion');
        $sortDir = $request->input('sort_dir', 'desc');

        // Mapeo de campos permitidos para evitar inyección SQL y problemas de nombres
        $sortMap = [
            'nombre'         => 'nombre',
            'precio'         => 'precio_venta',
            'stock'          => 'stock',
            'activo'         => 'activo',
            'fecha_creacion' => 'fecha_creacion'
        ];

        $orderCol = $sortMap[$sortBy] ?? 'fecha_creacion';
        
        return Inertia::render('PanelAdminEcommerce/Products', [
            'productos' => Producto::with(['categoria', 'variantes'])
                ->when($filters['search'] ?? null, function($q, $v) {
                    $q->where(function($sq) use ($v) {
                        $sq->where('id', 'like', "%$v%")
                           ->orWhere('nombre', 'like', "%$v%")
                           ->orWhere('slug', 'like', "%$v%")
                           ->orWhere('descripcion', 'like', "%$v%");
                    });
                })
                ->when($filters['nombre'] ?? null, fn($q, $v) => $q->where('nombre', 'like', "%$v%"))
                ->when($filters['id_categoria'] ?? null, fn($q, $v) => $q->where('id_categoria', $v))
                ->when($filters['activo'] ?? null, fn($q, $v) => $q->where('activo', $v === '1'))
                ->when($filters['destacado'] ?? null, fn($q, $v) => $q->where('destacado', $v === '1'))
                ->when($filters['precio_min'] ?? null, fn($q, $v) => $q->where('precio_venta', '>=', $v))
                ->when($filters['precio_max'] ?? null, fn($q, $v) => $q->where('precio_venta', '<=', $v))
                ->orderBy($orderCol, $sortDir)
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
                    'fecha_creacion'  => $p->fecha_creacion?->format('d/m/Y'),
                    'variantes'       => $p->variantes,
                ]),
            'categorias' => Categoria::where('activa', true)->get(['id', 'nombre']),
            'filters' => $filters
        ]);
    }
}
