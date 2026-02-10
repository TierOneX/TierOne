<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'username' => 'admin',
            'email' => 'admin@tierone.com',
            'password_hash' => bcrypt('password123'),
            'nombre' => 'Admin',
            'apellido' => 'TierOne',
            'pais' => 'España',
            'rol' => 'admin',
            'verificado' => true,
            'activo' => true,
        ]);
        User::create([
            'username' => 'player1',
            'email' => 'player1@tierone.com',
            'password_hash' => bcrypt('password123'),
            'nombre' => 'Juan',
            'apellido' => 'García',
            'pais' => 'México',
            'rol' => 'player',
            'verificado' => true,
            'activo' => true,
        ]);
        User::create([
            'username' => 'streamer1',
            'email' => 'streamer1@tierone.com',
            'password_hash' => bcrypt('password123'),
            'nombre' => 'María',
            'apellido' => 'López',
            'pais' => 'Argentina',
            'rol' => 'streamer',
            'verificado' => false,
            'activo' => true,
        ]);

        User::create([
            'username' => 'player2',
            'email' => 'player2@tierone.com',
            'password_hash' => bcrypt('password123'),
            'nombre' => 'Pedro',
            'apellido' => 'Ramírez',
            'pais' => 'Colombia',
            'rol' => 'player',
            'verificado' => true,
            'activo' => true,
        ]);

        User::create([
            'username' => 'player3',
            'email' => 'player3@tierone.com',
            'password_hash' => bcrypt('password123'),
            'nombre' => 'Lucía',
            'apellido' => 'Sánchez',
            'pais' => 'Chile',
            'rol' => 'player',
            'verificado' => true,
            'activo' => true,
        ]);

        User::create([
            'username' => 'admin2',
            'email' => 'admin2@tierone.com',
            'password_hash' => bcrypt('password123'),
            'nombre' => 'Roberto',
            'apellido' => 'Gómez',
            'pais' => 'España',
            'rol' => 'admin',
            'verificado' => true,
            'activo' => true,
        ]);

        User::create([
            'username' => 'streamer2',
            'email' => 'streamer2@tierone.com',
            'password_hash' => bcrypt('password123'),
            'nombre' => 'Elena',
            'apellido' => 'Vázquez',
            'pais' => 'España',
            'rol' => 'streamer',
            'verificado' => true,
            'activo' => true,
        ]);

        User::create([
            'username' => 'player4',
            'email' => 'player4@tierone.com',
            'password_hash' => bcrypt('password123'),
            'nombre' => 'Miguel',
            'apellido' => 'Torres',
            'pais' => 'Perú',
            'rol' => 'player',
            'verificado' => false,
            'activo' => true,
        ]);

        User::create([
            'username' => 'player5',
            'email' => 'player5@tierone.com',
            'password_hash' => bcrypt('password123'),
            'nombre' => 'Sofía',
            'apellido' => 'Herrera',
            'pais' => 'Uruguay',
            'rol' => 'player',
            'verificado' => true,
            'activo' => true,
        ]);

        User::create([
            'username' => 'player6',
            'email' => 'player6@tierone.com',
            'password_hash' => bcrypt('password123'),
            'nombre' => 'Andrés',
            'apellido' => 'Castro',
            'pais' => 'México',
            'rol' => 'player',
            'verificado' => true,
            'activo' => false,
        ]);

        User::create([
            'username' => 'player7',
            'email' => 'player7@tierone.com',
            'password_hash' => bcrypt('password123'),
            'nombre' => 'Valentina',
            'apellido' => 'Ríos',
            'pais' => 'Argentina',
            'rol' => 'player',
            'verificado' => true,
            'activo' => true,
        ]);

        User::create([
            'username' => 'streamer3',
            'email' => 'streamer3@tierone.com',
            'password_hash' => bcrypt('password123'),
            'nombre' => 'Javier',
            'apellido' => 'Méndez',
            'pais' => 'Paraguay',
            'rol' => 'streamer',
            'verificado' => true,
            'activo' => true,
        ]);

        User::create([
            'username' => 'player8',
            'email' => 'player8@tierone.com',
            'password_hash' => bcrypt('password123'),
            'nombre' => 'Isabela',
            'apellido' => 'Pérez',
            'pais' => 'Bolivia',
            'rol' => 'player',
            'verificado' => true,
            'activo' => true,
        ]);

        User::create([
            'username' => 'player9',
            'email' => 'player9@tierone.com',
            'password_hash' => bcrypt('password123'),
            'nombre' => 'Fernando',
            'apellido' => 'Morales',
            'pais' => 'Costa Rica',
            'rol' => 'player',
            'verificado' => false,
            'activo' => true,
        ]);

        User::create([
            'username' => 'player10',
            'email' => 'player10@tierone.com',
            'password_hash' => bcrypt('password123'),
            'nombre' => 'Camila',
            'apellido' => 'Ortiz',
            'pais' => 'Ecuador',
            'rol' => 'player',
            'verificado' => true,
            'activo' => true,
        ]);

        User::create([
            'username' => 'player11',
            'email' => 'player11@tierone.com',
            'password_hash' => bcrypt('password123'),
            'nombre' => 'Gabriel',
            'apellido' => 'Navarro',
            'pais' => 'México',
            'rol' => 'player',
            'verificado' => true,
            'activo' => true,
        ]);

        User::create([
            'username' => 'streamer4',
            'email' => 'streamer4@tierone.com',
            'password_hash' => bcrypt('password123'),
            'nombre' => 'Paula',
            'apellido' => 'Ruiz',
            'pais' => 'Chile',
            'rol' => 'streamer',
            'verificado' => true,
            'activo' => true,
        ]);

        User::create([
            'username' => 'player12',
            'email' => 'player12@tierone.com',
            'password_hash' => bcrypt('password123'),
            'nombre' => 'Jorge',
            'apellido' => 'Alonso',
            'pais' => 'España',
            'rol' => 'player',
            'verificado' => true,
            'activo' => true,
        ]);

        User::create([
            'username' => 'player13',
            'email' => 'player13@tierone.com',
            'password_hash' => bcrypt('password123'),
            'nombre' => 'Laura',
            'apellido' => 'Marín',
            'pais' => 'Colombia',
            'rol' => 'player',
            'verificado' => true,
            'activo' => true,
        ]);

        User::create([
            'username' => 'player14',
            'email' => 'player14@tierone.com',
            'password_hash' => bcrypt('password123'),
            'nombre' => 'David',
            'apellido' => 'Ramos',
            'pais' => 'Argentina',
            'rol' => 'player',
            'verificado' => false,
            'activo' => true,
        ]);
    }
}
