<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Orden extends Model
{
    use HasFactory;

    protected $table = 'ordenes';

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

    public function usuario()
    {
        return $this->belongsTo(User::class, 'id_usuario');
    }

    public function canceladoPor()
    {
        return $this->belongsTo(User::class, 'id_cancelado_por');
    }

    public function transacciones()
    {
        return $this->hasMany(Transaccion::class, 'id_orden');
    }
}
