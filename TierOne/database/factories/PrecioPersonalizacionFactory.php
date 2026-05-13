<?php

namespace Database\Factories;

use App\Models\Producto;
use Illuminate\Database\Eloquent\Factories\Factory;

class PrecioPersonalizacionFactory extends Factory
{
    public function definition(): array
    {
        return [
            'id_producto' => null, // null means global price
            'tipo_elemento' => fake()->randomElement(['texto', 'imagen']),
            'precio' => fake()->randomFloat(2, 1, 10),
        ];
    }
}
