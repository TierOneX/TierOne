<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Partida;
use App\Models\Juego;
use App\Models\User;

class PartidaSeeder extends Seeder
{
    private const TOTAL_RECORDS = 20;

    public function run(): void
    {
        $juegos = Juego::all();
        $usuarios = User::all();

        if ($juegos->isEmpty() || $usuarios->isEmpty()) {
            return;
        }

        $tipos = ['1v1', '2v2', '5v5', 'FFA'];
        $estados = ['esperando', 'en_curso', 'finalizada', 'cancelada'];

        for ($i = 1; $i <= self::TOTAL_RECORDS; $i++) {
            $juego = $juegos->random();
            Partida::create([
                'id_juego' => $juego->id,
                'id_creador' => $usuarios->random()->id,
                'titulo' => "Partida de " . $juego->nombre . " #$i",
                'tipo' => $tipos[array_rand($tipos)],
                'buy_in' => rand(0, 50),
                'premio_total' => rand(50, 500),
                'comision_plataforma' => rand(1, 10),
                'fecha_inicio' => now()->addHours(rand(1, 48)),
                'fecha_fin' => now()->addHours(rand(49, 100)),
                'estado' => $estados[array_rand($estados)],
                'origen' => 'plataforma',
            ]);
        }
    }
}
