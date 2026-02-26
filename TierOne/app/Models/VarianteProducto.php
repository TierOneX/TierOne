<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VarianteProducto extends Model
{
    use HasFactory;

    protected $table = 'variantes_productos';

    public $timestamps = false;

    protected $fillable = [
        'id_producto',
        'nombre',
        'sku',
        'precio',
        'disponible',
        'ultima_verificacion_stock',
    ];

    protected $casts = [
        'precio' => 'decimal:2',
        'disponible' => 'boolean',
        'ultima_verificacion_stock' => 'datetime',
    ];

    public function producto()
    {
        return $this->belongsTo(Producto::class, 'id_producto');
    }
}
