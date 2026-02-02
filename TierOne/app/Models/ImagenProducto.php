<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ImagenProducto extends Model
{
    use HasFactory;

    protected $table = 'imagenes_producto';

    protected $fillable = [
        'id_producto',
        'url',
        'orden',
        'es_principal',
    ];

    protected $casts = [
        'es_principal' => 'boolean',
        'orden' => 'integer',
    ];

    public function producto()
    {
        return $this->belongsTo(Producto::class, 'id_producto');
    }
}
