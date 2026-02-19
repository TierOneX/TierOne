<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Modelo PremioTorneo
 * 
 * Gestiona los premios asignados a los ganadores de un torneo.
 * 
 * @property int $id
 * @property int $id_torneo
 * @property int|null $id_ganador
 * @property int $posicion
 * @property float $monto
 * @property string $descripcion
 * @property bool $entregado
 * @property \Carbon\Carbon|null $fecha_entrega
 */
class PremioTorneo extends Model
{
    use HasFactory;

    /**
     * Nombre de la tabla asociada
     */
    protected $table = 'premios_torneo';

    public $timestamps = false;

    /**
     * Campos asignables masivamente
     */
    protected $fillable = [
        'id_torneo',
        'id_ganador',
        'posicion',
        'monto',
        'descripcion',
        'entregado',
        'fecha_entrega',
    ];

    /**
     * Conversión automática de tipos
     */
    protected $casts = [
        'monto' => 'decimal:2',
        'entregado' => 'boolean',
        'fecha_entrega' => 'datetime',
    ];

    /**
     * Relación: Torneo al que pertenece el premio
     * 
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function torneo()
    {
        return $this->belongsTo(Torneo::class, 'id_torneo');
    }

    /**
     * Relación: Usuario ganador del premio
     * 
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function ganador()
    {
        return $this->belongsTo(User::class, 'id_ganador');
    }
}
