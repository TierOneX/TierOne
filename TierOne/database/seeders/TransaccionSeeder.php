<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Transaccion;
use App\Models\User;
use App\Models\Orden;
use App\Models\Torneo;
use App\Models\Retiro;

class TransaccionSeeder extends Seeder
{
    private const TOTAL_RECORDS = 20;

    public function run(): void
    {
        $usuarios = User::all();
        $ordenes = Orden::all();
        $torneos = Torneo::all();
        $retiros = Retiro::all();

        if ($usuarios->isEmpty()) {
            return;
        }

        $tipos = ['compra', 'premio', 'deposito', 'retiro', 'comision'];

        for ($i = 0; $i < self::TOTAL_RECORDS; $i++) {
            $usuario = $usuarios->random();
            $monto = rand(10, 500);
            $balance_anterior = rand(500, 2000);
            
            Transaccion::create([
                'id_usuario' => $usuario->id,
                'id_orden' => rand(0, 1) ? $ordenes->random()->id : null,
                'id_torneo' => rand(0, 5) === 0 ? $torneos->random()->id : null,
                'id_retiro' => rand(0, 5) === 0 ? $retiros->random()->id : null,
                'tipo' => $tipos[array_rand($tipos)],
                'monto' => $monto,
                'balance_anterior' => $balance_anterior,
                'balance_nuevo' => $balance_anterior + $monto,
                'descripcion' => 'Transacción de prueba #' . ($i + 1),
                'fecha_transaccion' => now(),
            ]);
        }
    }
}
