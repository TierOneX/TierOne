<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Retiro extends Model
{
    use HasFactory;

    protected $table = 'retiros';

    protected $fillable = [
        'id_usuario',
        'id_procesado_por',
        'monto',
        'metodo',
        'detalles_cuenta',
        'estado',
        'fecha_solicitud',
        'fecha_procesado',
        'notas_admin',
    ];

    protected $casts = [
        'monto' => 'decimal:2',
        'fecha_solicitud' => 'datetime',
        'fecha_procesado' => 'datetime',
    ];

    public function usuario()
    {
        return $this->belongsTo(User::class, 'id_usuario');
    }

    public function procesadoPor()
    {
        return $this->belongsTo(User::class, 'id_procesado_por');
    }
}
