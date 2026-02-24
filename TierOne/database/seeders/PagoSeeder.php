<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Pago;
use App\Models\Orden;

class PagoSeeder extends Seeder
{
    private const TOTAL_RECORDS = 20;

    public function run(): void
    {
        $ordenes = Orden::all();

        if ($ordenes->isEmpty()) {
            return;
        }

        $metodos = ['tarjeta', 'paypal', 'transferencia', 'balance'];
        $estados = ['completado', 'pendiente', 'fallido'];

        for ($i = 0; $i < self::TOTAL_RECORDS; $i++) {
            $orden = $ordenes->random();
            Pago::create([
                'id_orden' => $orden->id,
                'monto' => $orden->total,
                'metodo' => $metodos[array_rand($metodos)],
                'id_transaccion' => 'PAY-' . rand(100000, 999999),
                'estado' => $estados[array_rand($estados)],
                'fecha_pago' => now(),
                'detalles_json' => ['ip' => '127.0.0.1', 'user_agent' => 'Mozilla/5.0'],
            ]);
        }
    }
}
