<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\InscripcionTorneo;
use App\Models\Torneo;
use App\Models\User;

class InscripcionTorneoSeeder extends Seeder
{
    private const TOTAL_RECORDS = 20;

    public function run(): void
    {
        $torneos = Torneo::all();
        $usuarios = User::where('rol', 'player')->get();

        if ($torneos->isEmpty() || $usuarios->isEmpty()) {
            return;
        }

        for ($i = 0; $i < self::TOTAL_RECORDS; $i++) {
            $torneo = $torneos->random();
            InscripcionTorneo::create([
                'id_torneo' => $torneo->id,
                'id_usuario' => $usuarios->random()->id,
                'id_equipo' => null, // Opcional por ahora
                'pago_cuota' => $torneo->cuota_inscripcion,
                'fecha_inscripcion' => now()->subDays(rand(0, 5)),
                'estado' => ['confirmada', 'pendiente', 'cancelada'][rand(0, 2)],
            ]);
        }
    }
}
