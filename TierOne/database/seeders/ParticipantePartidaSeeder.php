<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ParticipantePartida;
use App\Models\Partida;
use App\Models\User;

class ParticipantePartidaSeeder extends Seeder
{
    private const TOTAL_RECORDS = 20;

    public function run(): void
    {
        $partidas = Partida::all();
        $usuarios = User::where('rol', 'player')->get();

        if ($partidas->isEmpty() || $usuarios->isEmpty()) {
            return;
        }

        for ($i = 0; $i < self::TOTAL_RECORDS; $i++) {
            $partida = $partidas->random();
            ParticipantePartida::create([
                'id_partida' => $partida->id,
                'id_usuario' => $usuarios->random()->id,
                'equipo_asignado' => rand(0, 1) ? 'Equipo A' : 'Equipo B',
                'pago_entrada' => $partida->buy_in,
                'confirmado' => (bool)rand(0, 1),
                'fecha_union' => now(),
            ]);
        }
    }
}
