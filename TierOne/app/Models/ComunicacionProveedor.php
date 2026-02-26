<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ComunicacionProveedor extends Model
{
    use HasFactory;

    protected $table = 'comunicaciones_proveedor';

    protected $fillable = [
        'id_orden',
        'id_proveedor',
        'tipo',
        'asunto',
        'contenido_email',
        'email_from',
        'email_to',
        'fecha_respuesta',
        'respuesta_contenido',
        'leido',
    ];

    protected $casts = [
        'leido' => 'boolean',
        'fecha_respuesta' => 'datetime',
    ];

    public function orden()
    {
        return $this->belongsTo(Orden::class, 'id_orden');
    }

    public function proveedor()
    {
        return $this->belongsTo(Proveedor::class, 'id_proveedor');
    }
}
