# 🔄 Flujo Completo del Backend en Laravel

## 📊 Diagrama Visual del Flujo

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENTE (Frontend/Postman)                │
└─────────────────────┬───────────────────────────────────────┘
                      │ HTTP Request (GET, POST, PUT, DELETE)
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  1️⃣  RUTAS (routes/api.php)                                │
│     Route::apiResource('proveedores', ProveedorController)   │
│     ├─ GET    /api/proveedores      → index()               │
│     ├─ POST   /api/proveedores      → store()               │
│     ├─ GET    /api/proveedores/{id} → show()                │
│     ├─ PUT    /api/proveedores/{id} → update()              │
│     └─ DELETE /api/proveedores/{id} → destroy()             │
└─────────────────────┬───────────────────────────────────────┘
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  2️⃣  CONTROLADOR (app/Http/Controllers/ProveedorController)│
│     ┌──────────────────────────────────────────────┐        │
│     │ public function store(Request $request)      │        │
│     │ {                                             │        │
│     │     // 1. Validar datos                      │        │
│     │     $validated = $request->validate([...])   │        │
│     │                                               │        │
│     │     // 2. Interactuar con el Modelo          │        │
│     │     $proveedor = Proveedor::create(...)      │        │
│     │                                               │        │
│     │     // 3. Devolver respuesta JSON            │        │
│     │     return $this->successResponse(...)       │        │
│     │ }                                             │        │
│     └──────────────────────────────────────────────┘        │
└─────────────────────┬───────────────────────────────────────┘
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  3️⃣  MODELO (app/Models/Proveedor.php)                     │
│     ┌──────────────────────────────────────────────┐        │
│     │ - Define la tabla asociada                   │        │
│     │ - Define $fillable (campos permitidos)       │        │
│     │ - Define $casts (conversión de tipos)        │        │
│     │ - Define relaciones con otros modelos        │        │
│     └──────────────────────────────────────────────┘        │
│     Métodos principales:                                     │
│     ├─ ::all()            → Obtener todos                   │
│     ├─ ::find($id)        → Buscar por ID                   │
│     ├─ ::findOrFail($id)  → Buscar o lanzar excepción       │
│     ├─ ::create([...])    → Crear registro                  │
│     ├─ ->update([...])    → Actualizar registro             │
│     └─ ->delete()         → Eliminar registro               │
└─────────────────────┬───────────────────────────────────────┘
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  4️⃣  BASE DE DATOS (MySQL - tierone_db)                    │
│     Tabla: proveedores                                       │
│     ┌────┬─────────┬────────────────┬───────┬──────────┐   │
│     │ id │ nombre  │ contacto_nombre│ email │  activo  │   │
│     ├────┼─────────┼────────────────┼───────┼──────────┤   │
│     │ 1  │ Acme    │ Juan Pérez     │ ...   │   true   │   │
│     │ 2  │ TechCo  │ María López    │ ...   │   true   │   │
│     └────┴─────────┴────────────────┴───────┴──────────┘   │
└─────────────────────┬───────────────────────────────────────┘
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  5️⃣  RESPUESTA JSON (al Cliente)                           │
│     {                                                        │
│       "success": true,                                       │
│       "data": { "id": 1, "nombre": "Acme", ... },           │
│       "message": "Proveedor creado correctamente"           │
│     }                                                        │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔢 Los 8 Pasos del Backend (Orden de Implementación)

### **Paso 1: Migración** 📋
📂 `database/migrations/2026_01_26_create_proveedores_table.php`

**¿Qué hace?**
- Define la **estructura de la tabla** en la base de datos
- Especifica columnas, tipos, restricciones, índices

**Comando:**
```bash
php artisan make:migration create_proveedores_table
php artisan migrate
```

**Ejemplo:**
```php
$table->id();
$table->string('nombre', 100);
$table->string('email', 100)->unique();
$table->boolean('activo')->default(true);
```

---

### **Paso 2: Modelo** 🎯
📂 `app/Models/Proveedor.php`

**¿Qué hace?**
- Representa la **tabla** como una clase PHP
- Define qué campos son **mass-assignable** (`$fillable`)
- Define **conversiones de tipo** (`$casts`)
- Define **relaciones** con otros modelos

**Comando:**
```bash
php artisan make:model Proveedor
```

**Configuración clave:**
```php
protected $fillable = ['nombre', 'email', 'activo'];
protected $casts = ['activo' => 'boolean'];
public $timestamps = false;
```

---

### **Paso 3: Controlador** 🎮
📂 `app/Http/Controllers/ProveedorController.php`

**¿Qué hace?**
- Maneja la **lógica de negocio**
- Valida datos del request
- Interactúa con el Modelo
- Devuelve respuestas JSON

**Comando:**
```bash
php artisan make:controller ProveedorController --resource
```

**5 Métodos principales:**
```php
index()   → GET    /api/proveedores      (Listar todos)
store()   → POST   /api/proveedores      (Crear)
show($id) → GET    /api/proveedores/{id} (Ver uno)
update()  → PUT    /api/proveedores/{id} (Actualizar)
destroy() → DELETE /api/proveedores/{id} (Eliminar)
```

---

### **Paso 4: Rutas** 🛤️
📂 `routes/api.php`

**¿Qué hace?**
- Mapea **URLs** a **métodos del controlador**
- Define qué endpoint llama a qué función

**Configuración:**
```php
Route::apiResource('proveedores', ProveedorController::class);
```

Esto genera automáticamente:
- `GET    /api/proveedores`      → `index()`
- `POST   /api/proveedores`      → `store()`
- `GET    /api/proveedores/{id}` → `show($id)`
- `PUT    /api/proveedores/{id}` → `update($id)`
- `DELETE /api/proveedores/{id}` → `destroy($id)`

---

### **Paso 5: Validaciones** ✅
📂 Dentro de cada método del controlador

**¿Qué hace?**
- Verifica que los datos sean **correctos** antes de guardarlos
- Devuelve errores claros si algo falla

**Ejemplo:**
```php
$validated = $request->validate([
    'nombre' => 'required|string|max:100',
    'email' => 'required|email|unique:proveedores,email',
]);
```

---

### **Paso 6: Seeders** 🌱
📂 `database/seeders/ProveedorSeeder.php`

**¿Qué hace?**
- Inserta **datos de prueba** en la BD
- Permite probar la API sin crear registros manualmente

**Comando:**
```bash
php artisan make:seeder ProveedorSeeder
php artisan db:seed --class=ProveedorSeeder
```

---

### **Paso 7: Tests** 🧪
📂 `tests/Feature/ProveedorControllerTest.php`

**¿Qué hace?**
- Verifica que todo funcione correctamente
- Prueba los endpoints automáticamente

**Comando:**
```bash
php artisan make:test ProveedorControllerTest
php artisan test
```

---

### **Paso 8: Verificación** 🚀
📂 Postman, Thunder Client, o frontend

**¿Qué hace?**
- Pruebas manuales de los endpoints
- Verifica las respuestas JSON

---

## 🔄 Flujo de una Petición (Ejemplo: Crear Proveedor)

```
1. Cliente envía: POST /api/proveedores
   Body: {"nombre": "Acme", "email": "acme@example.com"}

2. Laravel recibe la petición en routes/api.php
   → Route::apiResource detecta POST → llama a store()

3. ProveedorController::store() se ejecuta:
   a) Valida datos con $request->validate()
   b) Crea registro con Proveedor::create($validated)
   c) Devuelve JSON con successResponse()

4. Modelo Proveedor interactúa con la BD:
   - Inserta registro en tabla 'proveedores'

5. Controlador devuelve respuesta:
   {"success": true, "data": {...}, "message": "..."}

6. Cliente recibe la respuesta JSON
```

---

## 🎯 Estructura del Proyecto TierOne

```
TierOne/
├── app/
│   ├── Http/
│   │   └── Controllers/
│   │       ├── ProveedorController.php ✅
│   │       ├── JuegoController.php
│   │       ├── CategoriaController.php
│   │       └── UserController.php
│   ├── Models/
│   │   ├── Proveedor.php ✅
│   │   ├── Juego.php ✅
│   │   ├── Categoria.php ✅
│   │   └── User.php ✅
│   └── Traits/
│       └── ApiResponseTrait.php ✅
├── database/
│   ├── migrations/
│   │   ├── create_users_table.php ✅
│   │   ├── create_juegos_table.php ✅
│   │   ├── create_categorias_table.php ✅
│   │   └── create_proveedores_table.php ✅
│   └── seeders/
├── routes/
│   └── api.php
└── docs/
    └── README.md (este archivo)
```
