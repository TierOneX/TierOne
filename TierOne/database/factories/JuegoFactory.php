<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class JuegoFactory extends Factory
{
    public function definition(): array
    {
        $nombre = fake()->unique()->word();
        return [
            'nombre' => $nombre,
            'slug' => Str::slug($nombre),
            'descripcion' => fake()->sentence(),
            'categoria' => 'eSports',
            'activo' => true,
        ];
    }
}
