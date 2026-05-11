<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Orden;
use App\Models\User;
use App\Models\DireccionEnvio;
use Illuminate\Support\Str;

class OrdenSeeder extends Seeder
{
    private const TOTAL_RECORDS = 20;

    public function run(): void
    {
        $usuarios = User::where('rol', 'player')->get();
        $direcciones = DireccionEnvio::all();

        if ($direcciones->isEmpty()) {
            return;
        }

        $estados = ['pendiente', 'pagada', 'enviada_proveedor', 'en_transito', 'entregada', 'cancelada'];

        for ($i = 1; $i <= self::TOTAL_RECORDS; $i++) {
            $direccion = $direcciones->random();
            $usuario = User::find($direccion->id_usuario);

            Orden::create([
                'id_usuario' => $usuario->id,
                'id_direccion_envio' => $direccion->id,
                'numero_orden' => 'TIO-' . strtoupper(Str::random(8)),
                'subtotal' => rand(50, 200),
                'impuestos' => rand(10, 40),
                'costo_envio' => rand(5, 15),
                'descuento' => 0,
                'total' => rand(70, 250),
                'estado' => $estados[array_rand($estados)],
                'fecha_orden' => now()->subDays(rand(1, 30)),
                'tracking_number' => rand(0, 1) ? 'TRK' . rand(100000, 999999) : null,
                'transportista' => rand(0, 1) ? 'Correos' : 'SEUR',
            ]);
        }
    }
}
