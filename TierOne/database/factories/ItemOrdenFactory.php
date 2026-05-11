<?php

namespace Database\Factories;

use App\Models\Orden;
use App\Models\Producto;
use App\Models\Proveedor;
use Illuminate\Database\Eloquent\Factories\Factory;

class ItemOrdenFactory extends Factory
{
    public function definition(): array
    {
        $cantidad = fake()->numberBetween(1, 5);
        $precioUnitario = fake()->randomFloat(2, 50, 150);

        return [
            'id_orden' => Orden::factory(),
            'id_producto' => Producto::factory(),
            'id_proveedor' => Proveedor::factory(),
            'cantidad' => $cantidad,
            'precio_unitario' => $precioUnitario,
            'subtotal' => $cantidad * $precioUnitario,
        ];
    }
}
