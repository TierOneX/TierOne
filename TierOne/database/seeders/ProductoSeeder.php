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

        // Categorías de merchandising
        $camisetas = Categoria::where('nombre', 'Camisetas')->first();
        $figuras = Categoria::where('nombre', 'Figuras')->first();
        $merchandising = Categoria::where('nombre', 'Merchandising')->first();

        $proveedor = Proveedor::first();

        $productos = [
            [
                'id_categoria' => $teclados->id ?? 1,
                'nombre' => 'Teclado Mecánico RGB Pro',
                'slug' => 'teclado-mecanico-rgb-pro',
                'descripcion' => 'Interruptores blue, retroiluminación RGB personalizable y reposamuñecas ergonómico.',
                'precio_proveedor' => 45.00,
                'precio_venta' => 89.99,
                'imagen_principal' => 'images/productos/teclado_mecanico_rgb_pro.png',
                'destacado' => true,
            ],
            [
                'id_categoria' => $ratones->id ?? 1,
                'nombre' => 'Ratón Gaming Ultra Ligero',
                'slug' => 'raton-gaming-ultra-ligero',
                'descripcion' => 'Sensor óptico de 16000 DPI, solo 60g de peso y cable paracord.',
                'precio_proveedor' => 25.00,
                'precio_venta' => 49.99,
                'imagen_principal' => 'images/productos/raton_gaming_ultra_ligero.png',
                'destacado' => false,
            ],
            [
                'id_categoria' => $auriculares->id ?? 1,
                'nombre' => 'Auriculares Inalámbricos 7.1',
                'slug' => 'auriculares-inalambricos-7-1',
                'descripcion' => 'Sonido envolvente 7.1, micrófono con cancelación de ruido y 20h de batería.',
                'precio_proveedor' => 60.00,
                'precio_venta' => 119.99,
                'imagen_principal' => 'images/productos/auriculares_inalambricos_71.png',
                'destacado' => true,
            ],
            [
                'id_categoria' => $gpu->id ?? 1,
                'nombre' => 'RTX 4080 Super OC',
                'slug' => 'rtx-4080-super-oc',
                'descripcion' => 'Potencia extrema para 4K con trazado de rayos de tercera generación.',
                'precio_proveedor' => 850.00,
                'precio_venta' => 1099.99,
                'imagen_principal' => 'images/productos/rtx_4080_super_oc.png',
                'destacado' => true,
            ],
            [
                'id_categoria' => $cpu->id ?? 1,
                'nombre' => 'Ryzen 7 7800X3D',
                'slug' => 'ryzen-7-7800x3d',
                'descripcion' => 'El mejor procesador para gaming con tecnología 3D V-Cache.',
                'precio_proveedor' => 320.00,
                'precio_venta' => 449.99,
                'imagen_principal' => 'images/productos/ryzen_7_7800x3d.png',
                'destacado' => true,
            ],
            [
                'id_categoria' => $sillas->id ?? 1,
                'nombre' => 'Silla Ergonómica Omega v2',
                'slug' => 'silla-omega-v2',
                'descripcion' => 'Cuero sintético premium, pistón de clase 4 y soporte lumbar ajustable.',
                'precio_proveedor' => 150.00,
                'precio_venta' => 299.99,
                'imagen_principal' => 'images/productos/silla_omega_v2.png',
                'destacado' => false,
            ],
            [
                'id_categoria' => $ram->id ?? 1,
                'nombre' => 'Memoria RAM DDR5 32GB 6000MHz',
                'slug' => 'ram-ddr5-32gb-6000mhz',
                'descripcion' => 'Kit de 2x16GB con perfiles EXPO/XMP 3.0 para máximo rendimiento.',
                'precio_proveedor' => 80.00,
                'precio_venta' => 145.50,
                'imagen_principal' => 'images/productos/ram_ddr5_32gb_6000mhz.png',
                'destacado' => false,
            ],
            [
                'id_categoria' => $ssd->id ?? 1,
                'nombre' => 'SSD NVMe Gen4 2TB Extreme',
                'slug' => 'ssd-nvme-gen4-2tb-extreme',
                'descripcion' => 'Velocidades de lectura de hasta 7400MB/s, ideal para PS5 y PC.',
                'precio_proveedor' => 95.00,
                'precio_venta' => 179.99,
                'imagen_principal' => 'images/productos/ssd_nvme_gen4_2tb_extreme.png',
                'destacado' => true,
            ],
            [
                'id_categoria' => $monitores->id ?? 1,
                'nombre' => 'Monitor Gaming 27" 1440p 165Hz',
                'slug' => 'monitor-gaming-27-1440p',
                'descripcion' => 'Panel IPS, 1ms de respuesta y compatible con G-Sync.',
                'precio_proveedor' => 180.00,
                'precio_venta' => 349.00,
                'imagen_principal' => 'images/productos/monitor_gaming_27_1440p.png',
                'destacado' => true,
            ],
            [
                'id_categoria' => $microfonos->id ?? 1,
                'nombre' => 'Micrófono USB Cardioide Pro',
                'slug' => 'microfono-usb-cardioide',
                'descripcion' => 'Perfecto para streaming y podcasts, plug and play con soporte incluido.',
                'precio_proveedor' => 40.00,
                'precio_venta' => 79.99,
                'imagen_principal' => 'images/productos/microfono_usb_cardioide.png',
                'destacado' => false,
            ],
            [
                'id_categoria' => $teclados->id ?? 1,
                'nombre' => 'Teclado 60% Wireless',
                'slug' => 'teclado-60-wireless',
                'descripcion' => 'Diseño compacto, conexión dual 2.4GHz y Bluetooth.',
                'precio_proveedor' => 50.00,
                'precio_venta' => 95.00,
                'imagen_principal' => 'images/productos/teclado_60_wireless.png',
                'destacado' => false,
            ],
            [
                'id_categoria' => $ratones->id ?? 1,
                'nombre' => 'Ratón Ergonómico para MMO',
                'slug' => 'raton-mmo-pro',
                'descripcion' => '12 botones laterales programables y ajuste de peso.',
                'precio_proveedor' => 35.00,
                'precio_venta' => 69.99,
                'imagen_principal' => 'images/productos/raton_mmo_pro.png',
                'destacado' => false,
            ],
            [
                'id_categoria' => $gpu->id ?? 1,
                'nombre' => 'RX 7900 XTX 24GB',
                'slug' => 'rx-7900-xtx-24gb',
                'descripcion' => 'Arquitectura RDNA 3 para un rendimiento masivo en rasterización.',
                'precio_proveedor' => 780.00,
                'precio_venta' => 950.00,
                'imagen_principal' => 'images/productos/rx_7900_xtx_24gb.png',
                'destacado' => false,
            ],
            [
                'id_categoria' => $cpu->id ?? 1,
                'nombre' => 'Core i9-14900K',
                'slug' => 'core-i9-14900k',
                'descripcion' => '24 núcleos y 32 hilos, frecuencia máxima de 6.0GHz.',
                'precio_proveedor' => 450.00,
                'precio_venta' => 589.99,
                'imagen_principal' => 'images/productos/core_i9_14900k.png',
                'destacado' => false,
            ],
            [
                'id_categoria' => $auriculares->id ?? 1,
                'nombre' => 'IEMs Gaming de Alta Fidelidad',
                'slug' => 'iems-gaming-hifi',
                'descripcion' => 'Auriculares intrauditivos optimizados para posicionamiento de sonido.',
                'precio_proveedor' => 30.00,
                'precio_venta' => 59.99,
                'imagen_principal' => 'images/productos/iems_gaming_hifi.png',
                'destacado' => false,
            ],
            [
                'id_categoria' => $sillas->id ?? 1,
                'nombre' => 'Escritorio Elevable Eléctrico',
                'slug' => 'escritorio-elevable-gaming',
                'descripcion' => 'Ajuste de altura con memoria y soporte para cables.',
                'precio_proveedor' => 200.00,
                'precio_venta' => 399.00,
                'imagen_principal' => 'images/productos/escritorio_elevable_gaming.png',
                'destacado' => false,
            ],
            [
                'id_categoria' => $ram->id ?? 1,
                'nombre' => 'Memoria RAM RGB 16GB 3600MHz',
                'slug' => 'ram-rgb-16gb-3600mhz',
                'descripcion' => 'Kit DDR4 clásico con excelente iluminación y compatibilidad.',
                'precio_proveedor' => 35.00,
                'precio_venta' => 65.00,
                'imagen_principal' => 'images/productos/ram_rgb_16gb_3600mhz.png',
                'destacado' => false,
            ],
            [
                'id_categoria' => $ssd->id ?? 1,
                'nombre' => 'SSD Externo Rugged 1TB',
                'slug' => 'ssd-externo-rugged-1tb',
                'descripcion' => 'Resistente a golpes y agua, USB-C 3.2 Gen2.',
                'precio_proveedor' => 55.00,
                'precio_venta' => 99.00,
                'imagen_principal' => 'images/productos/ssd_externo_rugged_1tb.png',
                'destacado' => false,
            ],
            [
                'id_categoria' => $monitores->id ?? 1,
                'nombre' => 'Monitor 4K 144Hz OLED',
                'slug' => 'monitor-4k-oled-144hz',
                'descripcion' => 'Negros perfectos y tiempo de respuesta casi instantáneo.',
                'precio_proveedor' => 650.00,
                'precio_venta' => 899.99,
                'imagen_principal' => 'images/productos/monitor_4k_oled_144hz.png',
                'destacado' => true,
            ],
            [
                'id_categoria' => $microfonos->id ?? 1,
                'nombre' => 'Brazo de Micrófono Profesional',
                'slug' => 'brazo-microfono-pro',
                'descripcion' => 'Movimiento silencioso y gestión de cables interna.',
                'precio_proveedor' => 45.00,
                'precio_venta' => 85.00,
                'imagen_principal' => 'images/productos/brazo_microfono_pro.png',
                'destacado' => false,
            ],
            // ─── MERCHANDISING ────────────────────────────────────────────
            [
                'id_categoria' => $camisetas->id ?? $merchandising->id ?? 1,
                'nombre' => 'Camiseta Gaming TierOne Negra',
                'slug' => 'camiseta-gaming-tierone-negra',
                'descripcion' => 'Camiseta 100% algodón premium con logo TierOne estampado en serigrafía. Disponible en tallas S-XXL.',
                'precio_proveedor' => 8.00,
                'precio_venta' => 24.99,
                'imagen_principal' => 'images/productos/camiseta_gaming_tierone_negra.png',
                'destacado' => true,
            ],
            [
                'id_categoria' => $merchandising->id ?? 1,
                'nombre' => 'Sudadera Hoodie TierOne Negro/Rojo',
                'slug' => 'sudadera-hoodie-tierone-negro-rojo',
                'descripcion' => 'Sudadera con capucha y bolsillo canguro. Algodón pesado 400g, bordado en pecho y espalda.',
                'precio_proveedor' => 20.00,
                'precio_venta' => 59.99,
                'imagen_principal' => 'images/productos/sudadera_hoodie_tierone.png',
                'destacado' => true,
            ],
            [
                'id_categoria' => $merchandising->id ?? 1,
                'nombre' => 'Sudadera Zip TierOne Gris',
                'slug' => 'sudadera-zip-tierone-gris',
                'descripcion' => 'Sudadera con cremallera completa, forro polar interior y logo TierOne en relieve.',
                'precio_proveedor' => 22.00,
                'precio_venta' => 64.99,
                'imagen_principal' => 'images/productos/sudadera_zip_tierone_gris.png',
                'destacado' => false,
            ],
            [
                'id_categoria' => $merchandising->id ?? 1,
                'nombre' => 'Gorra Snapback TierOne',
                'slug' => 'gorra-snapback-tierone',
                'descripcion' => 'Gorra snapback ajustable con visera plana y logo TierOne bordado en 3D. Talla única.',
                'precio_proveedor' => 7.00,
                'precio_venta' => 19.99,
                'imagen_principal' => 'images/productos/gorra_snapback_tierone.png',
                'destacado' => false,
            ],
            [
                'id_categoria' => $merchandising->id ?? 1,
                'nombre' => 'Pack Calcetines Gaming x3',
                'slug' => 'pack-calcetines-gaming-x3',
                'descripcion' => 'Pack de 3 pares de calcetines con diseños gaming exclusivos. Algodón con refuerzo en talón.',
                'precio_proveedor' => 5.00,
                'precio_venta' => 14.99,
                'imagen_principal' => 'images/productos/calcetines_gaming_pack.png',
                'destacado' => false,
            ],
            [
                'id_categoria' => $figuras->id ?? $merchandising->id ?? 1,
                'nombre' => 'Mochila Gaming TierOne 30L',
                'slug' => 'mochila-gaming-tierone-30l',
                'descripcion' => 'Mochila resistente al agua con compartimento acolchado para portátil 17" y organización para periféricos.',
                'precio_proveedor' => 25.00,
                'precio_venta' => 69.99,
                'imagen_principal' => 'images/productos/mochila_gaming_tierone.png',
                'destacado' => true,
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
