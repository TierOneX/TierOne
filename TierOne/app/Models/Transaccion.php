<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Modelo Transaccion
 * 
 * Representa una transacción financiera en la plataforma (depósito, retiro, pago, etc.)
 * Mantiene un registro histórico de todos los movimientos de fondos
 * 
 * @property int $id
 * @property int $id_usuario
 * @property int|null $id_orden
 * @property int|null $id_partida
 * @property int|null $id_torneo
 * @property int|null $id_retiro
 * @property string $tipo
 * @property float $monto
 * @property float $balance_anterior
 * @property float $balance_nuevo
 * @property string|null $descripcion
 * @property \Carbon\Carbon $fecha_transaccion
 * 
 */
class Transaccion extends Model
{
    use HasFactory;

    /**
     * Nombre de la tabla asociada
     */
    protected $table = 'transacciones';

    /**
     * Campos asignables masivamente
     * 
     * Incluye usuario, referencias a entidades relacionadas (orden, partida, torneo, retiro),
     * tipo de transacción, montos y descripción
     */
    protected $fillable = [
        'id_usuario',
        'id_orden',
        'id_partida',
        'id_torneo',
        'id_retiro',
        'tipo',
        'monto',
        'balance_anterior',
        'balance_nuevo',
        'descripcion',
        'fecha_transaccion',
    ];

    /**
     * Conversión automática de tipos
     * 
     * Laravel convierte automáticamente:
     * - Montos y balances: a decimal con 2 decimales para precisión monetaria
     * - 'fecha_transaccion': string → objeto Carbon (para manipular fechas)
     */
    protected $casts = [
        'monto' => 'decimal:2',
        'balance_anterior' => 'decimal:2',
        'balance_nuevo' => 'decimal:2',
        'fecha_transaccion' => 'datetime',
    ];

    /**
     * Timestamps automáticos de Laravel (created_at, updated_at)
     */

    /**
     * Relación: Usuario que realizó la transacción
     * 
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function usuario()
    {
        return $this->belongsTo(User::class, 'id_usuario');
    }

    /**
     * Relación: Orden asociada (si aplica)
     * 
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function orden()
    {
        return $this->belongsTo(Orden::class, 'id_orden');
    }

    /**
     * Relación: Torneo asociado (si aplica)
     * 
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function torneo()
    {
        return $this->belongsTo(Torneo::class, 'id_torneo');
    }

    /**
     * Relación: Retiro asociado (si aplica)
     * 
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function retiro()
    {
        return $this->belongsTo(Retiro::class, 'id_retiro');
    }
}
