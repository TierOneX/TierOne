<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Modelo ParticipantePartida
 * 
 * Representa a un usuario participando en una partida específica
 * 
 * @property int $id
 * @property int $id_partida
 * @property int $id_usuario
 * @property int|null $id_equipo
 * @property string|null $equipo_asignado
 * @property float $pago_entrada
 * @property bool $confirmado
 * @property \Carbon\Carbon|null $fecha_union
 * @property string|null $jugador_api_id
 */
class ParticipantePartida extends Model
{
    use HasFactory;

    /**
     * Nombre de la tabla asociada
     */
    protected $table = 'participantes_partida';

    /**
     * Campos asignables masivamente
     */
    protected $fillable = [
        'id_partida',
        'id_usuario',
        'id_equipo',
        'equipo_asignado',
        'pago_entrada',
        'confirmado',
        'fecha_union',
        'jugador_api_id',
    ];

    /**
     * Conversión automática de tipos
     */
    protected $casts = [
        'pago_entrada' => 'decimal:2',
        'confirmado' => 'boolean',
        'fecha_union' => 'datetime',
    ];

    /**
     * Relación: Partida a la que pertenece el participante
     * 
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function partida()
    {
        return $this->belongsTo(Partida::class, 'id_partida');
    }

    /**
     * Relación: Usuario que participa
     * 
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function usuario()
    {
        return $this->belongsTo(User::class, 'id_usuario');
    }
}
