<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Laravel\Sanctum\HasApiTokens;

use Laravel\Sanctum\HasApiTokens;

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
    use HasApiTokens, HasFactory, Notifiable;

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

    /**
     * Relación: Carritos del usuario
     */
    public function carritos()
    {
        return $this->hasMany(Carrito::class, 'id_usuario');
    }

    // --- Relaciones de Torneos ---

    /**
     * Relación: Torneos organizados por el usuario
     */
    public function torneosOrganizados()
    {
        return $this->hasMany(Torneo::class, 'id_organizador');
    }

    /**
     * Relación: Torneos en los que está inscrito
     */
    public function inscripcionesTorneos()
    {
        return $this->hasMany(InscripcionTorneo::class, 'id_usuario');
    }

    // --- Relaciones de Partidas (Matchmaking) ---

    /**
     * Relación: Partidas creadas por el usuario
     */
    public function partidasCreadas()
    {
        return $this->hasMany(Partida::class, 'id_creador');
    }

    /**
     * Relación: Partidas en las que participa
     */
    public function participacionesPartidas()
    {
        return $this->hasMany(ParticipantePartida::class, 'id_usuario');
    }
}
