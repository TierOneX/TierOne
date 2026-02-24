<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Torneo;
use App\Models\Juego;
use App\Models\User;

class TorneoSeeder extends Seeder
{
    private const TOTAL_RECORDS = 20;

    public function run(): void
    {
        $juegos = Juego::all();
        $organizadores = User::whereIn('rol', ['admin', 'streamer'])->get();

        if ($juegos->isEmpty() || $organizadores->isEmpty()) {
            return;
        }

        $formatos = ['eliminacion_simple', 'doble_eliminacion', 'round_robin', 'swiss'];
        $estados = ['inscripciones', 'en_curso', 'finalizado'];

        for ($i = 1; $i <= self::TOTAL_RECORDS; $i++) {
            $juego = $juegos->random();
            Torneo::create([
                'id_juego' => $juego->id,
                'id_organizador' => $organizadores->random()->id,
                'nombre' => "Torneo " . $juego->nombre . " - Edición #$i",
                'descripcion' => "Gran competición de " . $juego->nombre . " con premios increíbles. ¡Demuestra tu nivel!",
                'imagen_banner' => "assets/torneos/banner_torneo_$i.png",
                'formato' => $formatos[array_rand($formatos)],
                'max_participantes' => [16, 32, 64, 128][rand(0, 3)],
                'cuota_inscripcion' => rand(0, 1) ? 0.00 : rand(5, 20),
                'premio_total' => rand(100, 1000),
                'comision_plataforma_porcentaje' => 10.00,
                'es_gratuito' => rand(0, 1) === 0,
                'fecha_inicio' => now()->addDays(rand(5, 30)),
                'fecha_fin' => now()->addDays(rand(31, 40)),
                'cierre_inscripciones' => now()->addDays(rand(1, 4)),
                'estado' => $estados[array_rand($estados)],
                'reglas_url' => 'https://example.com/reglas',
                'stream_url' => 'https://twitch.tv/tierone',
                'verificado' => (bool) rand(0, 1),
            ]);
        }
    }
}
