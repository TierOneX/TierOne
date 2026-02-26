<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Traits\ApiResponseTrait;

class CheckRole
{
    use ApiResponseTrait;
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {

        //1. Verificar si el usuario esta autentificado 
        if (!$request->user()){
            return $this->unauthorizedResponse('No autentificado');
        }

        //2. Verifica el Rol
        if (!in_array($request->user()->rol, $roles)) {
        return $this->forbiddenResponse('No autorizado. Requiere rol: ' . implode(' o ' , $roles));
        }
        return $next($request);
    }
}
