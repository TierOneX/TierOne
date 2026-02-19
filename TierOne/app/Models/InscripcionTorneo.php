<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Modelo InscripcionTorneo
 * 
 * Gestiona la inscripción de un usuario en un torneo específico.
 * 
 * @property int $id
 * @property int $id_torneo
 * @property int $id_usuario
 * @property int|null $id_equipo
 * @property float $pago_cuota
 * @property \Carbon\Carbon $fecha_inscripcion
 * @property string $estado
 */
class InscripcionTorneo extends Model
{
    use HasFactory;

    /**
     * Nombre de la tabla asociada
     */
    protected $table = 'inscripciones_torneo';

    public $timestamps = false;

    /**
     * Campos asignables masivamente
     */
    protected $fillable = [
        'id_torneo',
        'id_usuario',
        'id_equipo',
        'pago_cuota',
        'fecha_inscripcion',
        'estado',
    ];

    /**
     * Conversión automática de tipos
     */
    protected $casts = [
        'pago_cuota' => 'decimal:2',
        'fecha_inscripcion' => 'datetime',
    ];

    /**
     * Relación: Torneo al que pertenece la inscripción
     * 
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function torneo()
    {
        return $this->belongsTo(Torneo::class, 'id_torneo');
    }

    /**
     * Relación: Usuario inscrito
     * 
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function usuario()
    {
        return $this->belongsTo(User::class, 'id_usuario');
    }
}
