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

        Categoria::create([
            'id_parent' => $componentes->id,
            'nombre' => 'Memoria RAM',
            'slug' => 'memoria-ram',
            'descripcion' => 'Módulos DDR4 y DDR5 para gaming',
            'activa' => true,
        ]);

        Categoria::create([
            'id_parent' => $componentes->id,
            'nombre' => 'Almacenamiento SSD',
            'slug' => 'almacenamiento-ssd',
            'descripcion' => 'Discos NVMe de alta velocidad',
            'activa' => true,
        ]);

        // Nueva Categoría Principal: Consolas
        $consolas = Categoria::create([
            'id_parent' => null,
            'nombre' => 'Consolas',
            'slug' => 'consolas',
            'descripcion' => 'PlayStation, Xbox y Nintendo Switch',
            'activa' => true,
        ]);

        Categoria::create([
            'id_parent' => $consolas->id,
            'nombre' => 'Accesorios Consolas',
            'slug' => 'accesorios-consolas',
            'descripcion' => 'Mandos y cables para tu consola',
            'activa' => true,
        ]);

        // Nueva Categoría Principal: Mobiliario Gaming
        $mobiliario = Categoria::create([
            'id_parent' => null,
            'nombre' => 'Mobiliario Gaming',
            'slug' => 'mobiliario-gaming',
            'descripcion' => 'Sillas, escritorios y organización',
            'activa' => true,
        ]);

        Categoria::create([
            'id_parent' => $mobiliario->id,
            'nombre' => 'Sillas Gaming',
            'slug' => 'sillas-gaming',
            'descripcion' => 'Sillas ergonómicas para largas sesiones',
            'activa' => true,
        ]);

        // Subcategorías de Merchandising
        Categoria::create([
            'id_parent' => $merchandising->id,
            'nombre' => 'Camisetas',
            'slug' => 'camisetas-gaming',
            'descripcion' => 'Ropa oficial de equipos eSports',
            'activa' => true,
        ]);

        Categoria::create([
            'id_parent' => $merchandising->id,
            'nombre' => 'Figuras',
            'slug' => 'figuras-coleccionables',
            'descripcion' => 'Funkos y estatuas de personajes',
            'activa' => true,
        ]);

        // Nueva Categoría Principal: Audio y Streaming
        $audio = Categoria::create([
            'id_parent' => null,
            'nombre' => 'Audio y Streaming',
            'slug' => 'audio-streaming',
            'descripcion' => 'Micrófonos, cámaras y equipos de audio',
            'activa' => true,
        ]);

        Categoria::create([
            'id_parent' => $audio->id,
            'nombre' => 'Micrófonos',
            'slug' => 'microfonos',
            'descripcion' => 'Micrófonos USB y XLR para streaming',
            'activa' => true,
        ]);

        Categoria::create([
            'id_parent' => $audio->id,
            'nombre' => 'Cámaras Web',
            'slug' => 'webcams',
            'descripcion' => 'Cámaras Full HD y 4K para directos',
            'activa' => true,
        ]);
    }
}
