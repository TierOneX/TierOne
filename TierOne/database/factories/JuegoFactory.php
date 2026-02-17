<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Juego>
 */
class JuegoFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {

        $nombre = $this->faker->randomElement([
            'League of Legends',
            'Counter-Strike 2',
            'Valorant',
            'Dota 2',
            'Fortnite',
        ]);
        return [
            'nombre' => ucwords($nombre),
            'slug' => Str::slug($nombre) . '-' . uniqid(), // Agraga ID unico
            'descripcion' => $this->faker->sentence(10), // Frase de 10 palabras
            'imagen_url' => $this->faker->imageUrl(640, 480, 'games'),
            'categoria' => $this->faker->randomElement(['MOBA', 'FPS', 'Battle Royale']),
            'activo' => $this->faker->boolean(80), // 80% de probabilidad de true
        ];
    }
}
