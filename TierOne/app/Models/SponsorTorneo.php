<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Modelo SponsorTorneo
 * 
 * Representa un patrocinador asociado a un torneo específico.
 * 
 * @property int $id
 * @property int $id_torneo
 * @property string $nombre_sponsor
 * @property string|null $logo_url
 * @property float $aportacion
 * @property string|null $enlace_web
 * @property string $nivel
 * @property bool $activo
 */
class SponsorTorneo extends Model
{
    use HasFactory;

    /**
     * Nombre de la tabla asociada
     */
    protected $table = 'sponsors_torneo';

    public $timestamps = false;

    /**
     * Campos asignables masivamente
     */
    protected $fillable = [
        'id_torneo',
        'nombre_sponsor',
        'logo_url',
        'aportacion',
        'enlace_web',
        'nivel',
        'activo',
    ];

    /**
     * Conversión automática de tipos
     */
    protected $casts = [
        'aportacion' => 'decimal:2',
        'activo' => 'boolean',
    ];

    /**
     * Relación: Torneo al que pertenece el sponsor
     * 
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function torneo()
    {
        return $this->belongsTo(Torneo::class, 'id_torneo');
    }
}
