<?php

namespace App\Http\Controllers;

use App\Models\Producto;
use App\Models\Categoria;
use App\Models\Proveedor;
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
            'nombre'           => 'nombre',
            'precio_proveedor' => 'precio_proveedor',
            'precio_venta'     => 'precio_venta',
            'ventas_totales'   => 'ventas_totales',
            'activo'           => 'activo',
            'fecha_creacion'   => 'fecha_creacion'
        ];

        $orderCol = $sortMap[$sortBy] ?? 'fecha_creacion';
        
        return Inertia::render('PanelAdminEcommerce/Products', [
            'productos' => Producto::with(['categoria', 'variantes', 'proveedor'])
                ->when($filters['search'] ?? null, function($q, $v) {
                    $q->where(function($sq) use ($v) {
                        $sq->where('productos.id', 'like', "%$v%")
                           ->orWhere('productos.nombre', 'like', "%$v%")
                           ->orWhere('productos.slug', 'like', "%$v%")
                           ->orWhere('productos.descripcion', 'like', "%$v%");
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
                    'categoria'       => $p->categoria,
                    'proveedor'       => $p->proveedor,
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
            'proveedores' => Proveedor::where('activo', true)->get(['id', 'nombre']),
            'filters' => $filters
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre'           => 'required|string|max:255',
            'id_categoria'    => 'required|exists:categorias,id',
            'id_proveedor'    => 'required|exists:proveedores,id',
            'precio_venta'     => 'required|numeric|min:0',
            'precio_proveedor' => 'required|numeric|min:0',
            'activo'           => 'boolean',
            'destacado'        => 'boolean',
            'descripcion'      => 'nullable|string',
            'imagen_principal' => 'nullable|string|max:2048',
            'imagen_archivo'   => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
        ]);

        if ($request->hasFile('imagen_archivo')) {
            $path = $request->file('imagen_archivo')->store('products', 'public');
            $validated['imagen_principal'] = '/storage/' . $path;
        }

        $validated['slug'] = \Illuminate\Support\Str::slug($validated['nombre']);
        $validated['fecha_creacion'] = now();

        Producto::create($validated);

        return redirect()->back()->with('success', 'Producto creado correctamente');
    }

    public function update(Request $request, Producto $producto)
    {
        $validated = $request->validate([
            'nombre'           => 'required|string|max:255',
            'id_categoria'    => 'required|exists:categorias,id',
            'id_proveedor'    => 'required|exists:proveedores,id',
            'precio_venta'     => 'required|numeric|min:0',
            'precio_proveedor' => 'required|numeric|min:0',
            'activo'           => 'boolean',
            'destacado'        => 'boolean',
            'descripcion'      => 'nullable|string',
            'imagen_principal' => 'nullable|string|max:2048',
            'imagen_archivo'   => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
        ]);

        if ($request->hasFile('imagen_archivo')) {
            $path = $request->file('imagen_archivo')->store('products', 'public');
            $validated['imagen_principal'] = '/storage/' . $path;
        }

        if ($validated['nombre'] !== $producto->nombre) {
            $validated['slug'] = \Illuminate\Support\Str::slug($validated['nombre']);
        }

        $producto->update($validated);

        return redirect()->back()->with('success', 'Producto actualizado correctamente');
    }

    /**
     * Elimina un producto.
     */
    public function destroy(Producto $producto)
    {
        // Nota: Podríamos verificar si tiene dependencias (ventas, variantes) 
        // pero por ahora procedemos con el borrado directo.
        $producto->delete();
        return redirect()->back()->with('success', 'Producto eliminado correctamente');
    }
}
