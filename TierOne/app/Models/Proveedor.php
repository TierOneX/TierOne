<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
/**
 * Modelo Proveedor 
 * 
 * Representa un proveedor de productos para dropshipping
 * 
 * @property int $id
 * @property string $nombre
 * @property string $contacto_nombre
 * @property string $email
 * @property string|null $telefono
 * @property string|null $direccion
 * @property string|null $notas
 * @property bool $activo
 * @property \Carbon\Carbon $fecha_registro
 */
class Proveedor extends Model
{
    /**
     * Nombre de la tabla asociada
     */
    protected $table = 'proveedores';

    /**
     * Campos asignables masivamente
     * 
     * !Nota: 'fecha_registro' NO está aquí porque se establece automáticamente
     * !con useCurrent() en la migración
     */

    protected $fillable = [
        'nombre',
        'contacto_nombre',
        'email',
        'telefono',
        'direccion',
        'notas',
        'activo',
    ];

    /**
     * Conversión automaticas de tipos
     */

    protected $casts = [
        'activo' => 'boolean',
        'fecha_registro' => 'datetime',
    ];

    /**
     * Deshabilitar timestamps automáticos
     */
    public $timestamps = false;

}
