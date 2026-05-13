<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\DireccionEnvio;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class OrdenFactory extends Factory
{
    public function definition(): array
    {
        return [
            'id_usuario' => User::factory(),
            'id_direccion_envio' => DireccionEnvio::factory(),
            'numero_orden' => 'ORD-' . strtoupper(Str::random(10)),
            'subtotal' => 0,
            'impuestos' => 0,
            'costo_envio' => 0,
            'descuento' => 0,
            'total' => 0,
            'estado' => 'pendiente',
            'fecha_orden' => now(),
        ];
    }
}
