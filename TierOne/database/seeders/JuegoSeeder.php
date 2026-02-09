<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Juego;

class JuegoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Juego::create([
            'nombre' => 'League of Legends',
            'slug' => 'league-of-legends',
            'descripcion' => 'MOBA competitivo 5v5 desarrollado por Riot Games',
            'imagen_url' => 'https://example.com/lol.jpg',
            'categoria' => 'MOBA',
            'activo' => true,
        ]);

        Juego::create([
            'nombre' => 'Counter-Strike 2',
            'slug' => 'counter-strike-2',
            'descripcion' => 'FPS táctico competitivo desarrollado por Valve',
            'imagen_url' => 'https://example.com/cs2.jpg',
            'categoria' => 'FPS',
            'activo' => true,
        ]);

        Juego::create([
            'nombre' => 'Valorant',
            'slug' => 'valorant',
            'descripcion' => 'FPS táctico con habilidades desarrollado por Riot Games',
            'imagen_url' => 'https://example.com/valorant.jpg',
            'categoria' => 'FPS',
            'activo' => true,
        ]);

        Juego::create([
            'nombre' => 'Dota 2',
            'slug' => 'dota-2',
            'descripcion' => 'MOBA competitivo desarrollado por Valve',
            'imagen_url' => 'https://example.com/dota2.jpg',
            'categoria' => 'MOBA',
            'activo' => true,
        ]);

        Juego::create([
            'nombre' => 'Fortnite',
            'slug' => 'fortnite',
            'descripcion' => 'Battle Royale desarrollado por Epic Games',
            'imagen_url' => 'https://example.com/fortnite.jpg',
            'categoria' => 'Battle Royale',
            'activo' => false,
        ]);
    }
}
