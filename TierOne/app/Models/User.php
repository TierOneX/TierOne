<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

/**
 *  Modelo User 
 * 
 * Representa un usuario de la plataforma TierOne 
 * 
 * @property int $id
 * @property string $username
 * @property string $email
 * @property string $password_hash
 * @property string $nombre
 * @property string $apellido
 * @property string $pais
 * @property \Carbon\Carbon $fecha_registro
 * @property \Carbon\Carbon|null $ultima_conexion
 * @property string $rol
 * @property bool $verificado
 * @property bool $activo
 */
class User extends Authenticatable
{
    use HasFactory, Notifiable;

    /**
     * Campos asignables masivamente
     * 
     * !Nota: 'fecha_registro' NO está aquí porque se establece automáticamente
     * !con useCurrent() en la migración
     */
    protected $fillable = [
        'username',
        'email',
        'password_hash',
        'nombre',
        'apellido',
        'pais',
        'rol',
        'verificado',
        'activo',
    ];

    /**
     * Campos ocultos en serialización JSON
     * 
     * Nunca se envían al frontend por seguridad
     */
    protected $hidden = [
        'password_hash',
    ];

    /**
     * Conversión automática de tipos
     */
    protected $casts = [
        'verificado' => 'boolean',
        'activo' => 'boolean',
        'fecha_registro' => 'datetime',
        'ultima_conexion' => 'datetime',
    ];

    /**
     * Deshabilitar timestamps
     * 
     * Usamos fecha_registro y ultima_conexion personalizados
     */
    public $timestamps = false;
}
