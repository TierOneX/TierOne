<?php

namespace Tests\Unit\Services;

use Tests\TestCase;
use App\Services\ProductService;
use App\Models\Producto;
use App\Models\Categoria;
use App\Models\Proveedor;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;

class ProductServiceTest extends TestCase
{
    use RefreshDatabase;

    private ProductService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = new ProductService();
    }

    public function test_create_product_generates_slug_if_missing()
    {
        $categoria = Categoria::factory()->create();
        $proveedor = Proveedor::factory()->create();

        $data = [
            'id_categoria' => $categoria->id,
            'id_proveedor' => $proveedor->id,
            'nombre' => 'Producto de Prueba Unitario',
            'precio_proveedor' => 50.00,
            'precio_venta' => 100.00,
            'activo' => true
        ];

        $producto = $this->service->createProduct($data);

        $this->assertDatabaseHas('productos', [
            'id' => $producto->id,
            'nombre' => 'Producto de Prueba Unitario',
            'slug' => 'producto-de-prueba-unitario'
        ]);
    }

    public function test_update_product_updates_slug_if_name_changes()
    {
        $producto = Producto::factory()->create(['nombre' => 'Nombre Original']);
        $originalSlug = $producto->slug;

        $updateData = ['nombre' => 'Nuevo Nombre Editado'];
        $updatedProduct = $this->service->updateProduct($producto, $updateData);

        $this->assertEquals('nuevo-nombre-editado', $updatedProduct->slug);
    }

    public function test_get_filtered_products_by_category()
    {
        $cat1 = Categoria::factory()->create();
        $cat2 = Categoria::factory()->create();

        Producto::factory()->count(3)->create(['id_categoria' => $cat1->id]);
        Producto::factory()->count(2)->create(['id_categoria' => $cat2->id]);

        $filters = ['id_categoria' => $cat1->id];
        $results = $this->service->getFilteredProducts($filters);

        $this->assertEquals(3, $results->total());
    }
}
