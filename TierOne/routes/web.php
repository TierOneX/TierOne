<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
    'canLogin' => Route::has('login'),
    'canRegister' => Route::has('register'),
    'laravelVersion' => Application::VERSION,
    'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/home', function () {
    return Inertia::render('Home', [
    'games' => \App\Models\Juego::where('activo', true)->get(),
    'products' => \App\Models\Producto::with('categoria')
    ->where('activo', true)
    ->where('destacado', true)
    ->take(8)
    ->get(),
    'tournaments' => \App\Models\Torneo::with('juego')
    ->withCount('inscripciones')
    ->whereIn('estado', ['inscripciones', 'en_curso'])
    ->orderBy('fecha_inicio')
    ->take(4)
    ->get(),
    ]);
})->name('home');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/shop', function () {
    return Inertia::render('Shop', [
    'productos' => []
    ]);
})->name('shop');

Route::prefix('panel-admin-ecommerce')->name('panel.ecommerce.')->group(function () {
    Route::get('/', function () {
        return Inertia::render('PanelAdminEcommerce/Dashboard');
    })->name('dashboard');

    Route::get('/products', function () {
        return Inertia::render('PanelAdminEcommerce/Products');
    })->name('products');

    Route::get('/orders', function () {
        return Inertia::render('PanelAdminEcommerce/Orders');
    })->name('orders');

    Route::get('/reports', function () {
        return Inertia::render('PanelAdminEcommerce/Reports');
    })->name('reports');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class , 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class , 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class , 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
