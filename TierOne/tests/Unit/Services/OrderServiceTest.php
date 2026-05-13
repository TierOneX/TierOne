<?php

namespace Tests\Unit\Services;

use Tests\TestCase;
use App\Services\OrderService;
use App\Models\Orden;
use App\Models\User;
use App\Models\Producto;
use App\Models\DireccionEnvio;
use Illuminate\Foundation\Testing\RefreshDatabase;

class OrderServiceTest extends TestCase
{
    use RefreshDatabase;

    private OrderService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = new OrderService();
    }

    public function test_create_order_with_items_and_address()
    {
        $user = User::factory()->create();
        $producto = Producto::factory()->create();

        $data = [
            'id_usuario' => $user->id,
            'nombre_completo' => 'Juan Perez',
            'direccion_linea1' => 'Calle Falsa 123',
            'ciudad' => 'Madrid',
            'codigo_postal' => '28001',
            'pais' => 'España',
            'telefono' => '600000000',
            'subtotal' => 100.00,
            'impuestos' => 21.00,
            'costo_envio' => 5.00,
            'descuento' => 0.00,
            'total' => 126.00,
            'estado' => 'pendiente',
            'items' => [
                [
                    'id_producto' => $producto->id,
                    'id_proveedor' => $producto->id_proveedor,
                    'cantidad' => 2,
                    'precio_unitario' => 50.00
                ]
            ]
        ];

        $orden = $this->service->createOrder($data);

        $this->assertDatabaseHas('ordenes', ['id' => $orden->id]);
        $this->assertDatabaseHas('items_orden', ['id_orden' => $orden->id, 'cantidad' => 2]);
        $this->assertDatabaseHas('direcciones_envio', ['id' => $orden->id_direccion_envio, 'nombre_completo' => 'Juan Perez']);
    }

    public function test_get_filtered_orders_by_status()
    {
        Orden::factory()->count(3)->create(['estado' => 'pagada']);
        Orden::factory()->count(1)->create(['estado' => 'pendiente']);

        $filters = ['estado' => 'pagada'];
        $results = $this->service->getFilteredOrders($filters);

        $this->assertEquals(3, $results->total());
    }
}
