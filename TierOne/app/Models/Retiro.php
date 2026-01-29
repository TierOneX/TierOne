<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Modelo Retiro
 * 
 * Representa una solicitud de retiro de fondos realizada por un usuario
 * 
 * @property int $id
 * @property int $id_usuario
 * @property int|null $id_procesado_por
 * @property float $monto
 * @property string $metodo
 * @property string $detalles_cuenta
 * @property string $estado
 * @property \Carbon\Carbon $fecha_solicitud
 * @property \Carbon\Carbon|null $fecha_procesado
 * @property string|null $notas_admin
 * 
 */
class Retiro extends Model
{
    use HasFactory;

    /**
     * Nombre de la tabla asociada
     */
    protected $table = 'retiros';

    /**
     * Campos asignables masivamente
     * 
     * Incluye información del usuario, monto, método de pago,
     * estado de la solicitud y datos de procesamiento
     */
    protected $fillable = [
        'id_usuario',
        'id_procesado_por',
        'monto',
        'metodo',
        'detalles_cuenta',
        'estado',
        'fecha_solicitud',
        'fecha_procesado',
        'notas_admin',
    ];

    /**
     * Conversión automática de tipos
     * 
     * Laravel convierte automáticamente:
     * - 'monto': a decimal con 2 decimales para precisión monetaria
     * - Fechas: string → objeto Carbon (para manipular fechas)
     */
    protected $casts = [
        'monto' => 'decimal:2',
        'fecha_solicitud' => 'datetime',
        'fecha_procesado' => 'datetime',
    ];

    /**
     * Timestamps automáticos de Laravel (created_at, updated_at)
     */

    /**
     * Relación: Usuario que solicitó el retiro
     * 
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function usuario()
    {
        return $this->belongsTo(User::class, 'id_usuario');
    }

    /**
     * Relación: Administrador que procesó el retiro
     * 
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function procesadoPor()
    {
        return $this->belongsTo(User::class, 'id_procesado_por');
    }
}
