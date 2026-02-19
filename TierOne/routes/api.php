<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\Juego;

// 🧪 RUTA TEMPORAL DE PRUEBA - Ver datos del Factory
Route::get('/test/juegos', function () {
    return [
        'total' => Juego::count(),
        'juegos' => Juego::all()
    ];
});

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
Route::get('/productos/{id}', [ProductoController::class, 'show']);
Route::get('/categorias', [CategoriaController::class, 'index']);
Route::get('/juegos', [JuegoController::class, 'index']);
Route::get('/torneos', [TorneoController::class, 'index']);

// ===================================
// RUTAS PROTEGIDAS (Auth:Sanctum)
// ===================================
Route::middleware('auth:sanctum')->group(function () {
    // Usuario autentificado
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // ===================================
    // GESTIÓN DE USUARIOS (Admin)
    // ===================================
    Route::middleware('role:admin')->group(function () {
        Route::apiResource('users', UserController::class);
        Route::apiResource('proveedores', ProveedorController::class);
        Route::apiResource('reportes', ReporteController::class);
    });

    // ===================================
    // CATÁLOGO (Admin/Staff)
    // ===================================
    Route::middleware('role:admin, staff')->group(function () {
        Route::apiResource('categorias', CategoriaController::class) -> except(['index', 'show']); //? Utilizamos except(['index', 'show']) por que ver productos es público 
        Route::apiResource('productos', ProductoController::class) ->except(['index', 'show']);
        Route::apiResource('juegos', JuegoController::class)->except((['index', 'show']));
    });
    // ===================================
    // TORNEOS
    // ===================================
    Route::apiResource('torneos', TorneoController::class);
    Route::apiResource('partidas', PartidaController::class);
    Route::apiResource('inscripciones-torneo', InscripcionTorneoController::class);

    // ===================================
    // E-COMMERCE
    // ===================================
    Route::apiResource('ordenes', OrdenController::class);
    Route::apiResource('carritos', CarritoController::class);
    Route::apiResource('direcciones-envio', DireccionEnvioController::class);
    Route::apiResource('reviews', ReviewController::class);

    // ===================================
    // REPORTES
    // ===================================
    Route::apiResource('reportes', ReporteController::class);
});