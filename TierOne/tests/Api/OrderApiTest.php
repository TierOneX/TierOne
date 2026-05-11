<?php

namespace Tests\Api;

use Tests\TestCase;
use App\Models\User;
use App\Models\Orden;
use App\Models\Producto;
use App\Models\DireccionEnvio;
use Illuminate\Foundation\Testing\RefreshDatabase;

class OrderApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_list_own_orders()
    {
        $user = User::factory()->create();
        $this->actingAs($user, 'sanctum');

        Orden::factory()->count(2)->create(['id_usuario' => $user->id]);
        $response = $this->getJson('/api/ordenes');
        $response->assertStatus(200);
    }

    public function test_can_create_order_via_api()
    {
        $user = User::factory()->create();
        $this->actingAs($user, 'sanctum');

        $producto = Producto::factory()->create();
        $direccion = DireccionEnvio::factory()->create(['id_usuario' => $user->id]);

        $data = [
            'id_usuario' => $user->id,
            'id_direccion_envio' => $direccion->id,
            'subtotal' => 100,
            'impuestos' => 21,
            'costo_envio' => 5,
            'total' => 126,
            'estado' => 'pendiente',
            'items' => [
                [
                    'id_producto' => $producto->id,
                    'id_proveedor' => $producto->id_proveedor,
                    'cantidad' => 1,
                    'precio_unitario' => 100
                ]
            ]
        ];

        $response = $this->postJson('/api/ordenes', $data);
        $response->assertStatus(201);
    }
}
