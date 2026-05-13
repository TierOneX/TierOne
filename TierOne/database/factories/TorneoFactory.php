<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Juego;
use Illuminate\Database\Eloquent\Factories\Factory;

class TorneoFactory extends Factory
{
    public function definition(): array
    {
        return [
            'id_juego' => Juego::factory(),
            'id_organizador' => User::factory(),
            'nombre' => fake()->words(3, true),
            'descripcion' => fake()->paragraph(),
            'imagen_banner' => 'https://via.placeholder.com/800x400.png',
            'formato' => 'eliminacion_simple',
            'max_participantes' => 16,
            'cuota_inscripcion' => 0.00,
            'premio_total' => 100.00,
            'comision_plataforma_porcentaje' => 10.00,
            'es_gratuito' => true,
            'fecha_inicio' => now()->addDays(7),
            'fecha_fin' => now()->addDays(10),
            'cierre_inscripciones' => now()->addDays(6),
            'estado' => 'inscripciones',
            'reglas_url' => 'https://tierone.com/reglas',
            'stream_url' => 'https://twitch.tv/tierone',
            'verificado' => true,
        ];
    }
}
