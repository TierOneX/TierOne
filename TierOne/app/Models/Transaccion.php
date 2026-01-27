<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaccion extends Model
{
    use HasFactory;

    protected $table = 'transacciones';

    protected $fillable = [
        'id_usuario',
        'id_orden',
        'id_partida',
        'id_torneo',
        'id_retiro',
        'tipo',
        'monto',
        'balance_anterior',
        'balance_nuevo',
        'descripcion',
        'fecha_transaccion',
    ];

    protected $casts = [
        'monto' => 'decimal:2',
        'balance_anterior' => 'decimal:2',
        'balance_nuevo' => 'decimal:2',
        'fecha_transaccion' => 'datetime',
    ];

    public function usuario()
    {
        return $this->belongsTo(User::class, 'id_usuario');
    }

    public function orden()
    {
        return $this->belongsTo(Orden::class, 'id_orden');
    }

    public function torneo()
    {
        return $this->belongsTo(Torneo::class, 'id_torneo');
    }

    public function retiro()
    {
        return $this->belongsTo(Retiro::class, 'id_retiro');
    }
}
