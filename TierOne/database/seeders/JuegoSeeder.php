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
<<<<<<< HEAD
            'imagen_url' => 'https://example.com/lol.jpg',
=======
            'imagen_url' => 'images/juegos/portada_lol.png',
>>>>>>> origin/dev
            'categoria' => 'MOBA',
            'activo' => true,
        ]);

        Juego::create([
            'nombre' => 'Counter-Strike 2',
            'slug' => 'counter-strike-2',
            'descripcion' => 'FPS táctico competitivo desarrollado por Valve',
<<<<<<< HEAD
            'imagen_url' => 'https://example.com/cs2.jpg',
=======
            'imagen_url' => 'images/juegos/portada_cs2.png',
>>>>>>> origin/dev
            'categoria' => 'FPS',
            'activo' => true,
        ]);

        Juego::create([
            'nombre' => 'Valorant',
            'slug' => 'valorant',
            'descripcion' => 'FPS táctico con habilidades desarrollado por Riot Games',
<<<<<<< HEAD
            'imagen_url' => 'https://example.com/valorant.jpg',
=======
            'imagen_url' => 'images/juegos/portada_valorant.png',
>>>>>>> origin/dev
            'categoria' => 'FPS',
            'activo' => true,
        ]);

        Juego::create([
            'nombre' => 'Dota 2',
            'slug' => 'dota-2',
            'descripcion' => 'MOBA competitivo desarrollado por Valve',
<<<<<<< HEAD
            'imagen_url' => 'https://example.com/dota2.jpg',
=======
            'imagen_url' => 'assets/juegos/portada_dota2.png',
>>>>>>> origin/dev
            'categoria' => 'MOBA',
            'activo' => true,
        ]);

        Juego::create([
            'nombre' => 'Fortnite',
            'slug' => 'fortnite',
            'descripcion' => 'Battle Royale desarrollado por Epic Games',
<<<<<<< HEAD
            'imagen_url' => 'https://example.com/fortnite.jpg',
=======
            'imagen_url' => 'images/juegos/portada_fortnite.png',
>>>>>>> origin/dev
            'categoria' => 'Battle Royale',
            'activo' => true,
        ]);

        Juego::create([
            'nombre' => 'Rocket League',
            'slug' => 'rocket-league',
            'descripcion' => 'Fútbol con coches propulsados por cohetes',
<<<<<<< HEAD
            'imagen_url' => 'https://example.com/rocket-league.jpg',
=======
            'imagen_url' => 'images/juegos/portada_rocket_league.png',
>>>>>>> origin/dev
            'categoria' => 'Deportes',
            'activo' => true,
        ]);

        Juego::create([
            'nombre' => 'Apex Legends',
            'slug' => 'apex-legends',
            'descripcion' => 'Battle Royale de héroes ambientado en el universo de Titanfall',
<<<<<<< HEAD
            'imagen_url' => 'https://example.com/apex.jpg',
=======
            'imagen_url' => 'images/juegos/portada_apex.png',
>>>>>>> origin/dev
            'categoria' => 'Battle Royale',
            'activo' => true,
        ]);

        Juego::create([
            'nombre' => 'Minecraft',
            'slug' => 'minecraft',
            'descripcion' => 'Juego de construcción y aventuras de mundo abierto',
<<<<<<< HEAD
            'imagen_url' => 'https://example.com/minecraft.jpg',
=======
            'imagen_url' => 'images/juegos/portada_minecraft.png',
>>>>>>> origin/dev
            'categoria' => 'Sandbox',
            'activo' => true,
        ]);

        Juego::create([
            'nombre' => 'World of Warcraft',
            'slug' => 'world-of-warcraft',
            'descripcion' => 'Mítico MMORPG ambientado en el mundo de Azeroth',
<<<<<<< HEAD
            'imagen_url' => 'https://example.com/wow.jpg',
=======
            'imagen_url' => 'images/juegos/portada_wow.png',
>>>>>>> origin/dev
            'categoria' => 'MMORPG',
            'activo' => true,
        ]);

        Juego::create([
            'nombre' => 'Overwatch 2',
            'slug' => 'overwatch-2',
            'descripcion' => 'Shooter de héroes competitivo por equipos',
<<<<<<< HEAD
            'imagen_url' => 'https://example.com/overwatch2.jpg',
=======
            'imagen_url' => 'images/juegos/portada_overwatch2.png',
>>>>>>> origin/dev
            'categoria' => 'FPS',
            'activo' => true,
        ]);

        Juego::create([
            'nombre' => 'Hearthstone',
            'slug' => 'hearthstone',
            'descripcion' => 'Juego de cartas coleccionables basado en Warcraft',
<<<<<<< HEAD
            'imagen_url' => 'https://example.com/hearthstone.jpg',
=======
            'imagen_url' => 'images/juegos/portada_hearthstone.png',
>>>>>>> origin/dev
            'categoria' => 'Cartas',
            'activo' => true,
        ]);

        Juego::create([
            'nombre' => 'Elden Ring',
            'slug' => 'elden-ring',
            'descripcion' => 'RPG de acción épico desarrollado por FromSoftware',
<<<<<<< HEAD
            'imagen_url' => 'https://example.com/elden-ring.jpg',
=======
            'imagen_url' => 'images/juegos/portada_elden_ring.png',
>>>>>>> origin/dev
            'categoria' => 'RPG',
            'activo' => true,
        ]);

        Juego::create([
            'nombre' => 'Genshin Impact',
            'slug' => 'genshin-impact',
            'descripcion' => 'RPG de acción de mundo abierto con estética anime',
<<<<<<< HEAD
            'imagen_url' => 'https://example.com/genshin.jpg',
=======
            'imagen_url' => 'images/juegos/portada_genshin.png',
>>>>>>> origin/dev
            'categoria' => 'RPG',
            'activo' => true,
        ]);

        Juego::create([
            'nombre' => 'Street Fighter 6',
            'slug' => 'street-fighter-6',
            'descripcion' => 'Legendario juego de lucha de Capcom',
<<<<<<< HEAD
            'imagen_url' => 'https://example.com/sf6.jpg',
=======
            'imagen_url' => 'images/juegos/portada_sf6.png',
>>>>>>> origin/dev
            'categoria' => 'Lucha',
            'activo' => true,
        ]);

        Juego::create([
<<<<<<< HEAD
            'nombre' => 'FC 24',
            'slug' => 'fc-24',
            'descripcion' => 'Simulador de fútbol profesional de EA Sports',
            'imagen_url' => 'https://example.com/fc24.jpg',
            'categoria' => 'Deportes',
            'activo' => true,
        ]);

        Juego::create([
            'nombre' => 'Rainbow Six Siege',
            'slug' => 'rainbow-six-siege',
            'descripcion' => 'Shooter táctico centrado en la destrucción y el trabajo en equipo',
            'imagen_url' => 'https://example.com/r6s.jpg',
=======
            'nombre' => 'Rainbow Six Siege',
            'slug' => 'rainbow-six-siege',
            'descripcion' => 'Shooter táctico centrado en la destrucción y el trabajo en equipo',
            'imagen_url' => 'images/juegos/portada_r6s.png',
>>>>>>> origin/dev
            'categoria' => 'FPS',
            'activo' => true,
        ]);

        Juego::create([
<<<<<<< HEAD
            'nombre' => 'Dead by Daylight',
            'slug' => 'dead-by-daylight',
            'descripcion' => 'Juego de terror asimétrico 4v1',
            'imagen_url' => 'https://example.com/dbd.jpg',
            'categoria' => 'Terror',
            'activo' => true,
        ]);

        Juego::create([
            'nombre' => 'Call of Duty: Warzone',
            'slug' => 'warzone',
            'descripcion' => 'Experiencia Battle Royale masiva gratuita de CoD',
            'imagen_url' => 'https://example.com/warzone.jpg',
=======
            'nombre' => 'Call of Duty: Warzone',
            'slug' => 'warzone',
            'descripcion' => 'Experiencia Battle Royale masiva gratuita de CoD',
            'imagen_url' => 'images/juegos/portada_warzone.png',
>>>>>>> origin/dev
            'categoria' => 'Battle Royale',
            'activo' => true,
        ]);

        Juego::create([
            'nombre' => 'Teamfight Tactics',
            'slug' => 'tft',
            'descripcion' => 'Auto-battler basado en el universo de LoL',
<<<<<<< HEAD
            'imagen_url' => 'https://example.com/tft.jpg',
            'categoria' => 'Estrategia',
            'activo' => true,
        ]);

        Juego::create([
            'nombre' => 'Roblox',
            'slug' => 'roblox',
            'descripcion' => 'Plataforma de creación de juegos y experiencias virtuales',
            'imagen_url' => 'https://example.com/roblox.jpg',
            'categoria' => 'Sandbox',
            'activo' => true,
        ]);
=======
            'imagen_url' => 'images/juegos/portada_tft.png',
            'categoria' => 'Estrategia',
            'activo' => true,
        ]);
>>>>>>> origin/dev
    }
}
