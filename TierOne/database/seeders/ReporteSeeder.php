<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Reporte;
use App\Models\Partida;
use App\Models\User;

class ReporteSeeder extends Seeder
{
    private const TOTAL_RECORDS = 20;

    public function run(): void
    {
        $partidas = Partida::all();
        $usuarios = User::where('rol', 'player')->get();
        $admins = User::where('rol', 'admin')->get();

        if ($partidas->isEmpty() || $usuarios->isEmpty()) {
            return;
        }

        $tipos = ['trampa', 'comportamiento', 'resultado_erroneo', 'otro'];
        $estados = ['pendiente', 'en_revision', 'resuelta', 'desestimada'];

        for ($i = 0; $i < self::TOTAL_RECORDS; $i++) {
            Reporte::create([
                'id_partida' => $partidas->random()->id,
                'id_usuario_reporta' => $usuarios->random()->id,
                'id_resuelto_por' => rand(0, 1) ? $admins->random()->id : null,
                'tipo' => $tipos[array_rand($tipos)],
                'descripcion' => 'El jugador contrario está usando hacks para ver a través de las paredes.',
                'evidencia_url' => 'https://example.com/evidencia/clip-' . $i . '.mp4',
                'estado' => $estados[array_rand($estados)],
                'resolucion' => rand(0, 1) ? 'Baneo aplicado tras revisión.' : null,
                'fecha_reporte' => now()->subDays(rand(1, 5)),
                'fecha_resolucion' => rand(0, 1) ? now() : null,
            ]);
        }
    }
}
