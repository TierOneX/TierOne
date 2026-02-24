# 📘 Guía: Implementar Middleware de Roles - Laravel

**Objetivo:** Proteger rutas según el rol del usuario (admin, staff, player)

**Tiempo estimado:** 30-45 minutos

---

## 🎯 Paso 1: Crear el Middleware

### 1.1 Ejecuta el comando Artisan

```bash
cd TierOne
php artisan make:middleware CheckRole
```

**📍 Resultado:** Se crea el archivo en:
`TierOne/app/Http/Middleware/CheckRole.php`

---

## ✍️ Paso 2: Implementar la Lógica

### 2.1 Abre el archivo creado

**Ruta:** `TierOne/app/Http/Middleware/CheckRole.php`

### 2.2 Reemplaza el contenido con esto:

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string  ...$roles  // Lista de roles permitidos
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        // 1. Verificar que el usuario está autenticado
        if (!$request->user()) {
            return response()->json([
                'error' => 'No autenticado'
            ], 401);
        }

        // 2. Verificar que el usuario tiene uno de los roles permitidos
        if (!in_array($request->user()->rol, $roles)) {
            return response()->json([
                'error' => 'No autorizado. Requiere rol: ' . implode(' o ', $roles)
            ], 403);
        }

        // 3. Si pasa las validaciones, continúa con la petición
        return $next($request);
    }
}
```

### 📖 Explicación línea por línea:

- **Línea 13:** `...$roles` acepta múltiples roles: `'admin', 'staff'`
- **Línea 16-20:** Verifica si hay usuario autenticado (token válido)
- **Línea 23-27:** Comprueba si el rol del usuario está en la lista permitida
- **Línea 30:** Si todo OK, deja pasar la petición

---

## 🔧 Paso 3: Registrar el Middleware

### 3.1 Abre el archivo de configuración

**Ruta:** `TierOne/app/Http/Kernel.php` (Laravel 10)
**O:** `TierOne/bootstrap/app.php` (Laravel 11)

<details>
<summary>👉 Para Laravel 10 (Kernel.php)</summary>

### 3.2 Busca la propiedad `$middlewareAliases`

```php
protected $middlewareAliases = [
    'auth' => \App\Http\Middleware\Authenticate::class,
    'auth.basic' => \Illuminate\Auth\Middleware\AuthenticateWithBasicAuth::class,
    // ... otros middlewares
];
```

### 3.3 Agrega tu middleware al final:

```php
protected $middlewareAliases = [
    'auth' => \App\Http\Middleware\Authenticate::class,
    'auth.basic' => \Illuminate\Auth\Middleware\AuthenticateWithBasicAuth::class,
    // ... otros middlewares
    
    // ✅ AGREGAR ESTA LÍNEA
    'role' => \App\Http\Middleware\CheckRole::class,
];
```

</details>

<details>
<summary>👉 Para Laravel 11 (bootstrap/app.php)</summary>

### 3.2 Busca `withMiddleware()`

```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->web(append: [
        \App\Http\Middleware\HandleInertiaRequests::class,
    ]);
})
```

### 3.3 Agrega el alias:

```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->web(append: [
        \App\Http\Middleware\HandleInertiaRequests::class,
    ]);
    
    // ✅ AGREGAR ESTAS LÍNEAS
    $middleware->alias([
        'role' => \App\Http\Middleware\CheckRole::class,
    ]);
})
```

</details>

---

## 🛣️ Paso 4: Aplicar a las Rutas

### 4.1 Abre el archivo de rutas API

**Ruta:** `TierOne/routes/api.php`

### 4.2 Modifica las rutas protegidas

**ANTES:**
```php
Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('users', UserController::class);
    Route::apiResource('proveedores', ProveedorController::class);
});
```

**DESPUÉS:**
```php
Route::middleware('auth:sanctum')->group(function () {
    
    // ===================================
    // ADMIN ONLY - Gestión de usuarios y proveedores
    // ===================================
    Route::middleware('role:admin')->group(function () {
        Route::apiResource('users', UserController::class);
        Route::apiResource('proveedores', ProveedorController::class);
    });
    
    // ===================================
    // ADMIN O STAFF - Gestión de catálogo
    // ===================================
    Route::middleware('role:admin,staff')->group(function () {
        Route::apiResource('categorias', CategoriaController::class)
            ->except(['index', 'show']); // index y show son públicas
        Route::apiResource('productos', ProductoController::class)
            ->except(['index', 'show']);
        Route::apiResource('juegos', JuegoController::class)
            ->except(['index', 'show']);
    });
    
    // ===================================
    // TODOS LOS USUARIOS AUTENTICADOS
    // ===================================
    Route::apiResource('carritos', CarritoController::class);
    Route::apiResource('ordenes', OrdenController::class);
    Route::apiResource('direcciones-envio', DireccionEnvioController::class);
    Route::apiResource('reviews', ReviewController::class);
    
    // Torneos - cualquiera puede inscribirse
    Route::apiResource('torneos', TorneoController::class);
    Route::apiResource('inscripciones-torneo', InscripcionTorneoController::class);
});
```

### 📖 Explicación:

- `role:admin` → Solo administradores
- `role:admin,staff` → Administradores O staff
- Sin `role:` → Cualquier usuario autenticado

---

## 🧪 Paso 5: Probar el Middleware

### 5.1 Verifica que tu modelo User tiene el campo `rol`

**Abre:** `TierOne/app/Models/User.php`

**Busca:**
```php
protected $fillable = [
    'name',
    'email',
    'password',
    'rol', // ✅ Debe estar aquí
];
```

### 5.2 Prueba con Postman/Thunder Client

#### Test 1: Sin autenticación
```http
GET http://localhost:8000/api/users
```

**Resultado esperado:** ❌ `401 Unauthorized`

---

#### Test 2: Con token pero rol incorrecto

1. Login como usuario normal:
```http
POST http://localhost:8000/api/login
Content-Type: application/json

{
  "email": "player@test.com",
  "password": "password"
}
```

2. Intenta acceder a ruta de admin:
```http
GET http://localhost:8000/api/users
Authorization: Bearer {tu_token}
```

**Resultado esperado:** ❌ `403 Forbidden`
```json
{
  "error": "No autorizado. Requiere rol: admin"
}
```

---

#### Test 3: Con token de admin

1. Login como admin:
```http
POST http://localhost:8000/api/login
Content-Type: application/json

{
  "email": "admin@test.com",
  "password": "password"
}
```

2. Accede a ruta de admin:
```http
GET http://localhost:8000/api/users
Authorization: Bearer {token_admin}
```

**Resultado esperado:** ✅ `200 OK` con lista de usuarios

---

## 🔍 Paso 6: Crear Usuarios de Prueba

### 6.1 Usando Tinker (recomendado)

```bash
php artisan tinker
```

```php
// Crear admin
User::create([
    'username' => 'admin',
    'email' => 'admin@test.com',
    'password' => bcrypt('password'),
    'rol' => 'admin',
    'nombre' => 'Admin',
    'apellido' => 'Test'
]);

// Crear staff
User::create([
    'username' => 'staff',
    'email' => 'staff@test.com',
    'password' => bcrypt('password'),
    'rol' => 'staff',
    'nombre' => 'Staff',
    'apellido' => 'Test'
]);

// Crear player
User::create([
    'username' => 'player',
    'email' => 'player@test.com',
    'password' => bcrypt('password'),
    'rol' => 'player',
    'nombre' => 'Player',
    'apellido' => 'Test'
]);
```

---

## ✅ Checklist de Verificación

- [ ] Middleware `CheckRole.php` creado
- [ ] Middleware registrado en `Kernel.php` o `bootstrap/app.php`
- [ ] Rutas de admin protegidas con `role:admin`
- [ ] Rutas de staff protegidas con `role:admin,staff`
- [ ] Usuarios de prueba creados (admin, staff, player)
- [ ] Probado con Postman: admin ✅ accede, player ❌ no accede

---

## 🐛 Troubleshooting

### Problema 1: "Class 'CheckRole' not found"

**Solución:**
```bash
composer dump-autoload
```

---

### Problema 2: "Undefined property: rol"

**Solución:** Asegúrate que la tabla `users` tiene la columna `rol`:

```bash
php artisan migrate:fresh
```

---

### Problema 3: "Siempre devuelve 401"

**Solución:** Verifica que el token de Sanctum está en el header:
```
Authorization: Bearer {tu_token_aqui}
```

---

## 🎓 Conceptos Aprendidos

✅ Crear middleware custom en Laravel  
✅ Registrar middleware con alias  
✅ Aplicar middleware a grupos de rutas  
✅ Pasar parámetros a middleware (`...$roles`)  
✅ Autorización basada en roles  
✅ Diferencia entre autenticación (401) y autorización (403)

---

## 🚀 Siguiente Paso

Una vez funcione el middleware, continúa con:
1. **Form Requests** faltantes
2. **Factories** para testing
3. **Unit Tests** del middleware

---

**¿Tienes alguna duda antes de empezar?** 🤔
