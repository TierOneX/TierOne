<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Modelo Juego
 * 
 * Representa un videojuego en la plataforma (LoL, CS2, etc.)
 * 
 * @property int $id
 * @property string $nombre
 * @property string $slug
 * @property string|null $descripcion
 * @property string|null $imagen_url
 * @property string $categoria
 * @property bool $activo
 * @property \Carbon\Carbon $fecha_agregado
 * 
 */
class Juego extends Model
{
    /**
     * Nombre de la tabla asociada
     */
    protected $table = 'juegos';

    /**
     * Campos asignables masivamente
     * 
     * Nota: 'fecha_agregado' NO está aquí porque se establece automáticamente
     * con useCurrent() en la migración
     */
    protected $fillable = [
        'nombre',
        'slug',
        'descripcion',
        'imagen_url',
        'categoria',
        'activo',
    ];

    /**
     * Conversión automática de tipos
     * 
     * Laravel convierte automáticamente:
     * - 'activo': 0/1 → false/true
     * - 'fecha_agregado': string → objeto Carbon (para manipular fechas)
     */
    protected $casts = [
        'activo' => 'boolean',
        'fecha_agregado' => 'datetime',
    ];

    /**
     * Deshabilitar timestamps automáticos de Laravel
     * 
     * No usamos created_at/updated_at, solo 'fecha_agregado'
     */
    public $timestamps = false;
}
