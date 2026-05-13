<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PrecioPersonalizacion extends Model
{
    use HasFactory;
    protected $table = 'precios_personalizacion';

    protected $fillable = ['id_producto', 'tipo_elemento', 'precio'];

    protected $casts = [
        'precio' => 'decimal:2',
    ];

    public function producto()
    {
        return $this->belongsTo(Producto::class, 'id_producto');
    }

    /**
     * Obtiene el precio para un tipo de elemento y producto.
     * Si el producto tiene precio específico, lo usa. Si no, usa el global.
     */
    public static function getPrecio(string $tipoElemento, ?int $productoId = null): float
    {
        // Buscar precio específico del producto
        if ($productoId) {
            $especifico = self::where('id_producto', $productoId)
                ->where('tipo_elemento', $tipoElemento)
                ->first();
            if ($especifico) return (float) $especifico->precio;
        }

        // Fallback: precio global
        $global = self::whereNull('id_producto')
            ->where('tipo_elemento', $tipoElemento)
            ->first();

        return $global ? (float) $global->precio : 0.00;
    }
}
