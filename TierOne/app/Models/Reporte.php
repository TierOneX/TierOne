<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Modelo Reporte
 * 
 * Gestiona los informes de incidencias o reclamaciones sobre las partidas.
 * 
 * @property int $id
 * @property int $id_partida
 * @property int $id_usuario_reporta
 * @property int|null $id_resuelto_por
 * @property string $tipo
 * @property string $descripcion
 * @property string|null $evidencia_url
 * @property string $estado
 * @property string|null $resolucion
 * @property \Carbon\Carbon $fecha_reporte
 * @property \Carbon\Carbon|null $fecha_resolucion
 */
class Reporte extends Model
{
    use HasFactory;

    /**
     * Nombre de la tabla asociada
     */
    protected $table = 'reportes';

<<<<<<< HEAD
    public $timestamps = false;

=======
>>>>>>> origin/dev
    /**
     * Campos asignables masivamente
     */
    protected $fillable = [
        'id_partida',
        'id_usuario_reporta',
        'id_resuelto_por',
        'tipo',
        'descripcion',
        'evidencia_url',
        'estado',
        'resolucion',
        'fecha_reporte',
        'fecha_resolucion',
    ];

    /**
     * Conversión automática de tipos
     */
    protected $casts = [
        'fecha_reporte' => 'datetime',
        'fecha_resolucion' => 'datetime',
    ];

    /**
     * Relación: Partida reportada
     * 
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function partida()
    {
        return $this->belongsTo(Partida::class, 'id_partida');
    }

    /**
     * Relación: Usuario que realiza el reporte
     * 
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function usuarioReporta()
    {
        return $this->belongsTo(User::class, 'id_usuario_reporta');
    }

    /**
     * Relación: Usuario (Admin) que resuelve el reporte
     * 
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function resueltoPor()
    {
        return $this->belongsTo(User::class, 'id_resuelto_por');
    }
}
