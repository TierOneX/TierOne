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
        $perifericos = Categoria::firstOrCreate(
            ['slug' => 'perifericos-gaming'],
            [
                'id_parent' => null,
                'nombre' => 'Periféricos Gaming',
                'descripcion' => 'Teclados, ratones, auriculares y más',
                'activa' => true,
            ]
        );

        $componentes = Categoria::firstOrCreate(
            ['slug' => 'componentes-pc'],
            [
                'id_parent' => null,
                'nombre' => 'Componentes PC',
                'descripcion' => 'Hardware para PC gaming',
                'activa' => true,
            ]
        );

        $merchandising = Categoria::firstOrCreate(
            ['slug' => 'merchandising'],
            [
                'id_parent' => null,
                'nombre' => 'Merchandising',
                'descripcion' => 'Productos oficiales de juegos y equipos',
                'activa' => true,
            ]
        );

        // Subcategorías de Periféricos
        Categoria::firstOrCreate(
            ['slug' => 'teclados'],
            [
                'id_parent' => $perifericos->id,
                'nombre' => 'Teclados',
                'descripcion' => 'Teclados mecánicos y gaming',
                'activa' => true,
            ]
        );

        Categoria::firstOrCreate(
            ['slug' => 'ratones'],
            [
                'id_parent' => $perifericos->id,
                'nombre' => 'Ratones',
                'descripcion' => 'Ratones gaming de alta precisión',
                'activa' => true,
            ]
        );

        Categoria::firstOrCreate(
            ['slug' => 'auriculares'],
            [
                'id_parent' => $perifericos->id,
                'nombre' => 'Auriculares',
                'descripcion' => 'Auriculares gaming con sonido envolvente',
                'activa' => true,
            ]
        );

        // Subcategorías de Componentes
        Categoria::firstOrCreate(
            ['slug' => 'tarjetas-graficas'],
            [
                'id_parent' => $componentes->id,
                'nombre' => 'Tarjetas Gráficas',
                'descripcion' => 'GPUs de última generación',
                'activa' => true,
            ]
        );

        Categoria::firstOrCreate(
            ['slug' => 'procesadores'],
            [
                'id_parent' => $componentes->id,
                'nombre' => 'Procesadores',
                'descripcion' => 'CPUs para gaming de alto rendimiento',
                'activa' => true,
            ]
        );

        Categoria::firstOrCreate(
            ['slug' => 'memoria-ram'],
            [
                'id_parent' => $componentes->id,
                'nombre' => 'Memoria RAM',
                'descripcion' => 'Módulos DDR4 y DDR5 para gaming',
                'activa' => true,
            ]
        );

        Categoria::firstOrCreate(
            ['slug' => 'almacenamiento-ssd'],
            [
                'id_parent' => $componentes->id,
                'nombre' => 'Almacenamiento SSD',
                'descripcion' => 'Discos NVMe de alta velocidad',
                'activa' => true,
            ]
        );

        // Nueva Categoría Principal: Consolas
        $consolas = Categoria::firstOrCreate(
            ['slug' => 'consolas'],
            [
                'id_parent' => null,
                'nombre' => 'Consolas',
                'descripcion' => 'PlayStation, Xbox y Nintendo Switch',
                'activa' => true,
            ]
        );

        Categoria::firstOrCreate(
            ['slug' => 'accesorios-consolas'],
            [
                'id_parent' => $consolas->id,
                'nombre' => 'Accesorios Consolas',
                'descripcion' => 'Mandos y cables para tu consola',
                'activa' => true,
            ]
        );

        // Nueva Categoría Principal: Mobiliario Gaming
        $mobiliario = Categoria::firstOrCreate(
            ['slug' => 'mobiliario-gaming'],
            [
                'id_parent' => null,
                'nombre' => 'Mobiliario Gaming',
                'descripcion' => 'Sillas, escritorios y organización',
                'activa' => true,
            ]
        );

        Categoria::firstOrCreate(
            ['slug' => 'sillas-gaming'],
            [
                'id_parent' => $mobiliario->id,
                'nombre' => 'Sillas Gaming',
                'descripcion' => 'Sillas ergonómicas para largas sesiones',
                'activa' => true,
            ]
        );

        // Subcategorías de Merchandising
        Categoria::firstOrCreate(
            ['slug' => 'camisetas-gaming'],
            [
                'id_parent' => $merchandising->id,
                'nombre' => 'Camisetas',
                'descripcion' => 'Ropa oficial de equipos eSports',
                'activa' => true,
            ]
        );

        Categoria::firstOrCreate(
            ['slug' => 'figuras-coleccionables'],
            [
                'id_parent' => $merchandising->id,
                'nombre' => 'Figuras',
                'descripcion' => 'Funkos y estatuas de personajes',
                'activa' => true,
            ]
        );

        // Nueva Categoría Principal: Audio y Streaming
        $audio = Categoria::firstOrCreate(
            ['slug' => 'audio-streaming'],
            [
                'id_parent' => null,
                'nombre' => 'Audio y Streaming',
                'descripcion' => 'Micrófonos, cámaras y equipos de audio',
                'activa' => true,
            ]
        );

        Categoria::firstOrCreate(
            ['slug' => 'microfonos'],
            [
                'id_parent' => $audio->id,
                'nombre' => 'Micrófonos',
                'descripcion' => 'Micrófonos USB y XLR para streaming',
                'activa' => true,
            ]
        );

        Categoria::firstOrCreate(
            ['slug' => 'webcams'],
            [
                'id_parent' => $audio->id,
                'nombre' => 'Cámaras Web',
                'descripcion' => 'Cámaras Full HD y 4K para directos',
                'activa' => true,
            ]
        );
    }
}
