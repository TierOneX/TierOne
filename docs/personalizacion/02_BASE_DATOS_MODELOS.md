# Módulo 1 — Base de Datos y Modelos

> **PREREQUISITO**: Haber leído `01_CONTEXTO_PROYECTO.md`
> **RESULTADO**: Nuevas tablas y modelos Eloquent listos para usar por los demás módulos.
> **CHECKPOINT**: `php artisan migrate` ejecuta sin errores.

---

## 1.1 Nueva Migración: Campos de personalización en tablas existentes

**Archivo**: `TierOne/TierOne/database/migrations/2026_04_27_100000_add_personalizacion_to_productos.php`

Esta migración añade campos a tablas existentes:

### Tabla `productos` — añadir:
| Campo | Tipo | Default | Descripción |
|-------|------|---------|-------------|
| `personalizable` | boolean | false | Si el producto permite personalización |

### Tabla `items_carrito` — añadir:
| Campo | Tipo | Default | Descripción |
|-------|------|---------|-------------|
| `personalizacion_data` | JSON | null | Datos del diseño personalizado |

### Tabla `items_orden` — añadir:
| Campo | Tipo | Default | Descripción |
|-------|------|---------|-------------|
| `personalizacion_data` | JSON | null | Datos del diseño personalizado |
| `personalizacion_imagen` | string | null | Ruta al PNG renderizado del diseño |

### Código de la migración:
```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('productos', function (Blueprint $table) {
            $table->boolean('personalizable')->default(false)->after('activo');
        });

        Schema::table('items_carrito', function (Blueprint $table) {
            $table->json('personalizacion_data')->nullable()->after('subtotal');
        });

        Schema::table('items_orden', function (Blueprint $table) {
            $table->json('personalizacion_data')->nullable()->after('subtotal');
            $table->string('personalizacion_imagen')->nullable()->after('personalizacion_data');
        });
    }

    public function down(): void
    {
        Schema::table('productos', function (Blueprint $table) {
            $table->dropColumn('personalizable');
        });
        Schema::table('items_carrito', function (Blueprint $table) {
            $table->dropColumn('personalizacion_data');
        });
        Schema::table('items_orden', function (Blueprint $table) {
            $table->dropColumn(['personalizacion_data', 'personalizacion_imagen']);
        });
    }
};
```

---

## 1.2 Nueva Migración: Tabla `zonas_personalizacion`

**Archivo**: `TierOne/TierOne/database/migrations/2026_04_27_100100_create_zonas_personalizacion_table.php`

Define las zonas de impresión configurables por producto.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | bigIncrements | PK |
| `id_producto` | foreignId → productos | Producto al que pertenece la zona |
| `nombre` | string | Nombre visible: "Frontal", "Espalda", "Manga Izq." |
| `slug` | string | Identificador interno: "frontal", "espalda" |
| `imagen_base` | string | Ruta a la imagen del producto en esta vista |
| `area_x` | integer | Coordenada X del inicio del área imprimible (px) |
| `area_y` | integer | Coordenada Y del inicio del área imprimible (px) |
| `area_width` | integer | Ancho del área imprimible (px) |
| `area_height` | integer | Alto del área imprimible (px) |
| `canvas_width` | integer, default 600 | Ancho total del canvas |
| `canvas_height` | integer, default 700 | Alto total del canvas |
| `orden` | integer, default 0 | Orden de visualización (menor = primero) |
| `activa` | boolean, default true | Si la zona está activa |
| `timestamps` | — | created_at, updated_at |

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('zonas_personalizacion', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_producto')->constrained('productos')->onDelete('cascade');
            $table->string('nombre');
            $table->string('slug');
            $table->string('imagen_base');
            $table->integer('area_x')->default(0);
            $table->integer('area_y')->default(0);
            $table->integer('area_width')->default(300);
            $table->integer('area_height')->default(350);
            $table->integer('canvas_width')->default(600);
            $table->integer('canvas_height')->default(700);
            $table->integer('orden')->default(0);
            $table->boolean('activa')->default(true);
            $table->timestamps();

            $table->unique(['id_producto', 'slug']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('zonas_personalizacion');
    }
};
```

---

## 1.3 Nueva Migración: Tabla `precios_personalizacion`

**Archivo**: `TierOne/TierOne/database/migrations/2026_04_27_100200_create_precios_personalizacion_table.php`

Precios por tipo de elemento. Si `id_producto` es null, es el precio global por defecto. Si tiene valor, es el precio específico de ese producto.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | bigIncrements | PK |
| `id_producto` | foreignId nullable | null = precio global, valor = precio específico |
| `tipo_elemento` | string | `"texto"` o `"imagen"` |
| `precio` | decimal(10,2) | Coste por cada elemento de este tipo |
| `timestamps` | — | — |

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('precios_personalizacion', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_producto')->nullable()->constrained('productos')->onDelete('cascade');
            $table->string('tipo_elemento'); // 'texto' | 'imagen'
            $table->decimal('precio', 10, 2)->default(0);
            $table->timestamps();

            $table->unique(['id_producto', 'tipo_elemento']);
        });

        // Insertar precios globales por defecto (editables desde admin)
        DB::table('precios_personalizacion')->insert([
            ['id_producto' => null, 'tipo_elemento' => 'texto', 'precio' => 2.00, 'created_at' => now(), 'updated_at' => now()],
            ['id_producto' => null, 'tipo_elemento' => 'imagen', 'precio' => 3.00, 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('precios_personalizacion');
    }
};
```

---

## 1.4 Nuevo Modelo: `ZonaPersonalizacion`

**Archivo**: `TierOne/TierOne/app/Models/ZonaPersonalizacion.php`

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ZonaPersonalizacion extends Model
{
    protected $table = 'zonas_personalizacion';

    protected $fillable = [
        'id_producto', 'nombre', 'slug', 'imagen_base',
        'area_x', 'area_y', 'area_width', 'area_height',
        'canvas_width', 'canvas_height', 'orden', 'activa',
    ];

    protected $casts = [
        'area_x'        => 'integer',
        'area_y'        => 'integer',
        'area_width'    => 'integer',
        'area_height'   => 'integer',
        'canvas_width'  => 'integer',
        'canvas_height' => 'integer',
        'orden'         => 'integer',
        'activa'        => 'boolean',
    ];

    public function producto()
    {
        return $this->belongsTo(Producto::class, 'id_producto');
    }
}
```

---

## 1.5 Nuevo Modelo: `PrecioPersonalizacion`

**Archivo**: `TierOne/TierOne/app/Models/PrecioPersonalizacion.php`

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PrecioPersonalizacion extends Model
{
    protected $table = 'precios_personalizacion';

    protected $fillable = ['id_producto', 'tipo_elemento', 'precio'];

    protected $casts = [
        'precio' => 'decimal:2',
    ];

    public function producto()
    {
        return $this->belongsTo(Producto::class, 'id_producto');
    }

    /**
     * Obtiene el precio para un tipo de elemento y producto.
     * Si el producto tiene precio específico, lo usa. Si no, usa el global.
     */
    public static function getPrecio(string $tipoElemento, ?int $productoId = null): float
    {
        // Buscar precio específico del producto
        if ($productoId) {
            $especifico = self::where('id_producto', $productoId)
                ->where('tipo_elemento', $tipoElemento)
                ->first();
            if ($especifico) return (float) $especifico->precio;
        }

        // Fallback: precio global
        $global = self::whereNull('id_producto')
            ->where('tipo_elemento', $tipoElemento)
            ->first();

        return $global ? (float) $global->precio : 0.00;
    }
}
```

---

## 1.6 Modificar Modelo Existente: `Producto.php`

**Archivo**: `TierOne/TierOne/app/Models/Producto.php`

### Cambios requeridos:

1. **Añadir `personalizable` al array `$fillable`** (después de `activo`):
```php
// En $fillable, añadir:
'personalizable',
```

2. **Añadir cast** en `$casts`:
```php
'personalizable' => 'boolean',
```

3. **Añadir dos nuevas relaciones** al final de la clase:
```php
/**
 * Relación: Un producto tiene muchas zonas de personalización
 */
public function zonasPersonalizacion()
{
    return $this->hasMany(ZonaPersonalizacion::class, 'id_producto')->orderBy('orden');
}

/**
 * Relación: Un producto tiene precios de personalización específicos
 */
public function preciosPersonalizacion()
{
    return $this->hasMany(PrecioPersonalizacion::class, 'id_producto');
}
```

---

## 1.7 Modificar Modelo Existente: `ItemCarrito.php`

**Archivo**: `TierOne/TierOne/app/Models/ItemCarrito.php`

### Cambios:
1. Añadir `'personalizacion_data'` al array `$fillable`
2. Añadir al array `$casts`:
```php
'personalizacion_data' => 'array',
```

---

## 1.8 Modificar Modelo Existente: `ItemOrden.php`

**Archivo**: `TierOne/TierOne/app/Models/ItemOrden.php`

### Cambios:
1. Añadir `'personalizacion_data'` y `'personalizacion_imagen'` al array `$fillable`
2. Añadir al array `$casts`:
```php
'personalizacion_data' => 'array',
```

---

## Verificación del Módulo 1

```bash
cd TierOne/TierOne
php artisan migrate
```

**Resultado esperado**: Migración exitosa, 3 nuevas migraciones ejecutadas.

**Verificación adicional** (tinker):
```bash
php artisan tinker
>>> \App\Models\PrecioPersonalizacion::all();
# Debería devolver 2 registros (texto y imagen con precios globales)
>>> (new \App\Models\Producto)->getFillable();
# Debería incluir 'personalizable'
```
