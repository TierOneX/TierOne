<?php


use App\Http\Controllers\CategoriaController;
use App\Http\Controllers\JuegoController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProveedorController;


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


/**
 * =====================================
 *  RUTAS API CRUD - TierOne
 * =====================================
 */

// Rutas para Usuarios
Route::apiResource('users', UserController::class);

// Rutas para los Proveedores
Route::apiResource('proveedores', ProveedorController::class);

// Rutas para los Juegos
Route::apiResource('juegos', JuegoController::class);

// Rutas para la Categorías
Route::apiResource('categorias', CategoriaController::class);
