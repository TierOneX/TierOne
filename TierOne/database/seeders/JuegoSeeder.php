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
            'imagen_url' => 'assets/juegos/portada_lol.png',
            'categoria' => 'MOBA',
            'activo' => true,
        ]);

        Juego::create([
            'nombre' => 'Counter-Strike 2',
            'slug' => 'counter-strike-2',
            'descripcion' => 'FPS táctico competitivo desarrollado por Valve',
            'imagen_url' => 'assets/juegos/portada_cs2.png',
            'categoria' => 'FPS',
            'activo' => true,
        ]);

        Juego::create([
            'nombre' => 'Valorant',
            'slug' => 'valorant',
            'descripcion' => 'FPS táctico con habilidades desarrollado por Riot Games',
            'imagen_url' => 'assets/juegos/portada_valorant.png',
            'categoria' => 'FPS',
            'activo' => true,
        ]);

        Juego::create([
            'nombre' => 'Dota 2',
            'slug' => 'dota-2',
            'descripcion' => 'MOBA competitivo desarrollado por Valve',
            'imagen_url' => 'assets/juegos/portada_dota2.png',
            'categoria' => 'MOBA',
            'activo' => true,
        ]);

        Juego::create([
            'nombre' => 'Fortnite',
            'slug' => 'fortnite',
            'descripcion' => 'Battle Royale desarrollado por Epic Games',
            'imagen_url' => 'assets/juegos/portada_fortnite.png',
            'categoria' => 'Battle Royale',
            'activo' => true,
        ]);

        Juego::create([
            'nombre' => 'Rocket League',
            'slug' => 'rocket-league',
            'descripcion' => 'Fútbol con coches propulsados por cohetes',
            'imagen_url' => 'assets/juegos/portada_rocket_league.png',
            'categoria' => 'Deportes',
            'activo' => true,
        ]);

        Juego::create([
            'nombre' => 'Apex Legends',
            'slug' => 'apex-legends',
            'descripcion' => 'Battle Royale de héroes ambientado en el universo de Titanfall',
            'imagen_url' => 'assets/juegos/portada_apex.png',
            'categoria' => 'Battle Royale',
            'activo' => true,
        ]);

        Juego::create([
            'nombre' => 'Minecraft',
            'slug' => 'minecraft',
            'descripcion' => 'Juego de construcción y aventuras de mundo abierto',
            'imagen_url' => 'assets/juegos/portada_minecraft.png',
            'categoria' => 'Sandbox',
            'activo' => true,
        ]);

        Juego::create([
            'nombre' => 'World of Warcraft',
            'slug' => 'world-of-warcraft',
            'descripcion' => 'Mítico MMORPG ambientado en el mundo de Azeroth',
            'imagen_url' => 'assets/juegos/portada_wow.png',
            'categoria' => 'MMORPG',
            'activo' => true,
        ]);

        Juego::create([
            'nombre' => 'Overwatch 2',
            'slug' => 'overwatch-2',
            'descripcion' => 'Shooter de héroes competitivo por equipos',
            'imagen_url' => 'assets/juegos/portada_overwatch2.png',
            'categoria' => 'FPS',
            'activo' => true,
        ]);

        Juego::create([
            'nombre' => 'Hearthstone',
            'slug' => 'hearthstone',
            'descripcion' => 'Juego de cartas coleccionables basado en Warcraft',
            'imagen_url' => 'assets/juegos/portada_hearthstone.png',
            'categoria' => 'Cartas',
            'activo' => true,
        ]);

        Juego::create([
            'nombre' => 'Elden Ring',
            'slug' => 'elden-ring',
            'descripcion' => 'RPG de acción épico desarrollado por FromSoftware',
            'imagen_url' => 'assets/juegos/portada_elden_ring.png',
            'categoria' => 'RPG',
            'activo' => true,
        ]);

        Juego::create([
            'nombre' => 'Genshin Impact',
            'slug' => 'genshin-impact',
            'descripcion' => 'RPG de acción de mundo abierto con estética anime',
            'imagen_url' => 'assets/juegos/portada_genshin.png',
            'categoria' => 'RPG',
            'activo' => true,
        ]);

        Juego::create([
            'nombre' => 'Street Fighter 6',
            'slug' => 'street-fighter-6',
            'descripcion' => 'Legendario juego de lucha de Capcom',
            'imagen_url' => 'assets/juegos/portada_sf6.png',
            'categoria' => 'Lucha',
            'activo' => true,
        ]);

        Juego::create([
            'nombre' => 'Rainbow Six Siege',
            'slug' => 'rainbow-six-siege',
            'descripcion' => 'Shooter táctico centrado en la destrucción y el trabajo en equipo',
            'imagen_url' => 'assets/juegos/portada_r6s.png',
            'categoria' => 'FPS',
            'activo' => true,
        ]);

        Juego::create([
            'nombre' => 'Dead by Daylight',
            'slug' => 'dead-by-daylight',
            'descripcion' => 'Juego de terror asimétrico 4v1',
            'imagen_url' => 'assets/juegos/portada_dbd.png',
            'categoria' => 'Terror',
            'activo' => true,
        ]);

        Juego::create([
            'nombre' => 'Call of Duty: Warzone',
            'slug' => 'warzone',
            'descripcion' => 'Experiencia Battle Royale masiva gratuita de CoD',
            'imagen_url' => 'assets/juegos/portada_warzone.png',
            'categoria' => 'Battle Royale',
            'activo' => true,
        ]);

        Juego::create([
            'nombre' => 'Teamfight Tactics',
            'slug' => 'tft',
            'descripcion' => 'Auto-battler basado en el universo de LoL',
            'imagen_url' => 'assets/juegos/portada_tft.png',
            'categoria' => 'Estrategia',
            'activo' => true,
        ]);

        Juego::create([
            'nombre' => 'Roblox',
            'slug' => 'roblox',
            'descripcion' => 'Plataforma de creación de juegos y experiencias virtuales',
            'imagen_url' => 'assets/juegos/portada_roblox.png',
            'categoria' => 'Sandbox',
            'activo' => true,
        ]);
    }
}
