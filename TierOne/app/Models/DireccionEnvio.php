<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DireccionEnvio extends Model
{
    use HasFactory;

    protected $table = 'direcciones_envio';

    public $timestamps = false;

    protected $fillable = [
        'id_usuario',
        'nombre_completo',
        'direccion_linea1',
        'ciudad',
        'estado_provincia',
        'codigo_postal',
        'pais',
        'telefono',
        'predeterminada',
    ];

    protected $casts = [
        'predeterminada' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'id_usuario');
    }
}
