<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Modelo Carrito
 * 
 * Representa el carrito de compras de un usuario
 * 
 * @property int $id
 * @property int $id_usuario
 * @property float $subtotal
 * @property \Carbon\Carbon|null $fecha_creacion
 * @property \Carbon\Carbon|null $fecha_actualizacion
 */
class Carrito extends Model
{
    use HasFactory;

    /**
     * Nombre de la tabla asociada
     */
    protected $table = 'carritos';

    /**
     * Campos asignables masivamente
     */
    protected $fillable = [
        'id_usuario',
        'subtotal',
        'fecha_creacion',
        'fecha_actualizacion',
    ];

    /**
     * Conversión automática de tipos
     */
    protected $casts = [
        'subtotal' => 'decimal:2',
        'fecha_creacion' => 'datetime',
        'fecha_actualizacion' => 'datetime',
    ];

    /**
     * Relación: Usuario dueño del carrito
     * 
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function usuario()
    {
        return $this->belongsTo(User::class, 'id_usuario');
    }

    /**
     * Relación: Items contenidos en el carrito
     * 
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function items()
    {
        return $this->hasMany(ItemCarrito::class, 'id_carrito');
    }
}
