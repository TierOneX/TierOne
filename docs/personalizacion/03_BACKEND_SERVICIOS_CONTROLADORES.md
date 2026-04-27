# Módulo 2 — Backend: Servicios y Controladores

> **PREREQUISITO**: Módulo 1 completado (tablas y modelos existen)
> **RESULTADO**: Endpoints funcionales para subir imágenes, generar preview PNG y gestionar zonas.
> **CHECKPOINT**: Endpoints responden correctamente vía Postman/curl.

---

## 2.1 Nuevo Servicio: `CustomizationService.php`

**Archivo**: `TierOne/TierOne/app/Services/CustomizationService.php`

```php
<?php

namespace App\Services;

use App\Models\PrecioPersonalizacion;
use App\Models\ZonaPersonalizacion;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class CustomizationService
{
    /**
     * Sube una imagen del usuario para usar en la personalización.
     *
     * @param UploadedFile $file Imagen subida (máx 10MB)
     * @return string Ruta pública de la imagen almacenada
     */
    public function uploadUserImage(UploadedFile $file): string
    {
        $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
        $path = $file->storeAs('customizations/uploads', $filename, 'public');
        return '/storage/' . $path;
    }

    /**
     * Guarda el PNG renderizado del diseño final.
     *
     * @param string $base64Image El PNG codificado en base64 (data:image/png;base64,...)
     * @param int $productoId ID del producto
     * @return string Ruta pública del PNG guardado
     */
    public function saveRenderedDesign(string $base64Image, int $productoId): string
    {
        // Extraer datos binarios del base64
        $imageData = explode(',', $base64Image);
        $decoded = base64_decode(end($imageData));

        $filename = 'design_' . $productoId . '_' . Str::uuid() . '.png';
        $path = 'customizations/renders/' . $filename;

        Storage::disk('public')->put($path, $decoded);

        return '/storage/' . $path;
    }

    /**
     * Calcula el recargo de personalización basado en las capas.
     *
     * @param array $zonas Array de zonas con sus capas
     * @param int|null $productoId ID del producto (para precios específicos)
     * @return array ['textos' => int, 'imagenes' => int, 'precio_texto' => float, 'precio_imagen' => float, 'total' => float]
     */
    public function calcularRecargo(array $zonas, ?int $productoId = null): array
    {
        $numTextos = 0;
        $numImagenes = 0;

        foreach ($zonas as $zona) {
            foreach ($zona['capas'] ?? [] as $capa) {
                if ($capa['tipo'] === 'texto') $numTextos++;
                if ($capa['tipo'] === 'imagen') $numImagenes++;
            }
        }

        $precioTexto = PrecioPersonalizacion::getPrecio('texto', $productoId);
        $precioImagen = PrecioPersonalizacion::getPrecio('imagen', $productoId);

        return [
            'textos'         => $numTextos,
            'imagenes'       => $numImagenes,
            'precio_texto'   => $precioTexto,
            'precio_imagen'  => $precioImagen,
            'total'          => ($numTextos * $precioTexto) + ($numImagenes * $precioImagen),
        ];
    }

    /**
     * Elimina una imagen subida por el usuario.
     */
    public function deleteUserImage(string $path): bool
    {
        $relativePath = str_replace('/storage/', '', $path);
        return Storage::disk('public')->delete($relativePath);
    }

    /**
     * Obtiene las zonas activas de un producto con precios.
     */
    public function getProductCustomizationData(int $productoId): array
    {
        $zonas = ZonaPersonalizacion::where('id_producto', $productoId)
            ->where('activa', true)
            ->orderBy('orden')
            ->get();

        $precios = [
            'texto'  => PrecioPersonalizacion::getPrecio('texto', $productoId),
            'imagen' => PrecioPersonalizacion::getPrecio('imagen', $productoId),
        ];

        return [
            'zonas'   => $zonas,
            'precios' => $precios,
        ];
    }
}
```

---

## 2.2 Nuevo Controlador: `CustomizationController.php`

**Archivo**: `TierOne/TierOne/app/Http/Controllers/Web/CustomizationController.php`

```php
<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Producto;
use App\Services\CustomizationService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomizationController extends Controller
{
    public function __construct(
        protected CustomizationService $customizationService
    ) {}

    /**
     * Muestra el editor de personalización para un producto.
     * GET /shop/{slug}/personalizar
     */
    public function editor(string $slug)
    {
        $producto = Producto::with(['categoria', 'variantes', 'zonasPersonalizacion' => function ($q) {
            $q->where('activa', true)->orderBy('orden');
        }])
            ->where('slug', $slug)
            ->where('activo', true)
            ->where('personalizable', true)
            ->firstOrFail();

        $customizationData = $this->customizationService->getProductCustomizationData($producto->id);

        return Inertia::render('ProductCustomizer', [
            'producto' => $producto,
            'zonas'    => $customizationData['zonas'],
            'precios'  => $customizationData['precios'],
        ]);
    }

    /**
     * Sube una imagen del usuario para usar en el diseño.
     * POST /customization/upload-image
     * Body: imagen (file, max 10MB)
     * Response: { url: string }
     */
    public function uploadImage(Request $request)
    {
        $request->validate([
            'imagen' => 'required|image|mimes:jpeg,png,jpg,gif,svg,webp|max:10240',
        ]);

        $url = $this->customizationService->uploadUserImage($request->file('imagen'));

        return response()->json(['url' => $url]);
    }

    /**
     * Guarda el diseño renderizado como PNG.
     * POST /customization/save-render
     * Body: { imagen_base64: string, producto_id: int }
     * Response: { url: string }
     */
    public function saveRender(Request $request)
    {
        $request->validate([
            'imagen_base64' => 'required|string',
            'producto_id'   => 'required|exists:productos,id',
        ]);

        $url = $this->customizationService->saveRenderedDesign(
            $request->input('imagen_base64'),
            $request->input('producto_id')
        );

        return response()->json(['url' => $url]);
    }

    /**
     * Calcula el precio de personalización.
     * POST /customization/calcular-precio
     * Body: { zonas: array, producto_id: int }
     * Response: { textos, imagenes, precio_texto, precio_imagen, total }
     */
    public function calcularPrecio(Request $request)
    {
        $request->validate([
            'zonas'       => 'required|array',
            'producto_id' => 'required|exists:productos,id',
        ]);

        $resultado = $this->customizationService->calcularRecargo(
            $request->input('zonas'),
            $request->input('producto_id')
        );

        return response()->json($resultado);
    }
}
```

---

## 2.3 Nuevo Controlador: `ZonaPersonalizacionController.php`

**Archivo**: `TierOne/TierOne/app/Http/Controllers/Web/ZonaPersonalizacionController.php`

```php
<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Producto;
use App\Models\ZonaPersonalizacion;
use App\Models\PrecioPersonalizacion;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ZonaPersonalizacionController extends Controller
{
    /**
     * Página admin para configurar zonas de un producto.
     * GET /panel-admin-ecommerce/products/{producto}/zonas
     */
    public function index(Producto $producto)
    {
        $zonas = $producto->zonasPersonalizacion()->orderBy('orden')->get();

        // Precios: específicos del producto o globales
        $precioTexto = PrecioPersonalizacion::getPrecio('texto', $producto->id);
        $precioImagen = PrecioPersonalizacion::getPrecio('imagen', $producto->id);

        // Precios globales (para mostrar como referencia)
        $precioTextoGlobal = PrecioPersonalizacion::getPrecio('texto');
        $precioImagenGlobal = PrecioPersonalizacion::getPrecio('imagen');

        return Inertia::render('PanelAdminEcommerce/ProductZones', [
            'producto'            => $producto,
            'zonas'               => $zonas,
            'precioTexto'         => $precioTexto,
            'precioImagen'        => $precioImagen,
            'precioTextoGlobal'   => $precioTextoGlobal,
            'precioImagenGlobal'  => $precioImagenGlobal,
        ]);
    }

    /**
     * Crea una nueva zona de personalización.
     * POST /panel-admin-ecommerce/products/{producto}/zonas
     */
    public function store(Request $request, Producto $producto)
    {
        $validated = $request->validate([
            'nombre'        => 'required|string|max:100',
            'imagen_base'   => 'required|image|mimes:jpeg,png,jpg,webp|max:10240',
            'area_x'        => 'required|integer|min:0',
            'area_y'        => 'required|integer|min:0',
            'area_width'    => 'required|integer|min:50',
            'area_height'   => 'required|integer|min:50',
            'canvas_width'  => 'required|integer|min:200',
            'canvas_height' => 'required|integer|min:200',
        ]);

        // Subir imagen base de la zona
        $path = $request->file('imagen_base')->store('customizations/bases', 'public');
        $validated['imagen_base'] = '/storage/' . $path;
        $validated['slug'] = Str::slug($validated['nombre']);
        $validated['id_producto'] = $producto->id;
        $validated['orden'] = $producto->zonasPersonalizacion()->count();

        ZonaPersonalizacion::create($validated);

        return redirect()->back()->with('success', 'Zona creada correctamente');
    }

    /**
     * Actualiza una zona existente.
     * PUT /panel-admin-ecommerce/zonas/{zona}
     */
    public function update(Request $request, ZonaPersonalizacion $zona)
    {
        $validated = $request->validate([
            'nombre'        => 'sometimes|string|max:100',
            'imagen_base'   => 'nullable|image|mimes:jpeg,png,jpg,webp|max:10240',
            'area_x'        => 'sometimes|integer|min:0',
            'area_y'        => 'sometimes|integer|min:0',
            'area_width'    => 'sometimes|integer|min:50',
            'area_height'   => 'sometimes|integer|min:50',
            'canvas_width'  => 'sometimes|integer|min:200',
            'canvas_height' => 'sometimes|integer|min:200',
            'activa'        => 'sometimes|boolean',
        ]);

        if ($request->hasFile('imagen_base')) {
            $path = $request->file('imagen_base')->store('customizations/bases', 'public');
            $validated['imagen_base'] = '/storage/' . $path;
        }

        if (isset($validated['nombre'])) {
            $validated['slug'] = Str::slug($validated['nombre']);
        }

        $zona->update($validated);

        return redirect()->back()->with('success', 'Zona actualizada correctamente');
    }

    /**
     * Elimina una zona.
     * DELETE /panel-admin-ecommerce/zonas/{zona}
     */
    public function destroy(ZonaPersonalizacion $zona)
    {
        $zona->delete();
        return redirect()->back()->with('success', 'Zona eliminada correctamente');
    }

    /**
     * Actualiza los precios de personalización de un producto.
     * PUT /panel-admin-ecommerce/products/{producto}/precios-personalizacion
     */
    public function updatePrecios(Request $request, Producto $producto)
    {
        $validated = $request->validate([
            'precio_texto'  => 'required|numeric|min:0',
            'precio_imagen' => 'required|numeric|min:0',
            'usar_global'   => 'boolean',
        ]);

        if ($validated['usar_global'] ?? false) {
            // Eliminar precios específicos → usará los globales
            PrecioPersonalizacion::where('id_producto', $producto->id)->delete();
        } else {
            // Crear o actualizar precios específicos
            PrecioPersonalizacion::updateOrCreate(
                ['id_producto' => $producto->id, 'tipo_elemento' => 'texto'],
                ['precio' => $validated['precio_texto']]
            );
            PrecioPersonalizacion::updateOrCreate(
                ['id_producto' => $producto->id, 'tipo_elemento' => 'imagen'],
                ['precio' => $validated['precio_imagen']]
            );
        }

        return redirect()->back()->with('success', 'Precios actualizados correctamente');
    }
}
```

---

## 2.4 Nuevas Rutas

**Archivo a modificar**: `TierOne/TierOne/routes/web.php`

Añadir estos bloques **DESPUÉS** de las rutas de Shop y **ANTES** de las rutas del Admin Panel:

```php
// =========================================================================
// CUSTOMIZATION ROUTES (USUARIO)
// =========================================================================

Route::get('/shop/{slug}/personalizar', [App\Http\Controllers\Web\CustomizationController::class, 'editor'])->name('product.customize');
Route::post('/customization/upload-image', [App\Http\Controllers\Web\CustomizationController::class, 'uploadImage'])->name('customization.upload');
Route::post('/customization/save-render', [App\Http\Controllers\Web\CustomizationController::class, 'saveRender'])->name('customization.saveRender');
Route::post('/customization/calcular-precio', [App\Http\Controllers\Web\CustomizationController::class, 'calcularPrecio'])->name('customization.calcularPrecio');
```

Añadir dentro del grupo `panel-admin-ecommerce`:

```php
// Zonas de personalización
Route::get('/products/{producto}/zonas', [App\Http\Controllers\Web\ZonaPersonalizacionController::class, 'index'])->name('products.zonas');
Route::post('/products/{producto}/zonas', [App\Http\Controllers\Web\ZonaPersonalizacionController::class, 'store'])->name('products.zonas.store');
Route::put('/zonas/{zona}', [App\Http\Controllers\Web\ZonaPersonalizacionController::class, 'update'])->name('zonas.update');
Route::delete('/zonas/{zona}', [App\Http\Controllers\Web\ZonaPersonalizacionController::class, 'destroy'])->name('zonas.destroy');
Route::put('/products/{producto}/precios-personalizacion', [App\Http\Controllers\Web\ZonaPersonalizacionController::class, 'updatePrecios'])->name('products.precios');
```

---

## 2.5 Crear directorios de storage

```bash
mkdir -p storage/app/public/customizations/uploads
mkdir -p storage/app/public/customizations/bases
mkdir -p storage/app/public/customizations/renders
php artisan storage:link
```

---

## Verificación del Módulo 2

1. **Rutas registradas**:
```bash
php artisan route:list --path=customization
php artisan route:list --path=zonas
```
Debe mostrar las 4 rutas de customization y 5 de zonas.

2. **Test de upload** (con artisan tinker o Postman):
```bash
# POST /customization/upload-image con un archivo de imagen
# Debería devolver { "url": "/storage/customizations/uploads/xxx.png" }
```

3. **Verificar que no hay errores de sintaxis**:
```bash
php artisan route:clear
php artisan config:clear
```
