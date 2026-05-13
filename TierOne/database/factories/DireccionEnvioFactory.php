<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class DireccionEnvioFactory extends Factory
{
    public function definition(): array
    {
        return [
            'id_usuario' => User::factory(),
            'nombre_completo' => fake()->name(),
            'direccion_linea1' => fake()->streetAddress(),
            'ciudad' => fake()->city(),
            'estado_provincia' => fake()->state(),
            'codigo_postal' => fake()->postcode(),
            'pais' => fake()->country(),
            'telefono' => fake()->phoneNumber(),
            'predeterminada' => true,
        ];
    }
}
