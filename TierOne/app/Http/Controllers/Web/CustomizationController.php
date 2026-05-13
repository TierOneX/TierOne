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
