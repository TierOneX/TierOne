<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\DireccionEnvio;
use App\Models\User;

class DireccionEnvioSeeder extends Seeder
{
    private const TOTAL_RECORDS = 20;

    public function run(): void
    {
        $usuarios = User::where('rol', 'player')->get();

        if ($usuarios->isEmpty()) {
            return;
        }

        for ($i = 0; $i < self::TOTAL_RECORDS; $i++) {
            $usuario = $usuarios->random();
            DireccionEnvio::create([
                'id_usuario' => $usuario->id,
                'nombre_completo' => $usuario->nombre . ' ' . $usuario->apellido,
                'direccion_linea1' => 'Calle Falsa ' . rand(1, 999),
                'ciudad' => ['Madrid', 'Barcelona', 'Valencia', 'Sevilla'][rand(0, 3)],
                'estado_provincia' => 'Provincia',
                'codigo_postal' => rand(10000, 50000),
                'pais' => 'España',
                'telefono' => '+34 600 000 000',
                'predeterminada' => $i < 5, // Las primeras 5 son predeterminadas
            ]);
        }
    }
}
