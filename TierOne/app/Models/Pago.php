<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pago extends Model
{
    use HasFactory;

    protected $table = 'pagos';

    public $timestamps = false;

    protected $fillable = [
        'id_orden',
        'monto',
        'metodo',
        'id_transaccion',
        'estado',
        'fecha_pago',
        'detalles_json',
    ];

    protected $casts = [
        'monto' => 'decimal:2',
        'fecha_pago' => 'datetime',
        'detalles_json' => 'array', // Cast automático a array asociativo
    ];

    public function orden()
    {
        return $this->belongsTo(Orden::class, 'id_orden');
    }
}
