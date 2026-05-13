<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\StripeController;
use App\Http\Controllers\Web\MatchController;
use App\Http\Controllers\Web\GamingAdminController;
use App\Http\Controllers\Web\TournamentController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// =========================================================================
// FRONTEND ROUTES (LANDING & HOME)
// =========================================================================

Route::get('/', function () {
    return Inertia::render('LandingPage');
});

Route::get('/debug-500', function () {
    abort(500);
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

Route::redirect('/dashboard', '/profile')
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

// =========================================================================
// SHOP & PRODUCT ROUTES
// =========================================================================

Route::get('/shop', function () {
    return Inertia::render('Shop', [
        'productos' => \App\Models\Producto::with('categoria')
            ->where('activo', true)
            ->orderByDesc('destacado')
            ->orderByDesc('ventas_totales')
            ->get(),
        'categorias' => \App\Models\Categoria::where('activa', true)
            ->whereHas('productos', function ($q) {
                $q->where('activo', true);
            })
            ->orderBy('nombre')
            ->get(),
    ]);
})->name('shop');

Route::get('/matches', [MatchController::class, 'index'])->name('matches');
Route::get('/matches/{partida}', [MatchController::class, 'show'])->name('matches.show');
Route::post('/matches', [MatchController::class, 'store'])->name('matches.store');
Route::post('/matches/{partida}/join', [MatchController::class, 'join'])->name('matches.join');
Route::delete('/matches/{partida}/leave', [MatchController::class, 'leave'])->name('matches.leave');
Route::get('/tournaments', [TournamentController::class, 'index'])->name('tournaments');
Route::post('/tournaments/{torneo}/join', [TournamentController::class, 'join'])
    ->middleware('auth')
    ->name('tournaments.join');
Route::middleware('auth')->prefix('paneladmingaming')->name('panel.gaming.')->group(function () {
    Route::get('/', [GamingAdminController::class, 'index'])->name('index');
    Route::post('/torneos', [GamingAdminController::class, 'storeTorneo'])->name('torneos.store');
    Route::put('/torneos/{torneo}', [GamingAdminController::class, 'updateTorneo'])->name('torneos.update');
    Route::delete('/torneos/{torneo}', [GamingAdminController::class, 'destroyTorneo'])->name('torneos.destroy');
    Route::post('/juegos', [GamingAdminController::class, 'storeJuego'])->name('juegos.store');
    Route::put('/juegos/{juego}', [GamingAdminController::class, 'updateJuego'])->name('juegos.update');
    Route::delete('/juegos/{juego}', [GamingAdminController::class, 'destroyJuego'])->name('juegos.destroy');
    Route::put('/partidas/{partida}', [GamingAdminController::class, 'updatePartida'])->name('partidas.update');
    Route::delete('/partidas/{partida}', [GamingAdminController::class, 'destroyPartida'])->name('partidas.destroy');
    Route::put('/incidencias/{reporte}', [GamingAdminController::class, 'updateIncidencia'])->name('incidencias.update');
    Route::put('/cuentas/{user}', [GamingAdminController::class, 'updateCuenta'])->name('cuentas.update');
});

Route::get('/shop/{slug}', function (string $slug) {
    $producto = \App\Models\Producto::with(['categoria', 'imagenes', 'variantes', 'reviews.usuario'])
        ->where('slug', $slug)
        ->where('activo', true)
        ->firstOrFail();

    $relacionados = \App\Models\Producto::with('categoria')
        ->where('id_categoria', $producto->id_categoria)
        ->where('id', '!=', $producto->id)
        ->where('activo', true)
        ->take(4)
        ->get();

    return Inertia::render('Product', [
        'producto' => $producto,
        'relacionados' => $relacionados,
    ]);
})->name('product.show');

Route::get('/cart', function () {
    return Inertia::render('Cart');
})->name('cart');

// =========================================================================
// LEGAL ROUTES
// =========================================================================

Route::get('/terms', function () {
    return Inertia::render('Legal/Terms');
})->name('legal.terms');

Route::get('/privacy', function () {
    return Inertia::render('Legal/Privacy');
})->name('legal.privacy');

Route::get('/cookies', function () {
    return Inertia::render('Legal/Cookies');
})->name('legal.cookies');

Route::get('/shipping', function () {
    return Inertia::render('Legal/Shipping');
})->name('legal.shipping');

Route::get('/contact', function () {
    return Inertia::render('Legal/Contact');
})->name('legal.contact');

Route::get('/help', function () {
    return Inertia::render('Legal/Help');
})->name('legal.help');

// =========================================================================
// CUSTOMIZATION ROUTES (USUARIO)
// =========================================================================

Route::get('/shop/{slug}/personalizar', [App\Http\Controllers\Web\CustomizationController::class, 'editor'])->name('product.customize');
Route::post('/customization/upload-image', [App\Http\Controllers\Web\CustomizationController::class, 'uploadImage'])->name('customization.upload');
Route::post('/customization/save-render', [App\Http\Controllers\Web\CustomizationController::class, 'saveRender'])->name('customization.saveRender');
Route::post('/customization/calcular-precio', [App\Http\Controllers\Web\CustomizationController::class, 'calcularPrecio'])->name('customization.calcularPrecio');

// =========================================================================
// ADMIN PANEL ROUTES
// =========================================================================

Route::prefix('panel-admin-ecommerce')->name('panel.ecommerce.')->group(function () {
    Route::get('/', [App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');
    Route::get('/products', [App\Http\Controllers\Web\ProductController::class, 'index'])->name('products');
    Route::post('/products', [App\Http\Controllers\Web\ProductController::class, 'store'])->name('products.store');
    Route::put('/products/{producto}', [App\Http\Controllers\Web\ProductController::class, 'update'])->name('products.update');
    Route::delete('/products/{producto}', [App\Http\Controllers\Web\ProductController::class, 'destroy'])->name('products.destroy');
    Route::get('/categories', [App\Http\Controllers\Web\CategoryController::class, 'index'])->name('categories');
    Route::post('/categories', [App\Http\Controllers\Web\CategoryController::class, 'store'])->name('categories.store');
    Route::put('/categories/{categoria}', [App\Http\Controllers\Web\CategoryController::class, 'update'])->name('categories.update');
    Route::delete('/categories/{categoria}', [App\Http\Controllers\Web\CategoryController::class, 'destroy'])->name('categories.destroy');
    Route::get('/orders', [App\Http\Controllers\Web\OrderController::class, 'index'])->name('orders');
    Route::post('/orders', [App\Http\Controllers\Web\OrderController::class, 'store'])->name('orders.store');
    Route::put('/orders/{orden}', [App\Http\Controllers\Web\OrderController::class, 'update'])->name('orders.update');
    Route::delete('/orders/{orden}', [App\Http\Controllers\Web\OrderController::class, 'destroy'])->name('orders.destroy');
    Route::get('/orders/{orden}/invoice', [App\Http\Controllers\Web\OrderController::class, 'downloadInvoice'])->name('orders.invoice');
    Route::get('/proveedores', [App\Http\Controllers\ProveedorController::class, 'index'])->name('proveedores');
    Route::post('/proveedores', [App\Http\Controllers\ProveedorController::class, 'store'])->name('proveedores.store');
    Route::put('/proveedores/{proveedor}', [App\Http\Controllers\ProveedorController::class, 'update'])->name('proveedores.update');
    Route::delete('/proveedores/{proveedor}', [App\Http\Controllers\ProveedorController::class, 'destroy'])->name('proveedores.destroy');

    // Finanzas
    Route::get('/finanzas/pagos', [App\Http\Controllers\FinanzaController::class, 'pagos'])->name('finanzas.pagos');
    Route::get('/finanzas/transacciones', [App\Http\Controllers\FinanzaController::class, 'transacciones'])->name('finanzas.transacciones');
    Route::get('/finanzas/retiros', [App\Http\Controllers\FinanzaController::class, 'retiros'])->name('finanzas.retiros');
    Route::post('/finanzas/retiros/{id}', [App\Http\Controllers\FinanzaController::class, 'updateRetiro'])->name('finanzas.retiros.update');

    // Reviews
    Route::get('/reviews', [App\Http\Controllers\ReviewController::class, 'index'])->name('reviews');
    Route::delete('/reviews/{review}', [App\Http\Controllers\ReviewController::class, 'destroy'])->name('reviews.destroy');

    // Zonas de personalización
    Route::get('/products/{producto}/zonas', [App\Http\Controllers\Web\ZonaPersonalizacionController::class, 'index'])->name('products.zonas');
    Route::post('/products/{producto}/zonas', [App\Http\Controllers\Web\ZonaPersonalizacionController::class, 'store'])->name('products.zonas.store');
    Route::post('/products/{producto}/zonas/sync', [App\Http\Controllers\Web\ZonaPersonalizacionController::class, 'bulkSync'])->name('products.zonas.sync');
    Route::put('/zonas/{zona}', [App\Http\Controllers\Web\ZonaPersonalizacionController::class, 'update'])->name('zonas.update');
    Route::delete('/zonas/{zona}', [App\Http\Controllers\Web\ZonaPersonalizacionController::class, 'destroy'])->name('zonas.destroy');
    Route::put('/products/{producto}/precios-personalizacion', [App\Http\Controllers\Web\ZonaPersonalizacionController::class, 'updatePrecios'])->name('products.precios');
});

// =========================================================================
    // STRIPE / PAYMENT ROUTES
// =========================================================================

Route::post('/stripe/webhook', [StripeController::class, 'webhook'])->name('stripe.webhook');
Route::post('/stripe/create-intent', [StripeController::class, 'crearPaymentIntent'])->name('stripe.create-intent');
Route::post('/stripe/create-intent-torneo', [StripeController::class, 'crearPaymentIntentTorneo'])->name('stripe.create-intent-torneo');
Route::post('/stripe/confirm', [StripeController::class, 'confirmarPago'])->name('stripe.confirm');
Route::get('/stripe/orden/{orderId}', [StripeController::class, 'obtenerOrden'])->name('stripe.orden');
Route::get('/pedido/{orden}/factura', [\App\Http\Controllers\Web\OrderController::class, 'downloadInvoice'])->name('order.invoice');

Route::get('/checkout', function () {
    return Inertia::render('Checkout', [
        'stripeKey' => config('stripe.key'),
    ]);
})->name('checkout');

Route::get('/tournaments/{torneo}/checkout', function (\App\Models\Torneo $torneo) {
    return Inertia::render('TournamentCheckout', [
        'torneo' => $torneo->load('juego'),
        'stripeKey' => config('stripe.key'),
    ]);
})->middleware('auth')->name('tournaments.checkout');

Route::get('/checkout/success', function () {
    return Inertia::render('CheckoutSuccess');
})->name('checkout.success');

// =========================================================================
// COMMUNITY ROUTES
// =========================================================================

Route::get('/community', [App\Http\Controllers\Web\GameCommunityController::class, 'index'])
    ->name('community.index');

Route::get('/community/{slug}', [App\Http\Controllers\Web\GameCommunityController::class, 'show'])
    ->name('community.show');

// =========================================================================
// AUTH & PROFILE ROUTES
// =========================================================================

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    
    // Ruta para descargar facturas (propia)
    Route::get('/orders/{orden}/invoice', [App\Http\Controllers\Web\OrderController::class, 'downloadInvoice'])
        ->name('user.orders.invoice');
});

require __DIR__ . '/auth.php';
