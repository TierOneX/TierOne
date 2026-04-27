# 🛠️ PLAN DE CORRECCIÓN DEL BACKEND - TIER ONE
## Guía de Implementación Paso a Paso

**Fecha**: 2026-02-11  
**Estimación Total**: 2-3 semanas  
**Equipo**: 1-2 desarrolladores senior

---

## 📋 FASE 1: CORRECCIONES CRÍTICAS DE SEGURIDAD (Semana 1)

### Sprint 1.1: Autenticación y Rutas API (3 días)

#### Día 1: Implementar Autenticación Base

**1.1 Crear AuthController**
```bash
php artisan make:controller Api/AuthController
```

**Archivo**: `app/Http/Controllers/Api/AuthController.php`
```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    use \App\Traits\ApiResponseTrait;

    public function register(Request $request)
    {
        $validated = $request->validate([
            'username' => 'required|string|max:255|unique:users',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'nombre' => 'required|string|max:255',
            'apellido' => 'required|string|max:255',
            'pais' => 'required|string|max:100',
        ]);

        $user = User::create([
            'username' => $validated['username'],
            'email' => $validated['email'],
            'password' => $validated['password'], // Se hasheará automáticamente
            'nombre' => $validated['nombre'],
            'apellido' => $validated['apellido'],
            'pais' => $validated['pais'],
        ]);

        $token = $user->createToken('auth-token')->plainTextToken;

        return $this->successResponse([
            'user' => $user,
            'token' => $token,
        ], 'Usuario registrado exitosamente', 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Las credenciales proporcionadas son incorrectas.'],
            ]);
        }

        $token = $user->createToken('auth-token')->plainTextToken;

        return $this->successResponse([
            'user' => $user,
            'token' => $token,
        ], 'Login exitoso');
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return $this->successResponse(null, 'Logout exitoso');
    }

    public function me(Request $request)
    {
        return $this->successResponse($request->user(), 'Usuario autenticado');
    }
}
```

**1.2 Actualizar Modelo User**

**Archivo**: `app/Models/User.php`
```php
// Cambiar:
protected $fillable = [
    'username',
    'email',
    'password_hash', // ❌ QUITAR
    // ...
];

// Por:
protected $fillable = [
    'username',
    'email',
    'password', // ✅ AGREGAR
    'nombre',
    'apellido',
    'pais',
    'rol',
    'verificado',
    'activo',
];

// Agregar:
use Illuminate\Database\Eloquent\Casts\Attribute;

protected function password(): Attribute
{
    return Attribute::make(
        set: fn ($value) => Hash::make($value),
    );
}
```

**1.3 Crear Migración para Cambiar Nombre de Columna**
```bash
php artisan make:migration rename_password_hash_to_password_in_users_table
```

```php
<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->renameColumn('password_hash', 'password');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->renameColumn('password', 'password_hash');
        });
    }
};
```

```bash
php artisan migrate
```

---

#### Día 2: Definir Rutas API Completas

**Archivo**: `routes/api.php`
```php
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\{
    CategoriaController,
    ProductoController,
    UserController,
    TorneoController,
    OrdenController,
    CarritoController,
    PartidaController,
    JuegoController,
    ProveedorController,
    ReviewController,
    ReporteController,
    InscripcionTorneoController,
};

/*
|--------------------------------------------------------------------------
| API Routes v1
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {
    
    // ========================================
    // RUTAS PÚBLICAS (Sin autenticación)
    // ========================================
    
    // Autenticación
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    
    // Recursos públicos (solo lectura)
    Route::get('/categorias', [CategoriaController::class, 'index']);
    Route::get('/categorias/{id}', [CategoriaController::class, 'show']);
    
    Route::get('/productos', [ProductoController::class, 'index']);
    Route::get('/productos/{id}', [ProductoController::class, 'show']);
    
    Route::get('/juegos', [JuegoController::class, 'index']);
    Route::get('/juegos/{id}', [JuegoController::class, 'show']);
    
    Route::get('/torneos', [TorneoController::class, 'index']);
    Route::get('/torneos/{id}', [TorneoController::class, 'show']);
    
    Route::get('/partidas', [PartidaController::class, 'index']);
    Route::get('/partidas/{id}', [PartidaController::class, 'show']);
    
    // ========================================
    // RUTAS PROTEGIDAS (Requieren autenticación)
    // ========================================
    
    Route::middleware(['auth:sanctum', 'throttle:60,1'])->group(function () {
        
        // Auth
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
        
        // Perfil de usuario
        Route::get('/profile', [UserController::class, 'show']);
        Route::put('/profile', [UserController::class, 'update']);
        
        // Carrito (específico del usuario autenticado)
        Route::prefix('carrito')->group(function () {
            Route::get('/', [CarritoController::class, 'index']);
            Route::post('/items', [CarritoController::class, 'store']);
            Route::put('/items/{id}', [CarritoController::class, 'update']);
            Route::delete('/items/{id}', [CarritoController::class, 'destroy']);
        });
        
        // Órdenes del usuario
        Route::apiResource('ordenes', OrdenController::class);
        
        // Partidas - Acciones de usuario
        Route::post('/partidas/{id}/join', [PartidaController::class, 'join']);
        Route::apiResource('partidas', PartidaController::class);
        
        // Torneos - Inscripciones
        Route::post('/torneos/{id}/inscribir', [InscripcionTorneoController::class, 'store']);
        Route::apiResource('torneos', TorneoController::class);
        
        // Reviews de productos
        Route::post('/productos/{id}/reviews', [ReviewController::class, 'store']);
        
        // Reportes
        Route::post('/reportes', [ReporteController::class, 'store']);
    });
    
    // ========================================
    // RUTAS DE ADMINISTRACIÓN (Solo Admin)
    // ========================================
    
    Route::prefix('admin')->middleware(['auth:sanctum', 'role:admin'])->group(function () {
        
        // Gestión de usuarios
        Route::apiResource('users', UserController::class);
        
        // Gestión de productos
        Route::apiResource('productos', ProductoController::class)->except(['index', 'show']);
        
        // Gestión de categorías
        Route::apiResource('categorias', CategoriaController::class)->except(['index', 'show']);
        
        // Gestión de juegos
        Route::apiResource('juegos', JuegoController::class)->except(['index', 'show']);
        
        // Gestión de proveedores
        Route::apiResource('proveedores', ProveedorController::class);
        
        // Reportes completos
        Route::get('/reportes', [ReporteController::class, 'index']);
        Route::get('/reportes/{id}', [ReporteController::class, 'show']);
    });
});
```

---

#### Día 3: Crear Middleware de Roles

**1. Crear Middleware**
```bash
php artisan make:middleware RoleMiddleware
```

**Archivo**: `app/Http/Middleware/RoleMiddleware.php`
```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, string $role): Response
    {
        if (!$request->user()) {
            return response()->json([
                'success' => false,
                'message' => 'No autenticado'
            ], 401);
        }

        if ($request->user()->rol !== $role) {
            return response()->json([
                'success' => false,
                'message' => 'No tienes permisos para acceder a este recurso'
            ], 403);
        }

        return $next($request);
    }
}
```

**2. Registrar Middleware**

**Archivo**: `bootstrap/app.php`
```php
->withMiddleware(function (Middleware $middleware): void {
    $middleware->web(append: [
        \App\Http\Middleware\HandleInertiaRequests::class,
        \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
    ]);
    
    // ✅ AGREGAR:
    $middleware->alias([
        'role' => \App\Http\Middleware\RoleMiddleware::class,
    ]);
})
```

---

### Sprint 1.2: Form Requests (2 días)

#### Crear Form Requests para todos los controladores

**Comando**:
```bash
php artisan make:request StoreUserRequest
php artisan make:request UpdateUserRequest
php artisan make:request StoreProductoRequest
php artisan make:request UpdateProductoRequest
php artisan make:request StoreCategoriaRequest
php artisan make:request UpdateCategoriaRequest
php artisan make:request StoreTorneoRequest
php artisan make:request UpdateTorneoRequest
php artisan make:request StoreOrdenRequest
php artisan make:request StorePartidaRequest
php artisan make:request JoinPartidaRequest
```

**Ejemplo**: `app/Http/Requests/StoreUserRequest.php`
```php
<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // O verificar si el usuario actual es admin
    }

    public function rules(): array
    {
        return [
            'username' => 'required|string|max:255|unique:users,username',
            'email' => 'required|email|max:255|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'nombre' => 'required|string|max:255',
            'apellido' => 'required|string|max:255',
            'pais' => 'required|string|max:100',
            'rol' => 'nullable|in:player,admin,streamer',
        ];
    }

    public function messages(): array
    {
        return [
            'username.required' => 'El nombre de usuario es obligatorio',
            'username.unique' => 'Este nombre de usuario ya está en uso',
            'email.email' => 'El correo electrónico debe ser válido',
            'email.unique' => 'Este correo electrónico ya está registrado',
            'password.min' => 'La contraseña debe tener al menos 8 caracteres',
            'password.confirmed' => 'Las contraseñas no coinciden',
        ];
    }
}
```

**Actualizar Controladores**:
```php
// Antes:
public function store(Request $request): JsonResponse
{
    $validated = $request->validate([...]);
    // ...
}

// Después:
use App\Http\Requests\StoreUserRequest;

public function store(StoreUserRequest $request): JsonResponse
{
    try {
        $usuario = User::create($request->validated());
        return $this->successResponse($usuario, 'Usuario creado correctamente', 201);
    } catch (\Exception $e) {
        return $this->errorResponse('Error al crear el usuario', $e->getMessage());
    }
}
```

---

## 📋 FASE 2: ARQUITECTURA Y SEPARACIÓN DE RESPONSABILIDADES (Semana 2)

### Sprint 2.1: Services Layer (3 días)

**1. Crear Services**
```bash
mkdir app/Services
```

**Ejemplo**: `app/Services/OrdenService.php`
```php
<?php

namespace App\Services;

use App\Models\Orden;
use App\Models\ItemOrden;
use App\Models\User;
use App\Models\Carrito;
use Illuminate\Support\Facades\DB;
use App\Events\OrdenCreada;

class OrdenService
{
    /**
     * Crear una nueva orden desde el carrito del usuario
     */
    public function crearDesdeCarrito(int $userId, array $datosEnvio): Orden
    {
        return DB::transaction(function () use ($userId, $datosEnvio) {
            
            $carrito = Carrito::with('items.producto')
                ->where('id_usuario', $userId)
                ->firstOrFail();
            
            if ($carrito->items->isEmpty()) {
                throw new \Exception('El carrito está vacío');
            }
            
            // Crear orden
            $orden = Orden::create([
                'id_usuario' => $userId,
                'id_direccion_envio' => $datosEnvio['id_direccion_envio'],
                'numero_orden' => $this->generarNumeroOrden(),
                'subtotal' => $carrito->subtotal,
                'impuestos' => $this->calcularImpuestos($carrito->subtotal),
                'costo_envio' => $this->calcularCostoEnvio($datosEnvio['pais']),
                'descuento' => 0,
                'total' => $carrito->subtotal + $this->calcularImpuestos($carrito->subtotal) + $this->calcularCostoEnvio($datosEnvio['pais']),
                'estado' => 'pendiente',
                'fecha_orden' => now(),
            ]);
            
            // Crear items de la orden
            foreach ($carrito->items as $item) {
                ItemOrden::create([
                    'id_orden' => $orden->id,
                    'id_producto' => $item->id_producto,
                    'id_variante' => $item->id_variante,
                    'id_proveedor' => $item->producto->id_proveedor,
                    'cantidad' => $item->cantidad,
                    'precio_unitario' => $item->precio_unitario,
                    'subtotal' => $item->subtotal,
                ]);
            }
            
            // Limpiar carrito
            $carrito->items()->delete();
            $carrito->delete();
            
            // Disparar evento
            event(new OrdenCreada($orden));
            
            return $orden->load('items.producto', 'usuario', 'direccionEnvio');
        });
    }
    
    private function generarNumeroOrden(): string
    {
        return 'ORD-' . strtoupper(uniqid());
    }
    
    private function calcularImpuestos(float $subtotal): float
    {
        // Lógica de impuestos (ejemplo: 21% IVA)
        return round($subtotal * 0.21, 2);
    }
    
    private function calcularCostoEnvio(string $pais): float
    {
        // Lógica de costos de envío según país
        return match ($pais) {
            'España' => 5.99,
            'Portugal' => 7.99,
            default => 12.99,
        };
    }
}
```

**2. Crear más Services**:
- `TorneoService.php` - Lógica de creación y gestión de torneos
- `PartidaService.php` - Matchmaking y gestión de partidas
- `CarritoService.php` - Operaciones del carrito
- `ProductoService.php` - Gestión de inventario y stock

**3. Inyectar Services en Controladores**:
```php
class OrdenController extends Controller
{
    public function __construct(
        private OrdenService $ordenService
    ) {}
    
    public function store(StoreOrdenRequest $request): JsonResponse
    {
        try {
            $orden = $this->ordenService->crearDesdeCarrito(
                auth()->id(),
                $request->validated()
            );
            
            return $this->successResponse($orden, 'Orden creada correctamente', 201);
        } catch (\Exception $e) {
            return $this->errorResponse('Error al crear la orden', $e->getMessage());
        }
    }
}
```

---

### Sprint 2.2: Eventos y Listeners (2 días)

**1. Crear Eventos**
```bash
php artisan make:event OrdenCreada
php artisan make:event UsuarioRegistrado
php artisan make:event TorneoCreado
```

**Ejemplo**: `app/Events/OrdenCreada.php`
```php
<?php

namespace App\Events;

use App\Models\Orden;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class OrdenCreada
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public Orden $orden
    ) {}
}
```

**2. Crear Listeners**
```bash
php artisan make:listener EnviarEmailOrdenCreada
php artisan make:listener ActualizarInventario
php artisan make:listener NotificarProveedores
```

**Ejemplo**: `app/Listeners/EnviarEmailOrdenCreada.php`
```php
<?php

namespace App\Listeners;

use App\Events\OrdenCreada;
use Illuminate\Support\Facades\Mail;
use App\Mail\OrdenConfirmacion;

class EnviarEmailOrdenCreada
{
    public function handle(OrdenCreada $event): void
    {
        Mail::to($event->orden->usuario->email)
            ->send(new OrdenConfirmacion($event->orden));
    }
}
```

**3. Registrar en EventServiceProvider**:
```php
// app/Providers/EventServiceProvider.php
protected $listen = [
    \App\Events\OrdenCreada::class => [
        \App\Listeners\EnviarEmailOrdenCreada::class,
        \App\Listeners\ActualizarInventario::class,
        \App\Listeners\NotificarProveedores::class,
    ],
];
```

---

## 📋 FASE 3: TESTING Y DOCUMENTACIÓN (Semana 3)

### Sprint 3.1: Tests (4 días)

**1. Configurar Testing**
```bash
# Crear base de datos de testing
php artisan migrate --env=testing

# Configurar .env.testing
cp .env .env.testing
```

**2. Crear Feature Tests**
```bash
php artisan make:test Api/AuthTest
php artisan make:test Api/ProductoTest
php artisan make:test Api/OrdenTest
php artisan make:test Api/TorneoTest
```

**Ejemplo**: `tests/Feature/Api/ProductoTest.php`
```php
<?php

namespace Tests\Feature\Api;

use App\Models\User;
use App\Models\Producto;
use App\Models\Categoria;
use App\Models\Proveedor;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductoTest extends TestCase
{
    use RefreshDatabase;

    public function test_puede_listar_productos_sin_autenticacion()
    {
        Producto::factory()->count(5)->create();

        $response = $this->getJson('/api/v1/productos');

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'success',
                     'data' => [
                         '*' => ['id', 'nombre', 'precio_venta', 'categoria', 'proveedor']
                     ],
                     'message'
                 ]);
    }

    public function test_admin_puede_crear_producto()
    {
        $admin = User::factory()->admin()->create();
        $categoria = Categoria::factory()->create();
        $proveedor = Proveedor::factory()->create();

        $response = $this->actingAs($admin, 'sanctum')
                         ->postJson('/api/v1/admin/productos', [
                             'id_categoria' => $categoria->id,
                             'id_proveedor' => $proveedor->id,
                             'nombre' => 'Producto Test',
                             'slug' => 'producto-test',
                             'precio_proveedor' => 10.00,
                             'precio_venta' => 15.00,
                         ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('productos', ['nombre' => 'Producto Test']);
    }

    public function test_usuario_normal_no_puede_crear_producto()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')
                         ->postJson('/api/v1/admin/productos', [
                             'nombre' => 'Producto Test',
                         ]);

        $response->assertStatus(403);
    }
}
```

**3. Ejecutar Tests**
```bash
php artisan test
php artisan test --coverage
```

---

### Sprint 3.2: Documentación OpenAPI (1 día)

**1. Instalar Swagger**
```bash
composer require darkaonline/l5-swagger
php artisan vendor:publish --provider "L5Swagger\L5SwaggerServiceProvider"
php artisan l5-swagger:generate
```

**2. Anotar Controladores**
```php
/**
 * @OA\Info(
 *     version="1.0.0",
 *     title="TierOne API",
 *     description="API de la plataforma TierOne Gaming"
 * )
 * @OA\Server(
 *     url="http://localhost:8000/api/v1",
 *     description="Servidor de desarrollo"
 * )
 */
class Controller extends BaseController {}

/**
 * @OA\Get(
 *     path="/productos",
 *     summary="Listar productos",
 *     tags={"Productos"},
 *     @OA\Response(
 *         response=200,
 *         description="Lista de productos",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=true),
 *             @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/Producto"))
 *         )
 *     )
 * )
 */
public function index(): JsonResponse
```

---

## 🎯 CHECKLIST DE IMPLEMENTACIÓN

### Semana 1: Seguridad
- [ ] Crear AuthController (login, register, logout)
- [ ] Renombrar password_hash a password
- [ ] Implementar hashing automático
- [ ] Definir todas las rutas API
- [ ] Crear middleware de roles
- [ ] Implementar rate limiting
- [ ] Crear Form Requests básicos

### Semana 2: Arquitectura
- [ ] Crear OrdenService
- [ ] Crear TorneoService
- [ ] Crear PartidaService
- [ ] Crear CarritoService
- [ ] Implementar eventos (OrdenCreada, etc.)
- [ ] Implementar listeners (emails, notificaciones)
- [ ] Completar relaciones en modelos
- [ ] Optimizar queries (N+1)

### Semana 3: Testing y Docs
- [ ] Tests de autenticación
- [ ] Tests de productos
- [ ] Tests de órdenes
- [ ] Tests de torneos
- [ ] Configurar Swagger
- [ ] Documentar endpoints principales
- [ ] Crear README de API

---

## 📊 VERIFICACIÓN POST-IMPLEMENTACIÓN

**Comandos de validación**:
```bash
# Tests
php artisan test --coverage

# Análisis estático
./vendor/bin/phpstan analyse

# Verificar rutas
php artisan route:list

# Verificar migraciones
php artisan migrate:status

# Verificar configuración
php artisan config:show
```

**Métricas objetivo**:
- ✅ 80%+ de coverage en tests
- ✅ 0 warnings de PHPStan
- ✅ Todas las rutas protegidas con auth
- ✅ Todas las rutas documentadas

---

## 🔥 QUICK START (Día 1)

```bash
# 1. Crear AuthController
php artisan make:controller Api/AuthController

# 2. Crear middlewares
php artisan make:middleware RoleMiddleware

# 3. Ejecutar migración de password
php artisan make:migration rename_password_hash_to_password_in_users_table
php artisan migrate

# 4. Crear Form Requests
php artisan make:request StoreUserRequest
php artisan make:request StoreProductoRequest

# 5. Test inicial
php artisan test
```

---

**Siguiente Paso**: Comenzar con Fase 1, Sprint 1.1 - Autenticación Base.
