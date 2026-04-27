# 💻 EJEMPLOS DE CÓDIGO - CORRECCIONES BACKEND
## Implementación Completa de Mejores Prácticas

---

## 🔐 AUTENTICACIÓN Y SEGURIDAD

### AuthController Completo

**Archivo**: `app/Http/Controllers/Api/AuthController.php`

```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Models\User;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    use ApiResponseTrait;

    /**
     * Registrar un nuevo usuario
     * 
     * @param RegisterRequest $request
     * @return JsonResponse
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        try {
            $user = User::create($request->validated());
            
            $token = $user->createToken('auth-token')->plainTextToken;
            
            return $this->successResponse([
                'user' => $user,
                'token' => $token,
                'token_type' => 'Bearer',
            ], 'Usuario registrado exitosamente', 201);
            
        } catch (\Exception $e) {
            return $this->errorResponse(
                'Error al registrar usuario', 
                $e->getMessage()
            );
        }
    }

    /**
     * Login de usuario
     * 
     * @param LoginRequest $request
     * @return JsonResponse
     */
    public function login(LoginRequest $request): JsonResponse
    {
        try {
            $user = User::where('email', $request->email)->first();

            if (!$user || !Hash::check($request->password, $user->password)) {
                throw ValidationException::withMessages([
                    'email' => ['Las credenciales proporcionadas son incorrectas.'],
                ]);
            }

            // Verificar si el usuario está activo
            if (!$user->activo) {
                return $this->errorResponse(
                    'Usuario inactivo', 
                    'Tu cuenta ha sido desactivada. Contacta con soporte.', 
                    403
                );
            }

            // Actualizar última conexión
            $user->update(['ultima_conexion' => now()]);

            // Crear token
            $token = $user->createToken('auth-token', ['*'], now()->addDays(30))
                          ->plainTextToken;

            return $this->successResponse([
                'user' => $user,
                'token' => $token,
                'token_type' => 'Bearer',
                'expires_in' => 2592000, // 30 días en segundos
            ], 'Login exitoso');
            
        } catch (ValidationException $e) {
            return $this->validationErrorResponse(
                $e->errors(), 
                'Error de autenticación'
            );
        } catch (\Exception $e) {
            return $this->errorResponse('Error al iniciar sesión', $e->getMessage());
        }
    }

    /**
     * Logout de usuario
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function logout(Request $request): JsonResponse
    {
        try {
            // Eliminar token actual
            $request->user()->currentAccessToken()->delete();
            
            return $this->successResponse(null, 'Logout exitoso');
            
        } catch (\Exception $e) {
            return $this->errorResponse('Error al cerrar sesión', $e->getMessage());
        }
    }

    /**
     * Obtener usuario autenticado
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function me(Request $request): JsonResponse
    {
        try {
            $user = $request->user()->load([
                'carritos',
                'torneosOrganizados',
                'inscripcionesTorneos'
            ]);
            
            return $this->successResponse($user, 'Usuario autenticado');
            
        } catch (\Exception $e) {
            return $this->errorResponse('Error al obtener usuario', $e->getMessage());
        }
    }

    /**
     * Refrescar token
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function refresh(Request $request): JsonResponse
    {
        try {
            // Eliminar token actual
            $request->user()->currentAccessToken()->delete();
            
            // Crear nuevo token
            $token = $request->user()
                             ->createToken('auth-token', ['*'], now()->addDays(30))
                             ->plainTextToken;
            
            return $this->successResponse([
                'token' => $token,
                'token_type' => 'Bearer',
                'expires_in' => 2592000,
            ], 'Token refrescado exitosamente');
            
        } catch (\Exception $e) {
            return $this->errorResponse('Error al refrescar token', $e->getMessage());
        }
    }
}
```

---

### Form Requests de Autenticación

**Archivo**: `app/Http/Requests/RegisterRequest.php`

```php
<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'username' => [
                'required',
                'string',
                'max:255',
                'unique:users,username',
                'regex:/^[a-zA-Z0-9_]+$/', // Solo letras, números y guiones bajos
            ],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                'unique:users,email',
            ],
            'password' => [
                'required',
                'string',
                'confirmed',
                Password::min(8)
                    ->mixedCase()
                    ->numbers()
                    ->symbols()
                    ->uncompromised(),
            ],
            'nombre' => 'required|string|max:255',
            'apellido' => 'required|string|max:255',
            'pais' => 'required|string|max:100',
        ];
    }

    public function messages(): array
    {
        return [
            'username.required' => 'El nombre de usuario es obligatorio',
            'username.unique' => 'Este nombre de usuario ya está en uso',
            'username.regex' => 'El nombre de usuario solo puede contener letras, números y guiones bajos',
            'email.required' => 'El correo electrónico es obligatorio',
            'email.email' => 'El correo electrónico debe ser válido',
            'email.unique' => 'Este correo electrónico ya está registrado',
            'password.required' => 'La contraseña es obligatoria',
            'password.confirmed' => 'Las contraseñas no coinciden',
            'nombre.required' => 'El nombre es obligatorio',
            'apellido.required' => 'El apellido es obligatorio',
            'pais.required' => 'El país es obligatorio',
        ];
    }
}
```

**Archivo**: `app/Http/Requests/LoginRequest.php`

```php
<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class LoginRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'email' => 'required|email',
            'password' => 'required|string',
        ];
    }

    public function messages(): array
    {
        return [
            'email.required' => 'El correo electrónico es obligatorio',
            'email.email' => 'El correo electrónico debe ser válido',
            'password.required' => 'La contraseña es obligatoria',
        ];
    }
}
```

---

## 🛍️ SERVICES - CAPA DE NEGOCIO

### OrdenService Completo

**Archivo**: `app/Services/OrdenService.php`

```php
<?php

namespace App\Services;

use App\Events\OrdenCreada;
use App\Models\Carrito;
use App\Models\ItemOrden;
use App\Models\Orden;
use App\Models\Producto;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class OrdenService
{
    /**
     * Crear orden desde el carrito del usuario
     * 
     * @param int $userId
     * @param array $datosEnvio
     * @return Orden
     * @throws \Exception
     */
    public function crearDesdeCarrito(int $userId, array $datosEnvio): Orden
    {
        return DB::transaction(function () use ($userId, $datosEnvio) {
            
            // 1. Obtener carrito con items
            $carrito = Carrito::with('items.producto')
                ->where('id_usuario', $userId)
                ->firstOrFail();
            
            // 2. Validar que el carrito tenga items
            if ($carrito->items->isEmpty()) {
                throw new \Exception('El carrito está vacío');
            }
            
            // 3. Validar stock disponible
            $this->validarStock($carrito->items);
            
            // 4. Calcular totales
            $subtotal = $carrito->subtotal;
            $impuestos = $this->calcularImpuestos($subtotal);
            $costoEnvio = $this->calcularCostoEnvio($datosEnvio['pais'] ?? 'España');
            $descuento = $this->calcularDescuento($userId, $subtotal);
            $total = $subtotal + $impuestos + $costoEnvio - $descuento;
            
            // 5. Crear orden
            $orden = Orden::create([
                'id_usuario' => $userId,
                'id_direccion_envio' => $datosEnvio['id_direccion_envio'],
                'numero_orden' => $this->generarNumeroOrden(),
                'subtotal' => $subtotal,
                'impuestos' => $impuestos,
                'costo_envio' => $costoEnvio,
                'descuento' => $descuento,
                'total' => $total,
                'estado' => 'pendiente',
                'fecha_orden' => now(),
            ]);
            
            // 6. Crear items de la orden
            foreach ($carrito->items as $item) {
                $this->crearItemOrden($orden, $item);
                
                // Decrementar stock (si se implementa inventario)
                // $this->decrementarStock($item->id_producto, $item->cantidad);
            }
            
            // 7. Limpiar carrito
            $carrito->items()->delete();
            $carrito->delete();
            
            // 8. Log de evento
            Log::info('Orden creada', [
                'orden_id' => $orden->id,
                'user_id' => $userId,
                'total' => $total
            ]);
            
            // 9. Disparar evento
            event(new OrdenCreada($orden));
            
            // 10. Retornar orden con relaciones cargadas
            return $orden->load([
                'items.producto',
                'usuario',
                'direccionEnvio'
            ]);
        });
    }

    /**
     * Actualizar estado de la orden
     * 
     * @param Orden $orden
     * @param string $nuevoEstado
     * @param array $datosAdicionales
     * @return Orden
     */
    public function actualizarEstado(Orden $orden, string $nuevoEstado, array $datosAdicionales = []): Orden
    {
        $estadosValidos = ['pendiente', 'pagada', 'enviada_proveedor', 'en_transito', 'entregada', 'cancelada'];
        
        if (!in_array($nuevoEstado, $estadosValidos)) {
            throw new \Exception("Estado '{$nuevoEstado}' no es válido");
        }
        
        // Validar transiciones de estado
        $this->validarTransicionEstado($orden->estado, $nuevoEstado);
        
        $orden->update(array_merge([
            'estado' => $nuevoEstado,
            'fecha_actualizacion' => now(),
        ], $datosAdicionales));
        
        Log::info('Estado de orden actualizado', [
            'orden_id' => $orden->id,
            'estado_anterior' => $orden->getOriginal('estado'),
            'estado_nuevo' => $nuevoEstado
        ]);
        
        return $orden->fresh();
    }

    /**
     * Cancelar orden
     * 
     * @param Orden $orden
     * @param int $userId
     * @param string $razon
     * @return Orden
     */
    public function cancelarOrden(Orden $orden, int $userId, string $razon): Orden
    {
        if (!in_array($orden->estado, ['pendiente', 'pagada'])) {
            throw new \Exception('No se puede cancelar una orden en estado: ' . $orden->estado);
        }
        
        return DB::transaction(function () use ($orden, $userId, $razon) {
            $orden->update([
                'estado' => 'cancelada',
                'id_cancelado_por' => $userId,
                'fecha_cancelacion' => now(),
                'razon_cancelacion' => $razon,
            ]);
            
            // Restaurar stock (si se implementa inventario)
            foreach ($orden->items as $item) {
                // $this->incrementarStock($item->id_producto, $item->cantidad);
            }
            
            Log::info('Orden cancelada', [
                'orden_id' => $orden->id,
                'cancelado_por' => $userId,
                'razon' => $razon
            ]);
            
            return $orden;
        });
    }

    /**
     * Validar stock disponible
     * 
     * @param \Illuminate\Database\Eloquent\Collection $items
     * @throws \Exception
     */
    private function validarStock($items): void
    {
        foreach ($items as $item) {
            $producto = Producto::lockForUpdate()->find($item->id_producto);
            
            // Aquí iría la validación de stock si se implementa
            // if ($producto->stock < $item->cantidad) {
            //     throw new \Exception("Stock insuficiente para: {$producto->nombre}");
            // }
        }
    }

    /**
     * Crear item de orden
     * 
     * @param Orden $orden
     * @param mixed $itemCarrito
     * @return ItemOrden
     */
    private function crearItemOrden(Orden $orden, $itemCarrito): ItemOrden
    {
        return ItemOrden::create([
            'id_orden' => $orden->id,
            'id_producto' => $itemCarrito->id_producto,
            'id_variante' => $itemCarrito->id_variante,
            'id_proveedor' => $itemCarrito->producto->id_proveedor,
            'cantidad' => $itemCarrito->cantidad,
            'precio_unitario' => $itemCarrito->precio_unitario,
            'subtotal' => $itemCarrito->subtotal,
        ]);
    }

    /**
     * Generar número único de orden
     * 
     * @return string
     */
    private function generarNumeroOrden(): string
    {
        do {
            $numero = 'ORD-' . strtoupper(uniqid());
        } while (Orden::where('numero_orden', $numero)->exists());
        
        return $numero;
    }

    /**
     * Calcular impuestos
     * 
     * @param float $subtotal
     * @return float
     */
    private function calcularImpuestos(float $subtotal): float
    {
        // IVA 21% (configurable)
        $porcentajeIVA = config('app.iva_porcentaje', 21);
        return round($subtotal * ($porcentajeIVA / 100), 2);
    }

    /**
     * Calcular costo de envío
     * 
     * @param string $pais
     * @return float
     */
    private function calcularCostoEnvio(string $pais): float
    {
        // Tabla de costos por país (podría venir de BD)
        return match ($pais) {
            'España' => 5.99,
            'Portugal' => 7.99,
            'Francia' => 9.99,
            'Alemania' => 9.99,
            'Italia' => 9.99,
            default => 15.99,
        };
    }

    /**
     * Calcular descuento aplicable
     * 
     * @param int $userId
     * @param float $subtotal
     * @return float
     */
    private function calcularDescuento(int $userId, float $subtotal): float
    {
        // Aquí iría la lógica de cupones, descuentos, etc.
        return 0.00;
    }

    /**
     * Validar transición de estado
     * 
     * @param string $estadoActual
     * @param string $nuevoEstado
     * @throws \Exception
     */
    private function validarTransicionEstado(string $estadoActual, string $nuevoEstado): void
    {
        $transicionesPermitidas = [
            'pendiente' => ['pagada', 'cancelada'],
            'pagada' => ['enviada_proveedor', 'cancelada'],
            'enviada_proveedor' => ['en_transito'],
            'en_transito' => ['entregada'],
            'entregada' => [],
            'cancelada' => [],
        ];
        
        if (!in_array($nuevoEstado, $transicionesPermitidas[$estadoActual] ?? [])) {
            throw new \Exception(
                "Transición de estado no permitida: {$estadoActual} -> {$nuevoEstado}"
            );
        }
    }
}
```

---

## 🎮 SERVICES - TORNEO Y PARTIDA

### TorneoService

**Archivo**: `app/Services/TorneoService.php`

```php
<?php

namespace App\Services;

use App\Events\TorneoCreado;
use App\Models\Torneo;
use App\Models\InscripcionTorneo;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class TorneoService
{
    /**
     * Crear nuevo torneo
     * 
     * @param array $data
     * @param int $organizadorId
     * @return Torneo
     */
    public function crearTorneo(array $data, int $organizadorId): Torneo
    {
        return DB::transaction(function () use ($data, $organizadorId) {
            
            // Validar lógica de negocio
            $this->validarDatosTorneo($data);
            
            // Crear torneo
            $torneo = Torneo::create(array_merge($data, [
                'id_organizador' => $organizadorId,
                'verificado' => false, // Requiere aprobación de admin
                'estado' => 'inscripciones',
            ]));
            
            Log::info('Torneo creado', [
                'torneo_id' => $torneo->id,
                'organizador_id' => $organizadorId,
                'nombre' => $torneo->nombre
            ]);
            
            event(new TorneoCreado($torneo));
            
            return $torneo->load(['juego', 'organizador']);
        });
    }

    /**
     * Inscribir usuario a torneo
     * 
     * @param Torneo $torneo
     * @param int $userId
     * @return InscripcionTorneo
     */
    public function inscribirUsuario(Torneo $torneo, int $userId): InscripcionTorneo
    {
        return DB::transaction(function () use ($torneo, $userId) {
            
            // Validaciones
            $this->validarInscripcion($torneo, $userId);
            
            // Crear inscripción
            $inscripcion = InscripcionTorneo::create([
                'id_torneo' => $torneo->id,
                'id_usuario' => $userId,
                'fecha_inscripcion' => now(),
                'monto_pagado' => $torneo->cuota_inscripcion,
                'confirmado' => !$torneo->es_gratuito, // Si es de pago, requiere confirmación
                'posicion_final' => null,
                'premio_ganado' => 0,
            ]);
            
            Log::info('Usuario inscrito a torneo', [
                'torneo_id' => $torneo->id,
                'usuario_id' => $userId
            ]);
            
            return $inscripcion;
        });
    }

    /**
     * Validar datos del torneo
     * 
     * @param array $data
     * @throws \Exception
     */
    private function validarDatosTorneo(array $data): void
    {
        // Validar que si no es gratuito, tenga premio
        if (!$data['es_gratuito'] && $data['premio_total'] <= 0) {
            throw new \Exception('Un torneo de pago debe tener premio mayor a 0');
        }
        
        // Validar comisión
        $comisionMonto = ($data['premio_total'] * $data['comision_plataforma_porcentaje']) / 100;
        if ($comisionMonto >= $data['premio_total']) {
            throw new \Exception('La comisión no puede ser mayor o igual al premio total');
        }
        
        // Validar fechas
        if ($data['fecha_fin'] <= $data['fecha_inicio']) {
            throw new \Exception('La fecha de fin debe ser posterior a la de inicio');
        }
        
        if ($data['cierre_inscripciones'] >= $data['fecha_inicio']) {
            throw new \Exception('El cierre de inscripciones debe ser antes del inicio del torneo');
        }
    }

    /**
     * Validar inscripción al torneo
     * 
     * @param Torneo $torneo
     * @param int $userId
     * @throws \Exception
     */
    private function validarInscripcion(Torneo $torneo, int $userId): void
    {
        // Validar estado del torneo
        if ($torneo->estado !== 'inscripciones') {
            throw new \Exception('El torneo no está en periodo de inscripciones');
        }
        
        // Validar cierre de inscripciones
        if (now() > $torneo->cierre_inscripciones) {
            throw new \Exception('El periodo de inscripciones ha cerrado');
        }
        
        // Validar inscripción duplicada
        $yaInscrito = InscripcionTorneo::where('id_torneo', $torneo->id)
            ->where('id_usuario', $userId)
            ->exists();
        
        if ($yaInscrito) {
            throw new \Exception('Ya estás inscrito en este torneo');
        }
        
        // Validar cupos
        $inscritos = InscripcionTorneo::where('id_torneo', $torneo->id)->count();
        if ($inscritos >= $torneo->max_participantes) {
            throw new \Exception('El torneo está lleno');
        }
        
        // Validar saldo (si es de pago)
        // TODO: Implementar cuando exista sistema de wallet
    }
}
```

---

## 📦 CONTROLADORES OPTIMIZADOS

### ProductoController Refactorizado

```php
<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProductoRequest;
use App\Http\Requests\UpdateProductoRequest;
use App\Models\Producto;
use App\Services\ProductoService;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;

class ProductoController extends Controller
{
    use ApiResponseTrait;

    public function __construct(
        private ProductoService $productoService
    ) {}

    /**
     * Listar productos con filtros opcionales
     */
    public function index(): JsonResponse
    {
        try {
            $productos = Producto::query()
                ->with(['categoria', 'proveedor', 'imagenes'])
                ->when(request('categoria_id'), function ($query, $categoriaId) {
                    $query->where('id_categoria', $categoriaId);
                })
                ->when(request('destacado'), function ($query) {
                    $query->where('destacado', true);
                })
                ->when(request('search'), function ($query, $search) {
                    $query->where('nombre', 'LIKE', "%{$search}%")
                          ->orWhere('descripcion', 'LIKE', "%{$search}%");
                })
                ->where('activo', true)
                ->orderBy('ventas_totales', 'desc')
                ->paginate(20);
            
            return $this->successResponse($productos, 'Productos obtenidos correctamente');
            
        } catch (\Exception $e) {
            return $this->errorResponse('Error al obtener productos', $e->getMessage());
        }
    }

    /**
     * Crear producto (solo admin)
     */
    public function store(StoreProductoRequest $request): JsonResponse
    {
        try {
            $producto = $this->productoService->crear($request->validated());
            
            return $this->successResponse($producto, 'Producto creado correctamente', 201);
            
        } catch (\Exception $e) {
            return $this->errorResponse('Error al crear producto', $e->getMessage());
        }
    }

    /**
     * Mostrar producto específico
     */
    public function show(string $id): JsonResponse
    {
        try {
            $producto = Producto::with([
                'categoria',
                'proveedor',
                'imagenes',
                'variantes',
                'reviews.usuario'
            ])->findOrFail($id);
            
            return $this->successResponse($producto, 'Producto obtenido correctamente');
            
        } catch (\Exception $e) {
            return $this->notFoundResponse('Producto no encontrado');
        }
    }

    /**
     * Actualizar producto (solo admin)
     */
    public function update(UpdateProductoRequest $request, string $id): JsonResponse
    {
        try {
            $producto = Producto::findOrFail($id);
            $productoActualizado = $this->productoService->actualizar($producto, $request->validated());
            
            return $this->successResponse($productoActualizado, 'Producto actualizado correctamente');
            
        } catch (\Exception $e) {
            return $this->errorResponse('Error al actualizar producto', $e->getMessage());
        }
    }

    /**
     * Eliminar producto (soft delete)
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $producto = Producto::findOrFail($id);
            $producto->update(['activo' => false]);
            
            return $this->successResponse(null, 'Producto desactivado correctamente');
            
        } catch (\Exception $e) {
            return $this->errorResponse('Error al eliminar producto', $e->getMessage());
        }
    }
}
```

---

## 🧪 TESTS COMPLETOS

### ProductoTest

**Archivo**: `tests/Feature/Api/ProductoTest.php`

```php
<?php

namespace Tests\Feature\Api;

use App\Models\Categoria;
use App\Models\Producto;
use App\Models\Proveedor;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductoTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Seed básico
        $this->artisan('migrate:fresh');
    }

    public function test_puede_listar_productos_publicamente()
    {
        Producto::factory()->count(10)->create(['activo' => true]);
        Producto::factory()->count(3)->create(['activo' => false]); // No deberían aparecer

        $response = $this->getJson('/api/v1/productos');

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'success',
                     'data' => [
                         'data' => [
                             '*' => [
                                 'id',
                                 'nombre',
                                 'precio_venta',
                                 'categoria',
                                 'proveedor'
                             ]
                         ]
                     ],
                     'message'
                 ])
                 ->assertJsonCount(10, 'data.data');
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
                             'descripcion' => 'Descripción del producto test',
                             'precio_proveedor' => 10.00,
                             'precio_venta' => 15.00,
                         ]);

        $response->assertStatus(201)
                 ->assertJsonStructure([
                     'success',
                     'data' => ['id', 'nombre', 'slug'],
                     'message'
                 ]);

        $this->assertDatabaseHas('productos', [
            'nombre' => 'Producto Test',
            'slug' => 'producto-test',
        ]);
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

    public function test_sin_autenticacion_no_puede_crear_producto()
    {
        $response = $this->postJson('/api/v1/admin/productos', [
            'nombre' => 'Producto Test',
        ]);

        $response->assertStatus(401);
    }

    public function test_puede_obtener_producto_por_id()
    {
        $producto = Producto::factory()->create();

        $response = $this->getJson("/api/v1/productos/{$producto->id}");

        $response->assertStatus(200)
                 ->assertJson([
                     'success' => true,
                     'data' => [
                         'id' => $producto->id,
                         'nombre' => $producto->nombre,
                     ]
                 ]);
    }

    public function test_retorna_404_si_producto_no_existe()
    {
        $response = $this->getJson('/api/v1/productos/99999');

        $response->assertStatus(404);
    }

    public function test_puede_filtrar_productos_por_categoria()
    {
        $categoria1 = Categoria::factory()->create();
        $categoria2 = Categoria::factory()->create();

        Producto::factory()->count(5)->create(['id_categoria' => $categoria1->id]);
        Producto::factory()->count(3)->create(['id_categoria' => $categoria2->id]);

        $response = $this->getJson("/api/v1/productos?categoria_id={$categoria1->id}");

        $response->assertStatus(200)
                 ->assertJsonCount(5, 'data.data');
    }

    public function test_admin_puede_actualizar_producto()
    {
        $admin = User::factory()->admin()->create();
        $producto = Producto::factory()->create(['nombre' => 'Nombre Original']);

        $response = $this->actingAs($admin, 'sanctum')
                         ->putJson("/api/v1/admin/productos/{$producto->id}", [
                             'nombre' => 'Nombre Actualizado',
                         ]);

        $response->assertStatus(200);
        
        $this->assertDatabaseHas('productos', [
            'id' => $producto->id,
            'nombre' => 'Nombre Actualizado',
        ]);
    }

    public function test_admin_puede_desactivar_producto()
    {
        $admin = User::factory()->admin()->create();
        $producto = Producto::factory()->create(['activo' => true]);

        $response = $this->actingAs($admin, 'sanctum')
                         ->deleteJson("/api/v1/admin/productos/{$producto->id}");

        $response->assertStatus(200);
        
        $this->assertDatabaseHas('productos', [
            'id' => $producto->id,
            'activo' => false,
        ]);
    }
}
```

---

## 🏭 FACTORIES

### Configurar Factories para Testing

**Archivo**: `database/factories/UserFactory.php`

```php
<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserFactory extends Factory
{
    protected static ?string $password;

    public function definition(): array
    {
        return [
            'username' => fake()->unique()->userName(),
            'email' => fake()->unique()->safeEmail(),
            'password' => static::$password ??= Hash::make('password'),
            'nombre' => fake()->firstName(),
            'apellido' => fake()->lastName(),
            'pais' => fake()->country(),
            'rol' => 'player',
            'verificado' => true,
            'activo' => true,
            'fecha_registro' => now(),
            'ultima_conexion' => now(),
        ];
    }

    /**
     * Estado: Usuario administrador
     */
    public function admin(): static
    {
        return $this->state(fn (array $attributes) => [
            'rol' => 'admin',
        ]);
    }

    /**
     * Estado: Usuario streamer
     */
    public function streamer(): static
    {
        return $this->state(fn (array $attributes) => [
            'rol' => 'streamer',
        ]);
    }

    /**
     * Estado: Usuario no verificado
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'verificado' => false,
        ]);
    }

    /**
     * Estado: Usuario inactivo
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'activo' => false,
        ]);
    }
}
```

---

Este documento proporciona ejemplos completos y funcionales de las correcciones más importantes. ¿Quieres que continúe con más ejemplos o que profundice en algún aspecto específico?
