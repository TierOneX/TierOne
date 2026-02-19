<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Modelo PartidaTorneo
 * 
 * Gestiona la estructura de los encuentros dentro de un torneo (brackets).
 * 
 * @property int $id
 * @property int $id_torneo
 * @property int $id_partida
 * @property int|null $id_siguiente_partida
 * @property int $ronda
 * @property int $bracket_posicion
 * @property string $tipo_bracket
 */
class PartidaTorneo extends Model
{
    use HasFactory;

    /**
     * Nombre de la tabla asociada
     */
    protected $table = 'partidas_torneo';

    public $timestamps = false;

    /**
     * Campos asignables masivamente
     */
    protected $fillable = [
        'id_torneo',
        'id_partida',
        'id_siguiente_partida',
        'ronda',
        'bracket_posicion',
        'tipo_bracket',
    ];

    /**
     * Conversión automática de tipos
     */
    protected $casts = [
        'ronda' => 'integer',
        'bracket_posicion' => 'integer',
    ];

    /**
     * Relación: Torneo al que pertenece el encuentro
     * 
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function torneo()
    {
        return $this->belongsTo(Torneo::class, 'id_torneo');
    }

    /**
     * Relación: Partida (encuentro) vinculada
     * 
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function partida()
    {
        return $this->belongsTo(Partida::class, 'id_partida');
    }

    /**
     * Relación: Siguiente encuentro en el bracket
     * 
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function siguientePartida()
    {
        return $this->belongsTo(PartidaTorneo::class, 'id_siguiente_partida');
    }
}
