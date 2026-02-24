<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\VarianteProducto;
use App\Models\Producto;

class VarianteProductoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $productos = Producto::all();

        if ($productos->isEmpty()) {
            return;
        }

        $variantes = [
            // Variantes para Teclado Mecánico RGB Pro
            ['slug' => 'teclado-mecanico-rgb-pro', 'nombre' => 'Interruptores Blue', 'sku' => 'TEC-RGB-BLUE', 'precio' => 89.99],
            ['slug' => 'teclado-mecanico-rgb-pro', 'nombre' => 'Interruptores Red', 'sku' => 'TEC-RGB-RED', 'precio' => 89.99],
            ['slug' => 'teclado-mecanico-rgb-pro', 'nombre' => 'Interruptores Brown', 'sku' => 'TEC-RGB-BROWN', 'precio' => 89.99],
            
            // Variantes para Ratón Gaming Ultra Ligero
            ['slug' => 'raton-gaming-ultra-ligero', 'nombre' => 'Color Negro', 'sku' => 'RAT-UL-BLACK', 'precio' => 49.99],
            ['slug' => 'raton-gaming-ultra-ligero', 'nombre' => 'Color Blanco', 'sku' => 'RAT-UL-WHITE', 'precio' => 54.99],
            
            // Variantes para Auriculares Inalámbricos 7.1
            ['slug' => 'auriculares-inalambricos-7-1', 'nombre' => 'Versión Carbono', 'sku' => 'AUR-71-CARB', 'precio' => 119.99],
            ['slug' => 'auriculares-inalambricos-7-1', 'nombre' => 'Versión Blanca', 'sku' => 'AUR-71-WHT', 'precio' => 119.99],
            
            // Variantes para Silla Ergonómica Omega v2
            ['slug' => 'silla-omega-v2', 'nombre' => 'Negro/Rojo', 'sku' => 'SIL-OMV2-RE', 'precio' => 299.99],
            ['slug' => 'silla-omega-v2', 'nombre' => 'Negro/Azul', 'sku' => 'SIL-OMV2-BL', 'precio' => 299.99],
            ['slug' => 'silla-omega-v2', 'nombre' => 'Edición Especial Gold', 'sku' => 'SIL-OMV2-GD', 'precio' => 349.99],
            
            // Variantes para RAM DDR5
            ['slug' => 'ram-ddr5-32gb-6000mhz', 'nombre' => 'Kit Black', 'sku' => 'RAM-D5-BLK', 'precio' => 145.50],
            ['slug' => 'ram-ddr5-32gb-6000mhz', 'nombre' => 'Kit Silver', 'sku' => 'RAM-D5-SLV', 'precio' => 145.50],
            
            // Variantes para Teclado 60% Wireless
            ['slug' => 'teclado-60-wireless', 'nombre' => 'Switch Óptico Amarillo', 'sku' => 'TEC-60-YEL', 'precio' => 95.00],
            ['slug' => 'teclado-60-wireless', 'nombre' => 'Switch Óptico Plateado', 'sku' => 'TEC-60-SIL', 'precio' => 95.00],
            
            // Variantes para Ratón MMO
            ['slug' => 'raton-mmo-pro', 'nombre' => 'Zurdo', 'sku' => 'RAT-MMO-LH', 'precio' => 74.99],
            ['slug' => 'raton-mmo-pro', 'nombre' => 'Diestro', 'sku' => 'RAT-MMO-RH', 'precio' => 69.99],
            
            // Variantes para RAM RGB 16GB
            ['slug' => 'ram-rgb-16gb-3600mhz', 'nombre' => 'Single Stick 16GB', 'sku' => 'RAM-RGB-S16', 'precio' => 60.00],
            ['slug' => 'ram-rgb-16gb-3600mhz', 'nombre' => 'Dual Kit 8GBx2', 'sku' => 'RAM-RGB-D16', 'precio' => 65.00],
            
            // Variantes para Monitor 27"
            ['slug' => 'monitor-gaming-27-1440p', 'nombre' => 'Sin Soporte (VESA)', 'sku' => 'MON-27-NV', 'precio' => 320.00],
            ['slug' => 'monitor-gaming-27-1440p', 'nombre' => 'Con Soporte Ergonómico', 'sku' => 'MON-27-VE', 'precio' => 349.00],
        ];

        foreach ($variantes as $vData) {
            $producto = Producto::where('slug', $vData['slug'])->first();
            if ($producto) {
                VarianteProducto::create([
                    'id_producto' => $producto->id,
                    'nombre' => $vData['nombre'],
                    'sku' => $vData['sku'],
                    'precio' => $vData['precio'],
                    'disponible' => true,
                    'ultima_verificacion_stock' => now(),
                ]);
            }
        }
    }
}
