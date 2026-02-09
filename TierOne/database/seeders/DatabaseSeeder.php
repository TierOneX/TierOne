<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Ejecutar todos los seeders en orden
        $this->call([
            UserSeeder::class,
            ProveedorSeeder::class,
            JuegoSeeder::class,
            CategoriaSeeder::class,
        ]);
    }
}
