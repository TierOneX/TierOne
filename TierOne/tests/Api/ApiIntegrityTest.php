<?php

namespace Tests\Api;

use Tests\TestCase;
use App\Models\User;
use App\Models\Producto;
use App\Models\Torneo;
use App\Models\Juego;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ApiIntegrityTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test de conectividad básica: Verifica que las APIs responden y traen datos.
     */
    public function test_api_connectivity_and_data_transfer()
    {
        $this->withoutVite();

        $admin = User::factory()->create(['rol' => 'admin']);
        $this->actingAs($admin, 'sanctum');

        Producto::factory()->create(['nombre' => 'Producto Test']);
        Torneo::factory()->create(['nombre' => 'Torneo Test']);
        Juego::factory()->create(['nombre' => 'Juego Test']);

        $endpoints = [
            '/api/productos',
            '/api/torneos',
            '/api/juegos',
            '/api/users',
            '/api/proveedores'
        ];

        foreach ($endpoints as $url) {
            $response = $this->getJson($url);
            $response->assertStatus(200);
            $this->assertNotEmpty($response->getContent(), "La API $url no está devolviendo contenido.");
            dump("✅ API $url: Conectada.");
        }
    }
}
