<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ProveedorFactory extends Factory
{
    public function definition(): array
    {
        $nombre = fake()->unique()->company();
        return [
            'nombre' => $nombre,
            'slug' => Str::slug($nombre),
            'contacto_nombre' => fake()->name(),
            'email' => fake()->unique()->companyEmail(),
            'telefono' => fake()->phoneNumber(),
            'direccion' => fake()->address(),
            'activo' => true,
        ];
    }
}
