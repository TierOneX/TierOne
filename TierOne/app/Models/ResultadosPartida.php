<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Modelo ResultadosPartida
 * 
 * Representa el resultado final de una partida, ya sea verificado automática o manualmente.
 * 
 * @property int $id
 * @property int $id_partida
 * @property int|null $id_verificado_por
 * @property string $ganador
 * @property array $detalles_json
 * @property \Carbon\Carbon|null $fecha_sincronizacion_api
 * @property bool $verificado_automaticamente
 * @property \Carbon\Carbon $fecha_registro
 * @property bool $disputado
 */
class ResultadosPartida extends Model
{
    use HasFactory;

    /**
     * Nombre de la tabla asociada
     */
    protected $table = 'resultados_partida';

    public $timestamps = false;

    /**
     * Campos asignables masivamente
     */
    protected $fillable = [
        'id_partida',
        'id_verificado_por',
        'ganador',
        'detalles_json',
        'fecha_sincronizacion_api',
        'verificado_automaticamente',
        'fecha_registro',
        'disputado',
    ];

    /**
     * Conversión automática de tipos
     */
    protected $casts = [
        'detalles_json' => 'array',
        'fecha_sincronizacion_api' => 'datetime',
        'verificado_automaticamente' => 'boolean',
        'fecha_registro' => 'datetime',
        'disputado' => 'boolean',
    ];

    /**
     * Relación: Partida a la que pertenece el resultado
     * 
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function partida()
    {
        return $this->belongsTo(Partida::class, 'id_partida');
    }

    /**
     * Relación: Usuario que verificó el resultado (si fue manual)
     * 
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function verificadoPor()
    {
        return $this->belongsTo(User::class, 'id_verificado_por');
    }
}
