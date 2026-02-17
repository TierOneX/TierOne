<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Producto;
use App\Models\Categoria;
use App\Models\Proveedor;

class ProductoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $teclados = Categoria::where('nombre', 'Teclados')->first();
        $ratones = Categoria::where('nombre', 'Ratones')->first();
        $auriculares = Categoria::where('nombre', 'Auriculares')->first();
        $gpu = Categoria::where('nombre', 'Tarjetas Gráficas')->first();
        $cpu = Categoria::where('nombre', 'Procesadores')->first();
        $sillas = Categoria::where('nombre', 'Sillas Gaming')->first();
        $ram = Categoria::where('nombre', 'Memoria RAM')->first();
        $ssd = Categoria::where('nombre', 'Almacenamiento SSD')->first();
        $monitores = Categoria::where('nombre', 'Consolas')->first(); // Fallback similar
        $microfonos = Categoria::where('nombre', 'Micrófonos')->first();
        
        $proveedor = Proveedor::first();

        $productos = [
            [
                'id_categoria' => $teclados->id ?? 1,
                'nombre' => 'Teclado Mecánico RGB Pro',
                'slug' => 'teclado-mecanico-rgb-pro',
                'descripcion' => 'Interruptores blue, retroiluminación RGB personalizable y reposamuñecas ergonómico.',
                'precio_proveedor' => 45.00,
                'precio_venta' => 89.99,
                'imagen_principal' => 'https://example.com/teclado.jpg',
                'destacado' => true,
            ],
            [
                'id_categoria' => $ratones->id ?? 1,
                'nombre' => 'Ratón Gaming Ultra Ligero',
                'slug' => 'raton-gaming-ultra-ligero',
                'descripcion' => 'Sensor óptico de 16000 DPI, solo 60g de peso y cable paracord.',
                'precio_proveedor' => 25.00,
                'precio_venta' => 49.99,
                'imagen_principal' => 'https://example.com/raton.jpg',
                'destacado' => false,
            ],
            [
                'id_categoria' => $auriculares->id ?? 1,
                'nombre' => 'Auriculares Inalámbricos 7.1',
                'slug' => 'auriculares-inalambricos-7-1',
                'descripcion' => 'Sonido envolvente 7.1, micrófono con cancelación de ruido y 20h de batería.',
                'precio_proveedor' => 60.00,
                'precio_venta' => 119.99,
                'imagen_principal' => 'https://example.com/auriculares.jpg',
                'destacado' => true,
            ],
            [
                'id_categoria' => $gpu->id ?? 1,
                'nombre' => 'RTX 4080 Super OC',
                'slug' => 'rtx-4080-super-oc',
                'descripcion' => 'Potencia extrema para 4K con trazado de rayos de tercera generación.',
                'precio_proveedor' => 850.00,
                'precio_venta' => 1099.99,
                'destacado' => true,
            ],
            [
                'id_categoria' => $cpu->id ?? 1,
                'nombre' => 'Ryzen 7 7800X3D',
                'slug' => 'ryzen-7-7800x3d',
                'descripcion' => 'El mejor procesador para gaming con tecnología 3D V-Cache.',
                'precio_proveedor' => 320.00,
                'precio_venta' => 449.99,
                'destacado' => true,
            ],
            [
                'id_categoria' => $sillas->id ?? 1,
                'nombre' => 'Silla Ergonómica Omega v2',
                'slug' => 'silla-omega-v2',
                'descripcion' => 'Cuero sintético premium, pistón de clase 4 y soporte lumbar ajustable.',
                'precio_proveedor' => 150.00,
                'precio_venta' => 299.99,
                'destacado' => false,
            ],
            [
                'id_categoria' => $ram->id ?? 1,
                'nombre' => 'Memoria RAM DDR5 32GB 6000MHz',
                'slug' => 'ram-ddr5-32gb-6000mhz',
                'descripcion' => 'Kit de 2x16GB con perfiles EXPO/XMP 3.0 para máximo rendimiento.',
                'precio_proveedor' => 80.00,
                'precio_venta' => 145.50,
                'destacado' => false,
            ],
            [
                'id_categoria' => $ssd->id ?? 1,
                'nombre' => 'SSD NVMe Gen4 2TB Extreme',
                'slug' => 'ssd-nvme-gen4-2tb-extreme',
                'descripcion' => 'Velocidades de lectura de hasta 7400MB/s, ideal para PS5 y PC.',
                'precio_proveedor' => 95.00,
                'precio_venta' => 179.99,
                'destacado' => true,
            ],
            [
                'id_categoria' => $monitores->id ?? 1,
                'nombre' => 'Monitor Gaming 27" 1440p 165Hz',
                'slug' => 'monitor-gaming-27-1440p',
                'descripcion' => 'Panel IPS, 1ms de respuesta y compatible con G-Sync.',
                'precio_proveedor' => 180.00,
                'precio_venta' => 349.00,
                'destacado' => true,
            ],
            [
                'id_categoria' => $microfonos->id ?? 1,
                'nombre' => 'Micrófono USB Cardioide Pro',
                'slug' => 'microfono-usb-cardioide',
                'descripcion' => 'Perfecto para streaming y podcasts, plug and play con soporte incluido.',
                'precio_proveedor' => 40.00,
                'precio_venta' => 79.99,
                'destacado' => false,
            ],
            [
                'id_categoria' => $teclados->id ?? 1,
                'nombre' => 'Teclado 60% Wireless',
                'slug' => 'teclado-60-wireless',
                'descripcion' => 'Diseño compacto, conexión dual 2.4GHz y Bluetooth.',
                'precio_proveedor' => 50.00,
                'precio_venta' => 95.00,
                'destacado' => false,
            ],
            [
                'id_categoria' => $ratones->id ?? 1,
                'nombre' => 'Ratón Ergonómico para MMO',
                'slug' => 'raton-mmo-pro',
                'descripcion' => '12 botones laterales programables y ajuste de peso.',
                'precio_proveedor' => 35.00,
                'precio_venta' => 69.99,
                'destacado' => false,
            ],
            [
                'id_categoria' => $gpu->id ?? 1,
                'nombre' => 'RX 7900 XTX 24GB',
                'slug' => 'rx-7900-xtx-24gb',
                'descripcion' => 'Arquitectura RDNA 3 para un rendimiento masivo en rasterización.',
                'precio_proveedor' => 780.00,
                'precio_venta' => 950.00,
                'destacado' => false,
            ],
            [
                'id_categoria' => $cpu->id ?? 1,
                'nombre' => 'Core i9-14900K',
                'slug' => 'core-i9-14900k',
                'descripcion' => '24 núcleos y 32 hilos, frecuencia máxima de 6.0GHz.',
                'precio_proveedor' => 450.00,
                'precio_venta' => 589.99,
                'destacado' => false,
            ],
            [
                'id_categoria' => $auriculares->id ?? 1,
                'nombre' => 'IEMs Gaming de Alta Fidelidad',
                'slug' => 'iems-gaming-hifi',
                'descripcion' => 'Auriculares intrauditivos optimizados para posicionamiento de sonido.',
                'precio_proveedor' => 30.00,
                'precio_venta' => 59.99,
                'destacado' => false,
            ],
            [
                'id_categoria' => $sillas->id ?? 1,
                'nombre' => 'Escritorio Elevable Eléctrico',
                'slug' => 'escritorio-elevable-gaming',
                'descripcion' => 'Ajuste de altura con memoria y soporte para cables.',
                'precio_proveedor' => 200.00,
                'precio_venta' => 399.00,
                'destacado' => false,
            ],
            [
                'id_categoria' => $ram->id ?? 1,
                'nombre' => 'Memoria RAM RGB 16GB 3600MHz',
                'slug' => 'ram-rgb-16gb-3600mhz',
                'descripcion' => 'Kit DDR4 clásico con excelente iluminación y compatibilidad.',
                'precio_proveedor' => 35.00,
                'precio_venta' => 65.00,
                'destacado' => false,
            ],
            [
                'id_categoria' => $ssd->id ?? 1,
                'nombre' => 'SSD Externo Rugged 1TB',
                'slug' => 'ssd-externo-rugged-1tb',
                'descripcion' => 'Resistente a golpes y agua, USB-C 3.2 Gen2.',
                'precio_proveedor' => 55.00,
                'precio_venta' => 99.00,
                'destacado' => false,
            ],
            [
                'id_categoria' => $monitores->id ?? 1,
                'nombre' => 'Monitor 4K 144Hz OLED',
                'slug' => 'monitor-4k-oled-144hz',
                'descripcion' => 'Negros perfectos y tiempo de respuesta casi instantáneo.',
                'precio_proveedor' => 650.00,
                'precio_venta' => 899.99,
                'destacado' => true,
            ],
            [
                'id_categoria' => $microfonos->id ?? 1,
                'nombre' => 'Brazo de Micrófono Profesional',
                'slug' => 'brazo-microfono-pro',
                'descripcion' => 'Movimiento silencioso y gestión de cables interna.',
                'precio_proveedor' => 45.00,
                'precio_venta' => 85.00,
                'destacado' => false,
            ],
        ];

        foreach ($productos as $item) {
            Producto::updateOrCreate(
                ['slug' => $item['slug']],
                array_merge($item, [
                    'id_proveedor' => $proveedor->id ?? 1,
                    'activo' => true,
                    'ventas_totales' => rand(0, 500),
                    'rating_promedio' => rand(300, 500) / 100,
                ])
            );
        }
    }
}
