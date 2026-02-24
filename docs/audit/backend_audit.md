# 🔍 Auditoría Backend TierOne

**Fecha:** 16 Febrero 2026  
**Estado:** Backend parcialmente implementado (~60% completo)

---

##📊 Estado Actual

### ✅ Implementado

#### 1. **Modelos** (26/26 - 100%)
- ✅ 26 modelos creados y con relaciones
- ✅ Todos tienen `$casts` para type casting
- ❌ **NINGUNO** tiene Accessors o Mutators

#### 2. **Controladores** (15/15 - 100%)
- ✅ `CategoriaController`
- ✅ `ProductoController`
- ✅ `ProveedorController`
- ✅ `JuegoController`
- ✅ `UserController`
- ✅ `TorneoController`
- ✅ `OrdenController`
- ✅ `PartidaController`
- ✅ `CarritoController`
- ✅ `DireccionEnvioController`
- ✅ `InscripcionTorneoController`
- ✅ `ReviewController`
- ✅ `ReporteController`
- ✅ `ProfileController`
- ✅ Carpeta `Auth/` (9 controladores de autenticación)

#### 3. **Rutas API** (~90%)
- ✅ Rutas públicas (5)
- ✅ `Route::apiResource()` para todos los controladores
- ✅ Auth:Sanctum middleware aplicado
- ⚠️ **FALTA**: Middleware de roles (admin, staff, player)

#### 4. **Form Requests** (10/~30 - 33%)

**Existentes:**
- ✅ `StoreCategoriaRequest`
- ✅ `UpdateCategoriaRequest`
- ✅ `StoreJuegoRequest`
- ✅ `UpdateJuegoRequest`
- ✅ `StoreProveedorRequest`
- ✅ `UpdateProveedorRequest`
- ✅ `StoreUserRequest`
- ✅ `UpdateUserRequest`
- ✅ `ProfileUpdateRequest`
- ✅ `LoginRequest`

**Faltantes (20+):**
- ❌ `StoreProductoRequest`
- ❌ `UpdateProductoRequest`
- ❌ `StoreTorneoRequest`
- ❌ `UpdateTorneoRequest`
- ❌ `StoreOrdenRequest`
- ❌ `UpdateOrdenRequest`
- ❌ `StorePartidaRequest`
- ❌ `UpdatePartidaRequest`
- ❌ `StoreCarritoRequest`
- ❌ `UpdateCarritoRequest`
- ❌ `StoreDireccionEnvioRequest`
- ❌ `UpdateDireccionEnvioRequest`
- ❌ `StoreInscripcionTorneoRequest`
- ❌ `UpdateInscripcionTorneoRequest`
- ❌ `StoreReviewRequest`
- ❌ `UpdateReviewRequest`
- ❌ `StoreReporteRequest`
- ❌ `UpdateReporteRequest`
- ❌ Plus otros para modelos relacionados

#### 5. **Middleware** (1/~5 - 20%)

**Existente:**
- ✅ `HandleInertiaRequests` (NO SE USA - ver sección Inertia)

**Faltantes:**
- ❌ `CheckRole` (verificar roles: admin, staff, player)
- ❌ `CheckTorneoOwner` (solo creador puede modificar torneo)
- ❌ `CheckOrdenOwner` (solo dueño puede ver su orden)
- ❌ `ThrottleApi` (rate limiting personalizado)
- ❌ `VerifyEmailMiddleware` (si queremos verificación de email)

#### 6. **Factories** (2/26 - 8%)

**Existentes:**
- ✅ `JuegoFactory`
- ✅ `UserFactory`

**Faltantes (24):**
- ❌ Categoría, Producto, Proveedor
- ❌ Torneo, Partida, InscripcionTorneo
- ❌ Orden, ItemOrden, Carrito, ItemCarrito
- ❌ DireccionEnvio, Pago, Transaccion, Retiro
- ❌ Review, Reporte
- ❌ Y 8 modelos más

#### 7. **Accessors & Mutators** (0/26 - 0%)
- ❌ **NINGÚN** modelo tiene Accessors
- ❌ **NINGÚN** modelo tiene Mutators

**Ejemplos de lo que falta:**

```php
// User.php
protected function password(): Attribute {
    return Attribute::make(
        set: fn ($value) => bcrypt($value), // Mutator
    );
}

// Producto.php
protected function precioFormateado(): Attribute {
    return Attribute::make(
        get: fn () => '$' . number_format($this->precio, 2), // Accessor
    );
}

// Torneo.php
protected function fechaInicioBonita(): Attribute {
    return Attribute::make(
        get: fn () => $this->fecha_inicio->format('d/m/Y H:i'),
    );
}
```

---

## 🤔 Decisión: ¿Por Qué NO Usar Inertia?

### Contexto Actual
- ✅ Tienes `HandleInertiaRequests` middleware
- ✅ Laravel ya está configurado como API
- ❌ **NO** tienes Inertia instalado ni configurado
- ❌ **NO** tienes componentes React con Inertia

### ¿Qué es Inertia?

**Inertia.js** permite crear SPA (Single Page Applications) usando componentes del lado del servidor (Laravel) + React/Vue sin necesidad de construir una API REST.

**Flujo con Inertia:**
```
Laravel Controller → Inertia::render('Component') → React Component
```

**Flujo API puro (tu enfoque actual):**
```
React App → fetch('/api/...') → Laravel API Controller → JSON
```

### 🎯 Recomendación: **NO USAR INERTIA**

**Razones:**

1. ✅ **Ya tienes una API REST completa**
   - 15 controladores API con `apiResource`
   - Sanctum para autenticación
   - Respuestas JSON estandarizadas

2. ✅ **Separación clara Frontend/Backend**
   - Permite desplegar independientemente
   - Facilita escalabilidad
   - Mejor para equipos separados

3. ✅ **Flexibilidad futura**
   - Podrías crear app móvil usando la misma API
   - Múltiples frontends (web, mobile, desktop)

4. ❌ **Cambiar a Inertia sería redundante**
   - Tendrías que refactorizar todos los controladores
   - Eliminar rutas API y crear rutas web
   - Reconstruir authenticación

### Acción Recomendada

**Eliminar `HandleInertiaRequests.php`** - No se usa y causa confusión.

---

## 📋 Plan de Implementación Priorizado

### **Prioridad ALTA** 🔴

#### 1. Middleware de Roles (CRÍTICO)
```php
// app/Http/Middleware/CheckRole.php
public function handle($request, Closure $next, ...$roles) {
    if (!in_array($request->user()->rol, $roles)) {
        abort(403, 'No autorizado');
    }
    return $next($request);
}
```

**Aplicar en rutas:**
```php
Route::middleware(['auth:sanctum', 'role:admin'])->group(function() {
    Route::apiResource('users', UserController::class);
    Route::apiResource('proveedores', ProveedorController::class);
});
```

#### 2. Form Requests Faltantes (TOP 10)
1. `StoreProductoRequest` / `UpdateProductoRequest`
2. `StoreTorneoRequest` / `UpdateTorneoRequest`
3. `StoreOrdenRequest` / `UpdateOrdenRequest`
4. `StorePartidaRequest` / `UpdatePartidaRequest`
5. `StoreReviewRequest` / `UpdateReviewRequest`

**Implementar primero** los más usados en la lógica de negocio.

---

### **Prioridad MEDIA** 🟡

#### 3. Factories para Testing (TOP 10)
1. `ProductoFactory` - E-commerce
2. `CategoriaFactory` - Catálogo
3. `TorneoFactory` - Torneos
4. `OrdenFactory` - E-commerce
5. `CarritoFactory` - E-commerce
6. `PartidaFactory` - Torneos
7. `InscripcionTorneoFactory` - Torneos
8. `ReviewFactory` - E-commerce
9. `ProveedorFactory` - Admin
10. `DireccionEnvioFactory` - E-commerce

#### 4. Accessors/Mutators (TOP 5 modelos)

**User:**
```php
protected function password(): Attribute {
    return Attribute::make(
        set: fn ($value) => bcrypt($value),
    );
}

protected function nombreCompleto(): Attribute {
    return Attribute::make(
        get: fn () => "{$this->nombre} {$this->apellido}",
    );
}
```

**Producto:**
```php
protected function precioFormateado(): Attribute {
    return Attribute::make(
        get: fn () => '$' . number_format($this->precio, 2),
    );
}

protected function enStock(): Attribute {
    return Attribute::make(
        get: fn () => $this->stock > 0,
    );
}
```

**Torneo:**
```php
protected function estaActivo(): Attribute {
    return Attribute::make(
        get: fn () => $this->activo && now()->between(
            $this->fecha_inicio, 
            $this->fecha_fin
        ),
    );
}
```

**Orden:**
```php
protected function totalFormateado(): Attribute {
    return Attribute::make(
        get: fn () => '$' . number_format($this->total, 2),
    );
}
```

**Review:**
```php
protected function esReciente(): Attribute {
    return Attribute::make(
        get: fn () => $this->created_at->diffInDays() < 7,
    );
}
```

---

### **Prioridad BAJA** 🟢

#### 5. Middleware Adicional
- `CheckTorneoOwner`
- `CheckOrdenOwner`
- `ThrottleApi` (rate limiting)

#### 6. Form Requests Restantes
- DireccionEnvio, Inscripción, Reporte, etc.

#### 7. Factories Restantes
- Modelos menos usados (Pago, Transaccion, etc.)

---

## 📈 Resumen de Completitud

| Componente | Estado | Completado | Prioridad |
|------------|--------|------------|-----------|
| **Modelos** | ✅ Completo | 26/26 (100%) | - |
| **Controladores** | ✅ Completo | 15/15 (100%) | - |
| **Rutas API** | ⚠️ Funcional | ~90% | ALTA (middleware) |
| **Form Requests** | ❌ Incompleto | 10/30 (33%) | ALTA |
| **Middleware** | ❌ Crítico | 1/5 (20%) | **CRÍTICA** |
| **Factories** | ❌ Mínimo | 2/26 (8%) | MEDIA |
| **Accessors/Mutators** | ❌ Ninguno | 0/26 (0%) | MEDIA |
| **Tests** | ❓ Desconocido | ? | MEDIA |

**Progreso Total:** ~60% completo

---

## 🎯 Recomendación Final

### Fase 1 - Seguridad (URGENTE)
1. ✅ Crear middleware `CheckRole`
2. ✅ Aplicar a rutas sensibles (admin, staff only)
3. ✅ Implementar `CheckOrdenOwner`, `CheckTorneoOwner`

### Fase 2 - Validación (ALTA)
1. ✅ Crear top 10 Form Requests faltantes
2. ✅ Refactorizar controladores para usarlos

### Fase 3 - Testing (MEDIA)
1. ✅ Crear top 10 Factories
2. ✅ Implementar Seeders
3. ✅ Escribir Feature Tests

### Fase 4 - Mejoras (BAJA)
1. ✅ Agregar Accessors/Mutators a top 5 modelos
2. ✅ Completar Factories restantes
3. ✅ Agregar Form Requests restantes

---

**Siguiente paso recomendado:** Crear middleware `CheckRole` y aplicarlo a rutas sensibles.
