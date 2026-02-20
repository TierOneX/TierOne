<?php

namespace App\Http\Middleware;


use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\Torneo;
use App\Traits\ApiResponseTrait;
class CheckTorneoOwner
{
    use ApiResponseTrait;

    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        //1. Obtener el ID del torneo desde la URL (ej: api/torneos/{torneo})
        $torneoId = $request->route("torneo");

        // Si no hay ID en la ruta(raro), dejamos pasar al controlador para que falle allí
        if (!$torneoId) {
            return $next($request);
        }

        // 2. Buscar el torneo
        // Si el parmetro ya es el objeto (Route Model Biding), lo usamos directo
        // Si es solo el ID (string/int), lo buscamos.
        $torneo = $torneoId instanceof Torneo ? $torneoId : Torneo::find($torneoId);
        if(!$torneo){
            return $this->notFoundResponse('Torneo no encontrado');
        }

        // 3. Verificar si el usuario logueado es el organizor 
        // NOTA: Si es ADMIN
        if ($request->user()->id !== $torneo -> id_organizador && $request->user()->rol !=='admin'){
            return $this->forbiddenResponse('No tienes permiso para modificar este Torneo');
        }
        
        return $next($request);
    }
}
