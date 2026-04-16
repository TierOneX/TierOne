<?php

namespace App\Services;

use App\Models\Producto;
use Illuminate\Support\Str;
use Illuminate\Http\UploadedFile;

class ProductService
{
    /**
     * Obtiene productos filtrados y paginados (ideal para DataTables y Vistas Admin)
     */
    public function getFilteredProducts(array $filters, string $sortBy = 'fecha_creacion', string $sortDir = 'desc', int $perPage = 15)
    {
        $sortMap = [
            'nombre'           => 'nombre',
            'precio_proveedor' => 'precio_proveedor',
            'precio_venta'     => 'precio_venta',
            'ventas_totales'   => 'ventas_totales',
            'activo'           => 'activo',
            'fecha_creacion'   => 'fecha_creacion'
        ];

        $orderCol = $sortMap[$sortBy] ?? 'fecha_creacion';

        return Producto::with(['categoria', 'variantes', 'proveedor'])
            ->when($filters['search'] ?? null, function ($q, $v) {
                $q->where(function ($sq) use ($v) {
                    $sq->where('productos.id', 'like', "%$v%")
                        ->orWhere('productos.nombre', 'like', "%$v%")
                        ->orWhere('productos.slug', 'like', "%$v%")
                        ->orWhere('productos.descripcion', 'like', "%$v%");
                });
            })
            ->when($filters['nombre'] ?? null, fn($q, $v) => $q->where('nombre', 'like', "%$v%"))
            ->when($filters['id_categoria'] ?? null, fn($q, $v) => $q->where('id_categoria', $v))
            ->when($filters['activo'] ?? null, fn($q, $v) => $q->where('activo', $v === '1' || $v === true))
            ->when($filters['destacado'] ?? null, fn($q, $v) => $q->where('destacado', $v === '1' || $v === true))
            ->when($filters['precio_min'] ?? null, fn($q, $v) => $q->where('precio_venta', '>=', $v))
            ->when($filters['precio_max'] ?? null, fn($q, $v) => $q->where('precio_venta', '<=', $v))
            ->orderBy($orderCol, $sortDir)
            ->paginate($perPage)
            ->withQueryString();
    }

    /**
     * Obtiene todos los productos (Ideal para API Pura o catálogos ligeros)
     */
    public function getAllProducts()
    {
        return Producto::with(['categoria', 'proveedor', 'imagenes', 'variantes'])->get();
    }

    /**
     * Obtiene un producto individual por ID con todas sus relaciones
     */
    public function getProductById(string|int $id)
    {
        return Producto::with(['categoria', 'proveedor', 'imagenes', 'variantes', 'reviews'])->findOrFail($id);
    }

    /**
     * Crea un nuevo producto. Procesa imagen si existe.
     */
    public function createProduct(array $data, ?UploadedFile $imageFile = null): Producto
    {
        if ($imageFile) {
            $path = $imageFile->store('products', 'public');
            $data['imagen_principal'] = '/storage/' . $path;
        }

        if (empty($data['slug'])) {
            $data['slug'] = Str::slug($data['nombre']);
        }

        if (!isset($data['fecha_creacion'])) {
            $data['fecha_creacion'] = now();
        }

        return Producto::create($data);
    }

    /**
     * Actualiza un producto existente
     */
    public function updateProduct(Producto $producto, array $data, ?UploadedFile $imageFile = null): Producto
    {
        if ($imageFile) {
            $path = $imageFile->store('products', 'public');
            $data['imagen_principal'] = '/storage/' . $path;
        }

        if (isset($data['nombre']) && $data['nombre'] !== $producto->nombre) {
            $data['slug'] = Str::slug($data['nombre']);
        }

        $producto->update($data);
        return $producto;
    }

    /**
     * Elimina el producto especificado
     */
    public function deleteProduct(Producto $producto): void
    {
        $producto->delete();
    }
}
