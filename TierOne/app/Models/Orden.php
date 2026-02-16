<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Modelo Orden
 * 
 * Representa una orden de compra realizada por un usuario en la plataforma
 * 
 * @property int $id
 * @property int $id_usuario
 * @property int|null $id_direccion_envio
 * @property string $numero_orden
 * @property float $subtotal
 * @property float $impuestos
 * @property float $costo_envio
 * @property float $descuento
 * @property float $total
 * @property string $estado
 * @property \Carbon\Carbon $fecha_orden
 * @property \Carbon\Carbon|null $fecha_enviada_proveedor
 * @property \Carbon\Carbon|null $fecha_actualizacion
 * @property string|null $tracking_number
 * @property string|null $transportista
 * @property int|null $id_cancelado_por
 * @property \Carbon\Carbon|null $fecha_cancelacion
 * @property string|null $razon_cancelacion
 * 
 */
class Orden extends Model
{
    use HasFactory;

    /**
     * Nombre de la tabla asociada
     */
    protected $table = 'ordenes';

    /**
     * Campos asignables masivamente
     * 
     * Incluye todos los datos de la orden: usuario, dirección, montos,
     * estado, fechas, información de envío y cancelación
     */
    protected $fillable = [
        'id_usuario',
        'id_direccion_envio',
        'numero_orden',
        'subtotal',
        'impuestos',
        'costo_envio',
        'descuento',
        'total',
        'estado',
        'fecha_orden',
        'fecha_enviada_proveedor',
        'fecha_actualizacion',
        'tracking_number',
        'transportista',
        'id_cancelado_por',
        'fecha_cancelacion',
        'razon_cancelacion',
    ];

    /**
     * Conversión automática de tipos
     * 
     * Laravel convierte automáticamente:
     * - Montos: a decimal con 2 decimales para precisión monetaria
     * - Fechas: string → objeto Carbon (para manipular fechas)
     */
    protected $casts = [
        'subtotal' => 'decimal:2',
        'impuestos' => 'decimal:2',
        'costo_envio' => 'decimal:2',
        'descuento' => 'decimal:2',
        'total' => 'decimal:2',
        'fecha_orden' => 'datetime',
        'fecha_enviada_proveedor' => 'datetime',
        'fecha_actualizacion' => 'datetime',
        'fecha_cancelacion' => 'datetime',
    ];

    /**
     * Timestamps automáticos de Laravel (created_at, updated_at)
     */

    /**
     * Relación: Usuario que realizó la orden
     * 
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function usuario()
    {
        return $this->belongsTo(User::class, 'id_usuario');
    }

    /**
     * Relación: Usuario que canceló la orden (si aplica)
     * 
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function canceladoPor()
    {
        return $this->belongsTo(User::class, 'id_cancelado_por');
    }

    /**
     * Relación: Transacciones asociadas a esta orden
     * 
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function transacciones()
    {
        return $this->hasMany(Transaccion::class, 'id_orden');
    }
}
