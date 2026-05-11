<?php

namespace Database\Factories;

use App\Models\Categoria;
use App\Models\Proveedor;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ProductoFactory extends Factory
{
    public function definition(): array
    {
        $nombre = fake()->unique()->words(3, true);
        return [
            'id_categoria' => Categoria::factory(),
            'id_proveedor' => Proveedor::factory(),
            'nombre' => $nombre,
            'slug' => Str::slug($nombre),
            'descripcion' => fake()->paragraphs(3, true),
            'precio_proveedor' => fake()->randomFloat(2, 10, 100),
            'precio_venta' => fake()->randomFloat(2, 110, 200),
            'imagen_principal' => '/storage/products/default.jpg',
            'destacado' => fake()->boolean(20),
            'activo' => true,
            'ventas_totales' => 0,
            'rating_promedio' => 0.00,
        ];
    }
}
