<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Torneo extends Model
{
    use HasFactory;

    protected $table = 'torneos';

    protected $fillable = [
        'id_juego',
        'id_organizador',
        'nombre',
        'descripcion',
        'imagen_banner',
        'formato',
        'max_participantes',
        'cuota_inscripcion',
        'premio_total',
        'comision_plataforma_porcentaje',
        'es_gratuito',
        'fecha_inicio',
        'fecha_fin',
        'cierre_inscripciones',
        'estado',
        'reglas_url',
        'stream_url',
        'verificado',
    ];

    protected $casts = [
        'es_gratuito' => 'boolean',
        'verificado' => 'boolean',
        'fecha_inicio' => 'datetime',
        'fecha_fin' => 'datetime',
        'cierre_inscripciones' => 'datetime',
        'cuota_inscripcion' => 'decimal:2',
        'premio_total' => 'decimal:2',
        'comision_plataforma_porcentaje' => 'decimal:2',
    ];

    public function juego()
    {
        return $this->belongsTo(Juego::class, 'id_juego');
    }

    public function organizador()
    {
        return $this->belongsTo(User::class, 'id_organizador');
    }

    public function transacciones()
    {
        return $this->hasMany(Transaccion::class, 'id_torneo');
    }
}
