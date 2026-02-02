<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Modelo Producto
 * 
 * Representa un producto disponible en la plataforma, asociado a una categoría y un proveedor.
 * 
 * @property int $id
 * @property int $id_categoria
 * @property int $id_proveedor
 * @property string $nombre
 * @property string $slug
 * @property string|null $descripcion
 * @property float $precio_proveedor
 * @property float $precio_venta
 * @property string|null $imagen_principal
 * @property bool $destacado
 * @property bool $activo
 * @property \Carbon\Carbon $fecha_creacion
 * @property int $ventas_totales
 * @property float $rating_promedio
 */
class Producto extends Model
{
    use HasFactory;

    /**
     * Nombre de la tabla asociada
     */
    protected $table = 'productos';

    /**
     * Campos asignables masivamente
     */
    protected $fillable = [
        'id_categoria',
        'id_proveedor',
        'nombre',
        'slug',
        'descripcion',
        'precio_proveedor',
        'precio_venta',
        'imagen_principal',
        'destacado',
        'activo',
        'fecha_creacion',
        'ventas_totales',
        'rating_promedio',
    ];

    /**
     * Conversión automática de tipos
     */
    protected $casts = [
        'precio_proveedor' => 'decimal:2',
        'precio_venta' => 'decimal:2',
        'destacado' => 'boolean',
        'activo' => 'boolean',
        'fecha_creacion' => 'datetime',
        'ventas_totales' => 'integer',
        'rating_promedio' => 'decimal:2',
    ];

    /**
     * Relación: Categoría a la que pertenece el producto
     * 
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function categoria()
    {
        return $this->belongsTo(Categoria::class, 'id_categoria');
    }

    /**
     * Relación: Proveedor que suministra el producto
     * 
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function proveedor()
    {
        return $this->belongsTo(Proveedor::class, 'id_proveedor');
    }
}
