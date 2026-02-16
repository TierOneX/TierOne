<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Review;
use App\Models\Producto;
use App\Models\User;

class ReviewSeeder extends Seeder
{
    private const TOTAL_RECORDS = 20;

    public function run(): void
    {
        $productos = Producto::all();
        $usuarios = User::where('rol', 'player')->get();

        if ($productos->isEmpty() || $usuarios->isEmpty()) {
            return;
        }

        $comentarios = [
            '¡Excelente producto, muy recomendado!',
            'Calidad-precio inmejorable.',
            'El envío fue rápido y el producto llegó perfecto.',
            'Cumple con lo que promete, muy contento.',
            'Un poco caro, pero vale la pena por la calidad.',
            'Diseño increíble y muy funcional.',
            'Lo uso a diario y no he tenido problemas.',
            'La mejor compra que he hecho este año.',
            'Superó mis expectativas.',
            'Muy ergonómico y cómodo.',
            'La iluminación RGB se ve espectacular.',
            'Silencioso y preciso, justo lo que buscaba.',
            'Materiales de muy buena calidad.',
            'Instalación sencilla y rápida.',
            'El soporte técnico fue muy atento.',
        ];

        for ($i = 0; $i < self::TOTAL_RECORDS; $i++) {
            Review::create([
                'id_producto' => $productos->random()->id,
                'id_usuario' => $usuarios->random()->id,
                'calificacion' => rand(3, 5),
                'comentario' => $comentarios[array_rand($comentarios)],
                'verificado_compra' => (bool)rand(0, 1),
            ]);
        }
    }
}
