<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ResultadosPartida;
use App\Models\Partida;
use App\Models\User;

class ResultadosPartidaSeeder extends Seeder
{
    private const TOTAL_RECORDS = 20;

    public function run(): void
    {
        $partidas = Partida::where('estado', 'finalizada')->get();
        $admins = User::where('rol', 'admin')->get();

        if ($partidas->isEmpty()) {
            // Si no hay finalizadas en el seeder, buscamos cualquier partida para asegurar los 20 datos
            $partidas = Partida::all();
        }

        if ($partidas->isEmpty()) return;

        for ($i = 0; $i < self::TOTAL_RECORDS; $i++) {
            $partida = $partidas->random();
            ResultadosPartida::create([
                'id_partida' => $partida->id,
                'id_verificado_por' => $admins->random()->id ?? 1,
                'ganador' => rand(0, 1) ? 'Equipo A' : 'Equipo B',
                'detalles_json' => [
                    'puntuacion_a' => rand(10, 50),
                    'puntuacion_b' => rand(10, 50),
                    'mvp' => 'Usuario Random',
                ],
                'fecha_sincronizacion_api' => now(),
                'verificado_automaticamente' => (bool)rand(0, 1),
                'fecha_registro' => now(),
                'disputado' => false,
            ]);
        }
    }
}
