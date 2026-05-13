<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class JuegoCacheLive extends Model
{
    use HasFactory;

    protected $table = 'juegos_cache_live';

    protected $fillable = [
        'id_juego',
        'viewer_count_total',
        'stream_count',
        'ranking_global',
        'top_streams',
        'top_clips',
    ];

    protected $casts = [
        'top_streams' => 'json',
        'top_clips' => 'json',
        'viewer_count_total' => 'integer',
        'stream_count' => 'integer',
        'ranking_global' => 'integer',
    ];

    /**
     * Relación con el juego
     */
    public function juego(): BelongsTo
    {
        return $this->belongsTo(Juego::class, 'id_juego');
    }
}
