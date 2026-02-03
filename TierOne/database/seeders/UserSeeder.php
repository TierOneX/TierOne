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
    }
}
