<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PartidaTorneo;
use App\Models\Torneo;
use App\Models\Partida;

class PartidaTorneoSeeder extends Seeder
{
    private const TOTAL_RECORDS = 20;

    public function run(): void
    {
        $torneos = Torneo::all();
        $partidas = Partida::all();

        if ($torneos->isEmpty() || $partidas->isEmpty()) {
            return;
        }

        for ($i = 0; $i < self::TOTAL_RECORDS; $i++) {
            PartidaTorneo::create([
                'id_torneo' => $torneos->random()->id,
                'id_partida' => $partidas->random()->id,
                'id_siguiente_partida' => null, // Para brackets complejos
                'ronda' => rand(1, 4),
                'bracket_posicion' => rand(1, 8),
                'tipo_bracket' => ['winners', 'losers', 'final'][rand(0, 2)],
            ]);
        }
    }
}
