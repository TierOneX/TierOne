<?php

namespace Tests\Api;

use Tests\TestCase;
use App\Models\User;
use App\Models\Producto;
use App\Models\Categoria;
use App\Models\Proveedor;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ProductApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_list_products_publicly()
    {
        Producto::factory()->count(3)->create();
        $response = $this->getJson('/api/productos');
        $response->assertStatus(200);
    }

    public function test_admin_can_create_product()
    {
        $admin = User::factory()->create(['rol' => 'admin']);
        $this->actingAs($admin, 'sanctum');

        $categoria = Categoria::factory()->create();
        $proveedor = Proveedor::factory()->create();

        $data = [
            'id_categoria' => $categoria->id,
            'id_proveedor' => $proveedor->id,
            'nombre' => 'Nuevo Producto Admin',
            'descripcion' => 'Descripción',
            'precio_proveedor' => 10,
            'precio_venta' => 20,
            'activo' => true
        ];

        $response = $this->postJson('/api/productos', $data);
        $response->assertStatus(201);
    }
}
