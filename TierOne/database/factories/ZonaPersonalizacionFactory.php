<?php

namespace Database\Factories;

use App\Models\Producto;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ZonaPersonalizacionFactory extends Factory
{
    public function definition(): array
    {
        $nombre = fake()->words(2, true);
        return [
            'id_producto' => Producto::factory(),
            'nombre' => $nombre,
            'slug' => Str::slug($nombre),
            'tipo' => 'impresion',
            'imagen_base' => '/storage/custom/base.png',
            'area_x' => 100,
            'area_y' => 100,
            'area_width' => 200,
            'area_height' => 200,
            'canvas_width' => 1000,
            'canvas_height' => 1000,
            'orden' => 1,
            'activa' => true,
        ];
    }
}
