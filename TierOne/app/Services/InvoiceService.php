<?php

namespace App\Services;

use App\Models\Orden;
use Barryvdh\DomPDF\Facade\Pdf;

class InvoiceService
{
    /**
     * Genera el PDF de la factura y retorna el stream o lo guarda en el disco.
     *
     * @param Orden $orden
     * @param string $action 'stream', 'download', 'save'
     * @return mixed
     */
    public function generateInvoice(Orden $orden, string $action = 'stream')
    {
        // Cargar las relaciones necesarias
        $orden->loadMissing(['usuario', 'items.producto', 'items.variante', 'direccionEnvio']);

        // Procesamiento seguro del logo
        $logoBase64 = '';
        if (extension_loaded('gd')) {
            $logoPath = config('invoice.logo_path');
            if (file_exists($logoPath)) {
                $logoBase64 = 'data:image/png;base64,' . base64_encode(file_get_contents($logoPath));
            }
        }

        // Procesar imágenes de personalización e imágenes principales para los items
        foreach ($orden->items as $item) {
            // Imagen de personalización (prioridad)
            if ($item->personalizacion_imagen) {
                $path = str_replace('/storage/', '', $item->personalizacion_imagen);
                $absolutePath = storage_path('app/public/' . $path);
                
                if (file_exists($absolutePath)) {
                    $imageData = base64_encode(file_get_contents($absolutePath));
                    $item->personalizacion_imagen_base64 = 'data:image/png;base64,' . $imageData;
                }
            } 
            // Si no hay personalización, intentar cargar la imagen principal del producto
            elseif ($item->producto && $item->producto->imagen_principal) {
                // Si la imagen empieza por http, es externa, si no, es local
                if (str_starts_with($item->producto->imagen_principal, 'http')) {
                    // Para imágenes externas en DomPDF es mejor descargarlas o dejarlas como URL si isRemoteEnabled está activo
                    // Pero para mayor seguridad las convertimos a base64
                    try {
                        $imageData = base64_encode(file_get_contents($item->producto->imagen_principal));
                        $item->producto_imagen_base64 = 'data:image/png;base64,' . $imageData;
                    } catch (\Exception $e) {
                        // Ignorar fallos de descarga
                    }
                } else {
                    $path = str_replace('/storage/', '', $item->producto->imagen_principal);
                    $absolutePath = storage_path('app/public/' . $path);
                    
                    if (file_exists($absolutePath)) {
                        $imageData = base64_encode(file_get_contents($absolutePath));
                        $item->producto_imagen_base64 = 'data:image/png;base64,' . $imageData;
                    }
                }
            }
        }

        $data = [
            'orden'   => $orden,
            'logo'    => $logoBase64,
            'empresa' => config('invoice.seller'),
        ];

        // Configurar opciones y cargar vista
        $pdf = Pdf::setOptions(config('invoice.pdf_options'))
            ->loadView('pdf.invoice', $data);

        $pdf->setPaper('a4', 'portrait');

        $nombreLimpio = \Illuminate\Support\Str::ascii($orden->direccionEnvio?->nombre_completo ?? ($orden->usuario?->nombre . $orden->usuario?->apellido));
        $nombreUsuario = str_replace(' ', '', $nombreLimpio);
        $filename = 'Factura-TierONE-' . $nombreUsuario . '.pdf';

        if ($action === 'download') {
            return $pdf->download($filename);
        }

        return $pdf->stream($filename);
    }
}
