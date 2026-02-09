<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Modelo ItemCarrito
 * 
 * Representa un producto individual dentro de un carrito de compras
 * 
 * @property int $id
 * @property int $id_carrito
 * @property int $id_producto
 * @property int|null $id_variante
 * @property int $cantidad
 * @property float $precio_unitario
 * @property float $subtotal
 * @property \Carbon\Carbon|null $fecha_agregado
 */
class ItemCarrito extends Model
{
    use HasFactory;

    /**
     * Nombre de la tabla asociada
     */
    protected $table = 'items_carrito';

    /**
     * Campos asignables masivamente
     */
    protected $fillable = [
        'id_carrito',
        'id_producto',
        'id_variante',
        'cantidad',
        'precio_unitario',
        'subtotal',
        'fecha_agregado',
    ];

    /**
     * Conversión automática de tipos
     */
    protected $casts = [
        'precio_unitario' => 'decimal:2',
        'subtotal' => 'decimal:2',
        'fecha_agregado' => 'datetime',
    ];

    /**
     * Relación: Carrito al que pertenece el item
     * 
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function carrito()
    {
        return $this->belongsTo(Carrito::class, 'id_carrito');
    }

    /**
     * Nota: Las relaciones con Producto y Variante se podrán añadir 
     * una vez que esos modelos existan en el sistema.
     */
}
