<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    use HasFactory;

    protected $table = 'reviews';

    public $timestamps = true;

    protected $fillable = [
        'id_producto',
        'id_usuario',
        'calificacion',
        'comentario',
        'verificado_compra',
    ];

    protected $casts = [
        'calificacion' => 'integer',
        'verificado_compra' => 'boolean',
    ];

    public function producto()
    {
        return $this->belongsTo(Producto::class, 'id_producto');
    }

    public function usuario()
    {
        return $this->belongsTo(User::class, 'id_usuario');
    }
}
