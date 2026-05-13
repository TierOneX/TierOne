<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Torneo;
use App\Models\Juego;
use App\Models\User;
use Illuminate\Support\Facades\File;

class TorneoSeeder extends Seeder
{
    private const TOTAL_RECORDS = 20;
    private const DATA_FILE = 'database/seeders/data/torneos.json';

    public function run(): void
    {
        $juegos = Juego::all();
        $organizadores = User::where('rol', 'admin')->get();

        if ($juegos->isEmpty() || $organizadores->isEmpty()) {
            return;
        }

        if ($this->seedFromJson($juegos, $organizadores)) {
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

    private function seedFromJson($juegos, $organizadores): bool
    {
        $path = base_path(self::DATA_FILE);

        if (! File::exists($path)) {
            return false;
        }

        $content = File::get($path);
        $records = json_decode($content, true);

        if (! is_array($records) || empty($records)) {
            return false;
        }

        foreach ($records as $record) {
            $juego = Juego::where('slug', $record['juego_slug'] ?? '')->first();
            $organizador = User::where('email', $record['organizador_email'] ?? '')
                ->where('rol', 'admin')
                ->first();

            if (! $juego || ! $organizador) {
                continue;
            }

            $cuota = (float) ($record['cuota_inscripcion'] ?? 0);

            Torneo::create([
                'id_juego' => $juego->id,
                'id_organizador' => $organizador->id,
                'nombre' => $record['nombre'] ?? 'Torneo sin nombre',
                'descripcion' => $record['descripcion'] ?? 'Torneo de prueba',
                'imagen_banner' => $record['imagen_banner'] ?? 'images/torneos/default-banner.png',
                'formato' => $record['formato'] ?? 'eliminacion_simple',
                'max_participantes' => (int) ($record['max_participantes'] ?? 16),
                'cuota_inscripcion' => $cuota,
                'premio_total' => (float) ($record['premio_total'] ?? 0),
                'comision_plataforma_porcentaje' => (float) ($record['comision_plataforma_porcentaje'] ?? 10),
                'es_gratuito' => $cuota <= 0,
                'fecha_inicio' => $record['fecha_inicio'] ?? now()->addDays(7),
                'fecha_fin' => $record['fecha_fin'] ?? now()->addDays(8),
                'cierre_inscripciones' => $record['cierre_inscripciones'] ?? now()->addDays(6),
                'estado' => $record['estado'] ?? 'inscripciones',
                'reglas_url' => $record['reglas_url'] ?? 'https://example.com/reglas',
                'stream_url' => $record['stream_url'] ?? 'https://twitch.tv/tierone',
                'verificado' => (bool) ($record['verificado'] ?? true),
            ]);
        }

        return true;
    }
}
