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
        $orden->loadMissing(['usuario', 'items.producto', 'direccionEnvio']);

        // Procesamiento seguro del logo
        // Solo intentamos procesar la imagen si la extensión GD está activa para evitar Error 500
        $logoBase64 = '';
        if (extension_loaded('gd')) {
            $logoPath = public_path('images/Logo.png');
            if (file_exists($logoPath)) {
                $logoBase64 = 'data:image/png;base64,' . base64_encode(file_get_contents($logoPath));
            }
        }

        $data = [
            'orden' => $orden,
            'logo'  => $logoBase64,
            'empresa' => [
                'nombre' => 'TierOne eSports SL',
                'cif'    => 'B-12345678',
                'direccion' => 'Calle Falsa 123, Madrid, España',
                'email'  => 'facturacion@tierone.com',
            ]
        ];

        // Configurar opciones y cargar vista
        $pdf = Pdf::setOptions([
            'isHtml5ParserEnabled' => true,
            'isRemoteEnabled' => true,
            'chroot' => public_path(),
        ])->loadView('pdf.invoice', $data);

        $pdf->setPaper('a4', 'portrait');

        $filename = 'factura_' . $orden->numero_orden . '.pdf';

        if ($action === 'download') {
            return $pdf->download($filename);
        }

        return $pdf->stream($filename);
    }
}
