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

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
