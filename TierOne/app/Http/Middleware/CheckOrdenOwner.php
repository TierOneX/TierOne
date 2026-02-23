<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Traits\ApiResponseTrait;
use App\Models\Orden;


class CheckOrdenOwner
{

    use ApiResponseTrait;
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        //1. Obetner el ID de la Orden desde la URL(ej: api/orden/{orden})
        $ordenId = $request->route("orden");

        if (!$ordenId) {
            return $next($request);
        }

        $orden = $ordenId instanceof Orden ? $ordenId : Orden::find($ordenId);
        if (!$orden) {
            return $this->notFoundResponse('Orden no encontrada');
        }

        if ($request->user()->id !== $orden->id_usuario && $request->user()->rol !== 'admin') {
            return $this->forbiddenResponse('No tienes permiso para modificar esta Orden');
        }
        return $next($request);
    }
}
