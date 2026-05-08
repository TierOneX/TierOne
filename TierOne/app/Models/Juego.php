<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
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
    use HasFactory;
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
     * Deshabilitar timestamps automáticos
     */
    public $timestamps = false;

    /**
     * Relacion: partidas creadas para este juego.
     */
    public function partidas()
    {
        return $this->hasMany(Partida::class, 'id_juego');
    }

    /**
     * Relacion: torneos creados para este juego.
     */
    public function torneos()
    {
        return $this->hasMany(Torneo::class, 'id_juego');
    }
}
