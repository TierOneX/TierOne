<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PremioTorneo;
use App\Models\Torneo;
use App\Models\User;

class PremioTorneoSeeder extends Seeder
{
    private const TOTAL_RECORDS = 20;

    public function run(): void
    {
        $torneos = Torneo::all();
        $usuarios = User::where('rol', 'player')->get();

        if ($torneos->isEmpty()) {
            return;
        }

        for ($i = 0; $i < self::TOTAL_RECORDS; $i++) {
            $torneo = $torneos->random();
            $posicion = rand(1, 4);
            PremioTorneo::create([
                'id_torneo' => $torneo->id,
                'id_ganador' => rand(0, 1) ? $usuarios->random()->id : null,
                'posicion' => $posicion,
                'monto' => $torneo->premio_total / $posicion,
                'descripcion' => "Premio para el " . $posicion . "º lugar",
                'entregado' => (bool)rand(0, 1),
                'fecha_entrega' => rand(0, 1) ? now()->subDays(rand(1, 10)) : null,
            ]);
        }
    }
}
