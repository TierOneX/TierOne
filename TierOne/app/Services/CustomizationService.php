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
        $extension = $file->extension() ?: $file->getClientOriginalExtension() ?: 'png';
        $filename = Str::uuid() . '.' . $extension;
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
            ->where('tipo', '!=', 'bloqueada') // Zonas bloqueadas no se envían al cliente
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
