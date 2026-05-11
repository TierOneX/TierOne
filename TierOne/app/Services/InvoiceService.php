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

        // Procesar imágenes de personalización para los items
        foreach ($orden->items as $item) {
            if ($item->personalizacion_imagen) {
                // Convertir /storage/... a ruta absoluta del sistema
                $path = str_replace('/storage/', '', $item->personalizacion_imagen);
                $absolutePath = storage_path('app/public/' . $path);
                
                if (file_exists($absolutePath)) {
                    $imageData = base64_encode(file_get_contents($absolutePath));
                    $item->personalizacion_imagen_base64 = 'data:image/png;base64,' . $imageData;
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
