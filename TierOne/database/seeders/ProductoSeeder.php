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
        $camisetas = Categoria::where('slug', 'camisetas-gaming')->first();
        $sudaderas = Categoria::where('slug', 'sudaderas-tierone')->first();
        $gorras = Categoria::where('slug', 'gorras-tierone')->first();
        $complementos = Categoria::where('slug', 'complementos-tierone')->first();
        
        $proveedorGen = Proveedor::where('nombre', 'Gaming Supplies Co.')->first();
        $proveedorMarca = Proveedor::where('nombre', 'TierOne Official Brand')->first();

        $productos = [
            [
                'id_categoria' => $teclados->id ?? 1,
                'id_proveedor' => $proveedorGen->id ?? 1,
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
                'id_proveedor' => $proveedorGen->id ?? 1,
                'nombre' => 'Ratón Gaming Ultra Ligero',
                'slug' => 'raton-gaming-ultra-ligero',
                'descripcion' => 'Sensor óptico de 16000 DPI, solo 60g de peso y cable paracord.',
                'precio_proveedor' => 25.00,
                'precio_venta' => 49.99,
                'imagen_principal' => 'https://example.com/raton.jpg',
                'destacado' => false,
            ],
            [
                'id_categoria' => $camisetas->id ?? 1,
                'id_proveedor' => $proveedorMarca->id ?? 1,
                'nombre' => 'Camiseta TierOne Official 2024',
                'slug' => 'camiseta-tierone-2024',
                'descripcion' => 'Nueva camiseta oficial de la temporada 2024. Tejido transpirable de alta calidad.',
                'precio_proveedor' => 12.00,
                'precio_venta' => 29.99,
                'imagen_principal' => 'https://example.com/camiseta-tierone.jpg',
                'destacado' => true,
            ],
            [
                'id_categoria' => $sudaderas->id ?? 1,
                'id_proveedor' => $proveedorMarca->id ?? 1,
                'nombre' => 'Sudadera Hoodie TierOne Black',
                'slug' => 'sudadera-tierone-black',
                'descripcion' => 'Sudadera con capucha y logo bordado. Máximo confort para tus sesiones de juego.',
                'precio_proveedor' => 22.00,
                'precio_venta' => 45.00,
                'imagen_principal' => 'https://example.com/sudadera-tierone.jpg',
                'destacado' => true,
            ],
            [
                'id_categoria' => $gorras->id ?? 1,
                'id_proveedor' => $proveedorMarca->id ?? 1,
                'nombre' => 'Gorra TierOne Snapback',
                'slug' => 'gorra-tierone-snapback',
                'descripcion' => 'Gorra ajustable con diseño plano y logo en 3D.',
                'precio_proveedor' => 8.00,
                'precio_venta' => 19.99,
                'imagen_principal' => 'https://example.com/gorra-tierone.jpg',
                'destacado' => false,
            ],
            [
                'id_categoria' => $complementos->id ?? 1,
                'id_proveedor' => $proveedorMarca->id ?? 1,
                'nombre' => 'Mochila Tech TierOne',
                'slug' => 'mochila-tierone-tech',
                'descripcion' => 'Mochila con compartimento acolchado para portátil de hasta 17" y periféricos.',
                'precio_proveedor' => 35.00,
                'precio_venta' => 65.00,
                'imagen_principal' => 'https://example.com/mochila-tierone.jpg',
                'destacado' => false,
            ],
            [
                'id_categoria' => $complementos->id ?? 1,
                'id_proveedor' => $proveedorMarca->id ?? 1,
                'nombre' => 'Alfombrilla TierOne Titan XL',
                'slug' => 'alfombrilla-tierone-xl',
                'descripcion' => 'Superficie de tela micro-texturizada, base de goma antideslizante y bordes cosidos.',
                'precio_proveedor' => 10.00,
                'precio_venta' => 24.99,
                'imagen_principal' => 'https://example.com/alfombrilla-tierone.jpg',
                'destacado' => true,
            ],
            [
                'id_categoria' => $auriculares->id ?? 1,
                'id_proveedor' => $proveedorGen->id ?? 1,
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
                'id_proveedor' => $proveedorGen->id ?? 1,
                'nombre' => 'RTX 4080 Super OC',
                'slug' => 'rtx-4080-super-oc',
                'descripcion' => 'Potencia extrema para 4K con trazado de rayos de tercera generación.',
                'precio_proveedor' => 850.00,
                'precio_venta' => 1099.99,
                'destacado' => true,
            ],
            [
                'id_categoria' => $cpu->id ?? 1,
                'id_proveedor' => $proveedorGen->id ?? 1,
                'nombre' => 'Ryzen 7 7800X3D',
                'slug' => 'ryzen-7-7800x3d',
                'descripcion' => 'El mejor procesador para gaming con tecnología 3D V-Cache.',
                'precio_proveedor' => 320.00,
                'precio_venta' => 449.99,
                'destacado' => true,
            ],
            [
                'id_categoria' => $sillas->id ?? 1,
                'id_proveedor' => $proveedorGen->id ?? 1,
                'nombre' => 'Silla Ergonómica Omega v2',
                'slug' => 'silla-omega-v2',
                'descripcion' => 'Cuero sintético premium, pistón de clase 4 y soporte lumbar ajustable.',
                'precio_proveedor' => 150.00,
                'precio_venta' => 299.99,
                'destacado' => false,
            ],
            [
                'id_categoria' => $ram->id ?? 1,
                'id_proveedor' => $proveedorGen->id ?? 1,
                'nombre' => 'Memoria RAM DDR5 32GB 6000MHz',
                'slug' => 'ram-ddr5-32gb-6000mhz',
                'descripcion' => 'Kit de 2x16GB con perfiles EXPO/XMP 3.0 para máximo rendimiento.',
                'precio_proveedor' => 80.00,
                'precio_venta' => 145.50,
                'destacado' => false,
            ],
            [
                'id_categoria' => $ssd->id ?? 1,
                'id_proveedor' => $proveedorGen->id ?? 1,
                'nombre' => 'SSD NVMe Gen4 2TB Extreme',
                'slug' => 'ssd-nvme-gen4-2tb-extreme',
                'descripcion' => 'Velocidades de lectura de hasta 7400MB/s, ideal para PS5 y PC.',
                'precio_proveedor' => 95.00,
                'precio_venta' => 179.99,
                'destacado' => true,
            ],
            [
                'id_categoria' => $monitores->id ?? 1,
                'id_proveedor' => $proveedorGen->id ?? 1,
                'nombre' => 'Monitor Gaming 27" 1440p 165Hz',
                'slug' => 'monitor-gaming-27-1440p',
                'descripcion' => 'Panel IPS, 1ms de respuesta y compatible con G-Sync.',
                'precio_proveedor' => 180.00,
                'precio_venta' => 349.00,
                'destacado' => true,
            ],
            [
                'id_categoria' => $microfonos->id ?? 1,
                'id_proveedor' => $proveedorGen->id ?? 1,
                'nombre' => 'Micrófono USB Cardioide Pro',
                'slug' => 'microfono-usb-cardioide',
                'descripcion' => 'Perfecto para streaming y podcasts, plug and play con soporte incluido.',
                'precio_proveedor' => 40.00,
                'precio_venta' => 79.99,
                'destacado' => false,
            ],
        ];

        foreach ($productos as $item) {
            Producto::updateOrCreate(
                ['slug' => $item['slug']],
                array_merge($item, [
                    'activo' => true,
                    'ventas_totales' => rand(0, 500),
                    'rating_promedio' => rand(300, 500) / 100,
                ])
            );
        }
    }
}
