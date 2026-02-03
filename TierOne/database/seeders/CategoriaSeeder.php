<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Categoria;

class CategoriaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Categorías principales (sin padre)
        $perifericos = Categoria::create([
            'id_parent' => null,
            'nombre' => 'Periféricos Gaming',
            'slug' => 'perifericos-gaming',
            'descripcion' => 'Teclados, ratones, auriculares y más',
            'activa' => true,
        ]);

        $componentes = Categoria::create([
            'id_parent' => null,
            'nombre' => 'Componentes PC',
            'slug' => 'componentes-pc',
            'descripcion' => 'Hardware para PC gaming',
            'activa' => true,
        ]);

        $merchandising = Categoria::create([
            'id_parent' => null,
            'nombre' => 'Merchandising',
            'slug' => 'merchandising',
            'descripcion' => 'Productos oficiales de juegos y equipos',
            'activa' => true,
        ]);

        // Subcategorías de Periféricos
        Categoria::create([
            'id_parent' => $perifericos->id,
            'nombre' => 'Teclados',
            'slug' => 'teclados',
            'descripcion' => 'Teclados mecánicos y gaming',
            'activa' => true,
        ]);

        Categoria::create([
            'id_parent' => $perifericos->id,
            'nombre' => 'Ratones',
            'slug' => 'ratones',
            'descripcion' => 'Ratones gaming de alta precisión',
            'activa' => true,
        ]);

        Categoria::create([
            'id_parent' => $perifericos->id,
            'nombre' => 'Auriculares',
            'slug' => 'auriculares',
            'descripcion' => 'Auriculares gaming con sonido envolvente',
            'activa' => true,
        ]);

        // Subcategorías de Componentes
        Categoria::create([
            'id_parent' => $componentes->id,
            'nombre' => 'Tarjetas Gráficas',
            'slug' => 'tarjetas-graficas',
            'descripcion' => 'GPUs de última generación',
            'activa' => true,
        ]);

        Categoria::create([
            'id_parent' => $componentes->id,
            'nombre' => 'Procesadores',
            'slug' => 'procesadores',
            'descripcion' => 'CPUs para gaming de alto rendimiento',
            'activa' => true,
        ]);
    }
}
