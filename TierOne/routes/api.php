<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Controladores del proyecto
use App\Http\Controllers\CategoriaController;
use App\Http\Controllers\ProductoController;
use App\Http\Controllers\ProveedorController;
use App\Http\Controllers\JuegoController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\TorneoController;
use App\Http\Controllers\OrdenController;
use App\Http\Controllers\PartidaController;
use App\Http\Controllers\CarritoController;
use App\Http\Controllers\DireccionEnvioController;
use App\Http\Controllers\InscripcionTorneoController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\ReporteController;

// ===================================
// RUTAS PÚBLICAS (sin autenticación)
// ===================================
Route::get('/productos', [ProductoController::class, 'index']);
Route::get('/productos/{id}', [ProductoController::class,'show']);
Route::get('/categorias', [CategoriaController::class,'index']);

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
