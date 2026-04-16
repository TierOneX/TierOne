<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;

use App\Models\Producto;
use App\Models\Categoria;
use App\Models\Proveedor;
use App\Services\ProductService;
use Inertia\Inertia;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function __construct(
        protected ProductService $productService
    ) {}

    /**
     * Lista todos los productos con filtrado y paginación.
     */
    public function index(Request $request)
    {
        $filters = $request->only(['nombre', 'id_categoria', 'activo', 'destacado', 'precio_min', 'precio_max', 'search', 'sort_by', 'sort_dir']);
        $sortBy = $request->input('sort_by', 'fecha_creacion');
        $sortDir = $request->input('sort_dir', 'desc');

        $paginator = $this->productService->getFilteredProducts($filters, $sortBy, $sortDir, 15);
        
        return Inertia::render('PanelAdminEcommerce/Products', [
            'productos' => $paginator->through(fn($p) => [
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

        $this->productService->createProduct($validated, $request->file('imagen_archivo'));

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

        $this->productService->updateProduct($producto, $validated, $request->file('imagen_archivo'));

        return redirect()->back()->with('success', 'Producto actualizado correctamente');
    }

    /**
     * Elimina un producto.
     */
    public function destroy(Producto $producto)
    {
        $this->productService->deleteProduct($producto);
        return redirect()->back()->with('success', 'Producto eliminado correctamente');
    }
}

