<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ImagenProducto;
use App\Models\Producto;

class ImagenProductoSeeder extends Seeder
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

        // Crearemos 20 registros de imágenes distribuidos en los productos existentes
        $count = 0;
        foreach ($productos as $producto) {
            if ($count >= 20) break;

            ImagenProducto::create([
                'id_producto' => $producto->id,
                'url' => "https://example.com/gallery/{$producto->slug}-side.jpg",
                'orden' => 1,
                'es_principal' => false,
            ]);

            $count++;

            // Para los productos pares, añadimos una imagen extra si aún no llegamos a 20
            if ($count < 20 && $producto->id % 2 == 0) {
                ImagenProducto::create([
                    'id_producto' => $producto->id,
                    'url' => "https://example.com/gallery/{$producto->slug}-box.jpg",
                    'orden' => 2,
                    'es_principal' => false,
                ]);
                $count++;
            }
        }
    }
}
