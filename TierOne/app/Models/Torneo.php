<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Modelo Torneo
 * 
 * Representa un torneo de videojuegos organizado en la plataforma
 * 
 * @property int $id
 * @property int $id_juego
 * @property int $id_organizador
 * @property string $nombre
 * @property string|null $descripcion
 * @property string|null $imagen_banner
 * @property string $formato
 * @property int $max_participantes
 * @property float $cuota_inscripcion
 * @property float $premio_total
 * @property float $comision_plataforma_porcentaje
 * @property bool $es_gratuito
 * @property \Carbon\Carbon $fecha_inicio
 * @property \Carbon\Carbon $fecha_fin
 * @property \Carbon\Carbon $cierre_inscripciones
 * @property string $estado
 * @property string|null $reglas_url
 * @property string|null $stream_url
 * @property bool $verificado
 * 
 */
class Torneo extends Model
{
    use HasFactory;

    /**
     * Nombre de la tabla asociada
     */
    protected $table = 'torneos';

    /**
     * Campos asignables masivamente
     * 
     * Incluye información del torneo: juego, organizador, detalles,
     * configuración de participantes, premios, fechas y estado
     */
    protected $fillable = [
        'id_juego',
        'id_organizador',
        'nombre',
        'descripcion',
        'imagen_banner',
        'formato',
        'max_participantes',
        'cuota_inscripcion',
        'premio_total',
        'comision_plataforma_porcentaje',
        'es_gratuito',
        'fecha_inicio',
        'fecha_fin',
        'cierre_inscripciones',
        'estado',
        'reglas_url',
        'stream_url',
        'verificado',
    ];

    /**
     * Conversión automática de tipos
     * 
     * Laravel convierte automáticamente:
     * - 'es_gratuito', 'verificado': 0/1 → false/true
     * - Fechas: string → objeto Carbon (para manipular fechas)
     * - Montos y porcentajes: a decimal con 2 decimales
     */
    protected $casts = [
        'es_gratuito' => 'boolean',
        'verificado' => 'boolean',
        'fecha_inicio' => 'datetime',
        'fecha_fin' => 'datetime',
        'cierre_inscripciones' => 'datetime',
        'cuota_inscripcion' => 'decimal:2',
        'premio_total' => 'decimal:2',
        'comision_plataforma_porcentaje' => 'decimal:2',
    ];

    /**
     * Timestamps automáticos de Laravel (created_at, updated_at)
     */

    /**
     * Relación: Juego del torneo
     * 
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function juego()
    {
        return $this->belongsTo(Juego::class, 'id_juego');
    }

    /**
     * Relación: Usuario organizador del torneo
     * 
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function organizador()
    {
        return $this->belongsTo(User::class, 'id_organizador');
    }

    /**
     * Relación: Transacciones asociadas al torneo
     * 
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function transacciones()
    {
        return $this->hasMany(Transaccion::class, 'id_torneo');
    }
}
