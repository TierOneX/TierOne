<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ItemOrden;
use App\Models\Orden;
use App\Models\Producto;
use App\Models\VarianteProducto;
use App\Models\Proveedor;

class ItemOrdenSeeder extends Seeder
{
    private const TOTAL_RECORDS = 20;

    public function run(): void
    {
        $ordenes = Orden::all();
        $productos = Producto::all();
        $proveedores = Proveedor::all();

        if ($ordenes->isEmpty() || $productos->isEmpty()) {
            return;
        }

        for ($i = 0; $i < self::TOTAL_RECORDS; $i++) {
            $producto = $productos->random();
            $variante = VarianteProducto::where('id_producto', $producto->id)->first();
            
            ItemOrden::create([
                'id_orden' => $ordenes->random()->id,
                'id_producto' => $producto->id,
                'id_variante' => $variante->id ?? null,
                'id_proveedor' => $producto->id_proveedor ?? $proveedores->random()->id,
                'cantidad' => rand(1, 3),
                'precio_unitario' => $producto->precio_venta,
                'subtotal' => $producto->precio_venta * rand(1, 3),
            ]);
        }
    }
}
