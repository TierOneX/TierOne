<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ZonaPersonalizacion extends Model
{
    use HasFactory;
    protected $table = 'zonas_personalizacion';

    /**
     * Tipos de zona disponibles.
     * - impresion: el cliente puede personalizar esta zona
     * - bloqueada: zona con elemento fijo, excluida del editor del cliente
     * - baja_visibilidad: se puede personalizar pero se muestra un aviso
     */
    const TIPOS = ['impresion', 'bloqueada', 'baja_visibilidad'];

    protected $fillable = [
        'id_producto', 'nombre', 'slug', 'tipo', 'imagen_base',
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
