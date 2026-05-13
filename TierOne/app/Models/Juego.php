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
        'igdb_id',
        'twitch_game_id',
        'nombre',
        'slug',
        'descripcion',
        'summary',
        'storyline',
        'imagen_url',
        'cover_image_id',
        'screenshot_ids',
        'artwork_ids',
        'video_ids',
        'categoria',
        'genres',
        'themes',
        'game_modes',
        'platforms',
        'developer',
        'publisher',
        'critic_rating',
        'critic_rating_count',
        'community_rating',
        'community_rating_count',
        'fecha_lanzamiento',
        'similar_game_ids',
        'websites',
        'igdb_synced_at',
        'activo',
    ];

    /**
     * Conversión automática de tipos
     */
    protected $casts = [
        'screenshot_ids' => 'json',
        'artwork_ids' => 'json',
        'video_ids' => 'json',
        'genres' => 'json',
        'themes' => 'json',
        'game_modes' => 'json',
        'platforms' => 'json',
        'similar_game_ids' => 'json',
        'websites' => 'json',
        'critic_rating' => 'float',
        'community_rating' => 'float',
        'fecha_lanzamiento' => 'date',
        'igdb_synced_at' => 'datetime',
        'activo' => 'boolean',
        'fecha_agregado' => 'datetime',
    ];

    /**
     * Datos en vivo (Twitch)
     */
    public function liveData()
    {
        return $this->hasOne(JuegoCacheLive::class, 'id_juego');
    }

    /**
     * Relación con los torneos del juego
     */
    public function torneos()
    {
        return $this->hasMany(Torneo::class, 'id_juego');
    }

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
}
