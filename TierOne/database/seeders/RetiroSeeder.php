<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Retiro;
use App\Models\User;

class RetiroSeeder extends Seeder
{
    private const TOTAL_RECORDS = 20;

    public function run(): void
    {
        $usuarios = User::where('rol', 'player')->get();
        $admins = User::where('rol', 'admin')->get();

        if ($usuarios->isEmpty()) {
            return;
        }

        $metodos = ['transferencia', 'paypal', 'cripto'];
        $estados = ['pendiente', 'procesando', 'completado', 'rechazado'];

        for ($i = 0; $i < self::TOTAL_RECORDS; $i++) {
            Retiro::create([
                'id_usuario' => $usuarios->random()->id,
                'id_procesado_por' => rand(0, 1) ? $admins->random()->id : null,
                'monto' => rand(20, 500),
                'metodo' => $metodos[array_rand($metodos)],
                'detalles_cuenta' => 'Cuenta: ES00 0000 0000 0000 0000',
                'estado' => $estados[array_rand($estados)],
                'fecha_solicitud' => now()->subDays(rand(1, 10)),
                'fecha_procesado' => rand(0, 1) ? now() : null,
                'notas_admin' => 'Procesado correctamente.',
            ]);
        }
    }
}
