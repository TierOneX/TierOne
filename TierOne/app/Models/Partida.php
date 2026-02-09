<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Modelo Partida
 * 
 * Representa una partida o encuentro de un juego específico
 * 
 * @property int $id
 * @property int $id_juego
 * @property int $id_creador
 * @property string|null $partida_api_id
 * @property string $titulo
 * @property string $tipo
 * @property float $buy_in
 * @property float $premio_total
 * @property float $comision_plataforma
 * @property \Carbon\Carbon|null $fecha_inicio
 * @property \Carbon\Carbon|null $fecha_fin
 * @property string $estado
 * @property string $origen
 * @property array|null $datos_api_json
 */
class Partida extends Model
{
    use HasFactory;

    /**
     * Nombre de la tabla asociada
     */
    protected $table = 'partidas';

    /**
     * Campos asignables masivamente
     */
    protected $fillable = [
        'id_juego',
        'id_creador',
        'partida_api_id',
        'titulo',
        'tipo',
        'buy_in',
        'premio_total',
        'comision_plataforma',
        'fecha_inicio',
        'fecha_fin',
        'estado',
        'origen',
        'datos_api_json',
    ];

    /**
     * Conversión automática de tipos
     */
    protected $casts = [
        'buy_in' => 'decimal:2',
        'premio_total' => 'decimal:2',
        'comision_plataforma' => 'decimal:2',
        'fecha_inicio' => 'datetime',
        'fecha_fin' => 'datetime',
        'datos_api_json' => 'array',
    ];

    /**
     * Relación: Juego al que pertenece la partida
     * 
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function juego()
    {
        return $this->belongsTo(Juego::class, 'id_juego');
    }

    /**
     * Relación: Usuario que creó la partida
     * 
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function creador()
    {
        return $this->belongsTo(User::class, 'id_creador');
    }

    /**
     * Relación: Participantes en la partida
     */
    public function participantes()
    {
        return $this->hasMany(ParticipantePartida::class, 'id_partida');
    }
}
