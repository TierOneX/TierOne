<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ItemOrden extends Model
{
    use HasFactory;

    protected $table = 'items_orden';

    protected $fillable = [
        'id_orden',
        'id_producto',
        'id_variante',
        'id_proveedor',
        'cantidad',
        'precio_unitario',
        'subtotal',
        'personalizacion_data',
        'personalizacion_imagen',
    ];

    protected $casts = [
        'cantidad' => 'integer',
        'precio_unitario' => 'decimal:2',
        'subtotal' => 'decimal:2',
        'personalizacion_data' => 'array',
    ];

    public function orden()
    {
        return $this->belongsTo(Orden::class, 'id_orden');
    }

    public function producto()
    {
        return $this->belongsTo(Producto::class, 'id_producto');
    }

    public function variante()
    {
        return $this->belongsTo(VarianteProducto::class, 'id_variante');
    }

    public function proveedor()
    {
        return $this->belongsTo(Proveedor::class, 'id_proveedor');
    }
}
