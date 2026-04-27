<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ZonaPersonalizacion extends Model
{
    protected $table = 'zonas_personalizacion';

    protected $fillable = [
        'id_producto', 'nombre', 'slug', 'imagen_base',
        'area_x', 'area_y', 'area_width', 'area_height',
        'canvas_width', 'canvas_height', 'orden', 'activa',
    ];

    protected $casts = [
        'area_x'        => 'integer',
        'area_y'        => 'integer',
        'area_width'    => 'integer',
        'area_height'   => 'integer',
        'canvas_width'  => 'integer',
        'canvas_height' => 'integer',
        'orden'         => 'integer',
        'activa'        => 'boolean',
    ];

    public function producto()
    {
        return $this->belongsTo(Producto::class, 'id_producto');
    }
}
