<?php

namespace Tests\Unit\Services;

use Tests\TestCase;
use App\Services\CustomizationService;
use App\Models\PrecioPersonalizacion;
use App\Models\Producto;
use Illuminate\Foundation\Testing\RefreshDatabase;

class CustomizationServiceTest extends TestCase
{
    use RefreshDatabase;

    private CustomizationService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = new CustomizationService();
    }

    /**
     * Test que calcula el recargo correctamente usando precios globales.
     */
    public function test_calcular_recargo_global()
    {
        // Limpiar para asegurar que no hay otros precios
        PrecioPersonalizacion::query()->delete();

        // Setup: Precios globales
        PrecioPersonalizacion::create(['tipo_elemento' => 'texto', 'precio' => 2.50, 'id_producto' => null]);
        PrecioPersonalizacion::create(['tipo_elemento' => 'imagen', 'precio' => 5.00, 'id_producto' => null]);

        $zonas = [
            [
                'capas' => [
                    ['tipo' => 'texto'],
                    ['tipo' => 'texto'],
                    ['tipo' => 'imagen']
                ]
            ]
        ];

        $resultado = $this->service->calcularRecargo($zonas);

        // (2 * 2.50) + (1 * 5.00) = 5.00 + 5.00 = 10.00
        $this->assertEquals(10.00, (float) $resultado['total']);
    }

    /**
     * Test que calcula el recargo usando precios específicos por producto.
     */
    public function test_calcular_recargo_especifico_producto()
    {
        $producto = Producto::factory()->create();

        // Precio global
        PrecioPersonalizacion::factory()->create(['tipo_elemento' => 'texto', 'precio' => 2.50, 'id_producto' => null]);
        // Precio específico para este producto
        PrecioPersonalizacion::factory()->create(['tipo_elemento' => 'texto', 'precio' => 4.00, 'id_producto' => $producto->id]);

        $zonas = [
            [
                'capas' => [['tipo' => 'texto']]
            ]
        ];

        $resultado = $this->service->calcularRecargo($zonas, $producto->id);

        $this->assertEquals(4.00, $resultado['total']);
    }
}
