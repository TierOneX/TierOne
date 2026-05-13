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
        
        // Cargamos las imágenes del producto para poder reutilizarlas
        $producto->load('imagenes');

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
        $rules = [
            'nombre'        => 'required|string|max:100',
            'tipo'          => 'sometimes|in:impresion,bloqueada,baja_visibilidad',
            'area_x'        => 'required|integer|min:0',
            'area_y'        => 'required|integer|min:0',
            'area_width'    => 'required|integer|min:50',
            'area_height'   => 'required|integer|min:50',
            'canvas_width'  => 'required|integer|min:200',
            'canvas_height' => 'required|integer|min:200',
        ];

        // Puede ser un archivo nuevo o una URL existente
        if ($request->hasFile('imagen_base')) {
            $rules['imagen_base'] = 'image|mimes:jpeg,png,jpg,webp|max:10240';
        } else {
            $rules['imagen_base'] = 'required|string';
        }

        $validated = $request->validate($rules);

        // Subir imagen si es un archivo
        if ($request->hasFile('imagen_base')) {
            $path = $request->file('imagen_base')->store('customizations/bases', 'public');
            $validated['imagen_base'] = '/storage/' . $path;
        }

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
        $rules = [
            'nombre'        => 'sometimes|string|max:100',
            'tipo'          => 'sometimes|in:impresion,bloqueada,baja_visibilidad',
            'area_x'        => 'sometimes|integer|min:0',
            'area_y'        => 'sometimes|integer|min:0',
            'area_width'    => 'sometimes|integer|min:50',
            'area_height'   => 'sometimes|integer|min:50',
            'canvas_width'  => 'sometimes|integer|min:200',
            'canvas_height' => 'sometimes|integer|min:200',
            'activa'        => 'sometimes|boolean',
        ];

        if ($request->hasFile('imagen_base')) {
            $rules['imagen_base'] = 'image|mimes:jpeg,png,jpg,webp|max:10240';
        } elseif ($request->has('imagen_base')) {
            $rules['imagen_base'] = 'string';
        }

        $validated = $request->validate($rules);

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

    /**
     * Sincroniza múltiples zonas para una misma imagen base.
     * POST /panel-admin-ecommerce/products/{producto}/zonas/sync
     */
    public function bulkSync(Request $request, Producto $producto)
    {
        $validated = $request->validate([
            'imagen_base' => 'required|string',
            'zonas'       => 'present|array',
            'zonas.*.id'           => 'nullable|exists:zonas_personalizacion,id',
            'zonas.*.nombre'       => 'required|string|max:100',
            'zonas.*.tipo'         => 'required|in:impresion,bloqueada,baja_visibilidad',
            'zonas.*.area_x'       => 'required|integer|min:0',
            'zonas.*.area_y'       => 'required|integer|min:0',
            'zonas.*.area_width'   => 'required|integer|min:20',
            'zonas.*.area_height'  => 'required|integer|min:20',
            'zonas.*.canvas_width' => 'required|integer|min:100',
            'zonas.*.canvas_height'=> 'required|integer|min:100',
        ]);

        $imgBase = $validated['imagen_base'];
        
        // Normalizar la imagen_base para la búsqueda (quitar /storage/ si existe para comparar)
        $searchImgBase = str_replace('/storage/', '', $imgBase);
        $searchImgBaseFull = str_starts_with($imgBase, '/storage/') ? $imgBase : '/storage/' . $imgBase;

        $incomingIds = collect($validated['zonas'])->pluck('id')->filter()->toArray();

        // 1. Eliminar zonas de esta imagen que no vienen en la nueva lista
        // Buscamos tanto con /storage/ como sin él por si hay inconsistencias
        ZonaPersonalizacion::where('id_producto', $producto->id)
            ->where(function($q) use ($searchImgBase, $searchImgBaseFull) {
                $q->where('imagen_base', $searchImgBase)
                  ->orWhere('imagen_base', $searchImgBaseFull);
            })
            ->whereNotIn('id', $incomingIds)
            ->delete();

        // 2. Crear o Actualizar las que vienen
        foreach ($validated['zonas'] as $idx => $zData) {
            $zData['id_producto'] = $producto->id;
            $zData['imagen_base'] = $imgBase;
            
            // Generar slug único para este producto
            $baseSlug = Str::slug($zData['nombre']);
            $slug = $baseSlug;
            $count = 1;
            while (ZonaPersonalizacion::where('id_producto', $producto->id)
                ->where('slug', $slug)
                ->where('id', '!=', $zData['id'] ?? 0)
                ->exists()) {
                $slug = $baseSlug . '-' . $count++;
            }
            
            $zData['slug'] = $slug;
            $zData['orden'] = $idx;
            $zData['activa'] = true;

            if (!empty($zData['id'])) {
                ZonaPersonalizacion::where('id', $zData['id'])->update($zData);
            } else {
                unset($zData['id']);
                ZonaPersonalizacion::create($zData);
            }
        }

        return redirect()->back()->with('success', 'Vista sincronizada correctamente');
    }
}
