<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

/**
 * Modelo Proveedor 
 * 
 * Representa un proveedor de productos para dropshipping
 * 
 * @property int $id
 * @property string $nombre
 * @property string $slug
 * @property string $contacto_nombre
 * @property string $email
 * @property string|null $telefono
 * @property string|null $direccion
 * @property string|null $notas
 * @property bool $activo
 * @property \Carbon\Carbon $fecha_registro
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
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
        'slug',
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
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Boot method para generar slug automáticamente
     */
    protected static function boot()
    {
        parent::boot();

        // Antes de crear
        static::creating(function ($proveedor) {
            if (empty($proveedor->slug)) {
                $proveedor->slug = Str::slug($proveedor->nombre);
            }
        });

        // Después de crear (por si creating no funcionó)
        static::created(function ($proveedor) {
            if (empty($proveedor->slug)) {
                $proveedor->slug = Str::slug($proveedor->nombre);
                $proveedor->saveQuietly();
            }
        });

        // Al actualizar
        static::updating(function ($proveedor) {
            if ($proveedor->isDirty('nombre') && empty($proveedor->slug)) {
                $proveedor->slug = Str::slug($proveedor->nombre);
            }
        });
    }

}
