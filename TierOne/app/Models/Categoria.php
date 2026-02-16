<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Modelo Categoria 
 * 
 * Representa una categoría de productos(puede tener subcategorías)
 * 
 * @property int $id
 * @property int|null $id_parent
 * @property string $nombre
 * @property string $slug
 * @property string|null $descripcion
 * @property bool $activa
 */
class Categoria extends Model
{
    /**
     * Nombre de la tabla asociada
     */

    protected $table = 'categorias';

    /**
     * Campos asignables masivamente 
     */

    protected $fillable = [
        'id_parent',
        'nombre',
        'slug',
        'descripcion',
        'activa',
    ];

    /**
     * Conversión automatica de tipos
     */
    protected $casts = [
        'activa' => 'boolean',
    ];

    /**
     * Deshabilitar timestamps automáticos
     */
    public $timestamps = false;

    /**
     * Relación: Una categoria puede tener muchas subcategorías
     * 
     * Ejemplo: "Ropa" tiene ["Camisetas", "Pantalones"]
     */
    public function subcategorias()
    {
        return $this->hasMany(Categoria::class, 'id_parent');
    }

    /**
     * Relación: Una categoría pertenece a una categoría padre
     * 
     * Ejemplo: "Camisetas" pertenece a "Ropa"
     */
    public function padre(){
        return $this->belongsTo(Categoria::class, 'id_parent');
    }
}
