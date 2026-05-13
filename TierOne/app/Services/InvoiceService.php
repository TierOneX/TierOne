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
        $orden->loadMissing(['usuario', 'items.producto.imagenes', 'items.variante', 'direccionEnvio']);

        // 1. Procesamiento del logo
        $logoBase64 = '';
        if (extension_loaded('gd')) {
            $logoPath = public_path('images/Logo.png');
            if (file_exists($logoPath)) {
                $logoBase64 = 'data:image/png;base64,' . base64_encode(file_get_contents($logoPath));
            }
        }

        // 2. Procesamiento dinámico de los items
        $itemsProcesados = $orden->items->map(function ($item) use ($orden) {
            $nombre = $item->producto->nombre ?? 'Producto';
            $urlImagen = $item->producto->imagenes->first()->url_imagen ?? null;
            $imagenBase64 = '';

            // A. Lógica específica para TORNEOS
            if (str_starts_with($orden->numero_orden, 'TRN-')) {
                $inscripcion = \App\Models\InscripcionTorneo::where('id_usuario', $orden->id_usuario)
                    ->where(function($q) use ($orden) {
                        $q->where('pago_cuota', $orden->total)
                          ->orWhere('pago_cuota', $orden->subtotal);
                    })
                    ->whereIn('estado', ['pendiente', 'confirmada'])
                    ->with(['torneo.juego'])
                    ->latest()
                    ->first();
                
                if ($inscripcion && $inscripcion->torneo) {
                    $nombre = 'Inscripción: ' . $inscripcion->torneo->nombre;
                    $urlImagen = $inscripcion->torneo->juego->imagen_url ?? null;
                }
            }

            // A.2 Lógica específica para HYDRA COINS
            if (str_starts_with($orden->numero_orden, 'HYD-')) {
                $data = is_array($item->personalizacion_data) ? $item->personalizacion_data : json_decode($item->personalizacion_data, true);
                if (isset($data['pack_name'])) {
                    $nombre = 'Pack ' . $data['pack_name'] . ': ' . number_format($data['hc_amount']) . ' Hydra Coins';
                    $urlImagen = 'assets/hydra-coin.png'; // Ruta al icono de Hydra
                }
            }

            // B. Lógica específica para PRODUCTOS PERSONALIZADOS
            if ($item->personalizacion_imagen) {
                $path = str_replace('/storage/', '', $item->personalizacion_imagen);
                $absolutePath = storage_path('app/public/' . $path);
                
                if (file_exists($absolutePath)) {
                    $imageData = base64_encode(file_get_contents($absolutePath));
                    $imagenBase64 = 'data:image/png;base64,' . $imageData;
                }
            }

            // C. Lógica de imagen Base64 estándar/torneo (si no hay personalización)
            if (empty($imagenBase64) && extension_loaded('gd') && $urlImagen) {
                $path = public_path('storage/' . $urlImagen);
                if (!file_exists($path)) {
                    $path = public_path($urlImagen);
                }
                
                if (file_exists($path)) {
                    $type = pathinfo($path, PATHINFO_EXTENSION);
                    $data = file_get_contents($path);
                    $imagenBase64 = 'data:image/' . $type . ';base64,' . base64_encode($data);
                }
            }

            return [
                'nombre' => $nombre,
                'cantidad' => $item->cantidad,
                'precio_unitario' => $item->precio_unitario,
                'subtotal' => $item->subtotal,
                'imagen_base64' => $imagenBase64,
                'variante_nombre' => $item->variante->nombre ?? null,
                'es_personalizado' => (bool)$item->personalizacion_imagen
            ];
        });

        // 3. Resolución de datos del cliente (Evitar Laura Marín en torneos)
        $clienteNombre = $orden->direccionEnvio->nombre_completo ?? $orden->usuario->nombre;
        if ($orden->id_direccion_envio == 1 && str_starts_with($orden->numero_orden, 'TRN-')) {
            $clienteNombre = $orden->usuario->nombre . ' ' . $orden->usuario->apellido;
        }

        $data = [
            'orden' => $orden,
            'items_procesados' => $itemsProcesados,
            'cliente_nombre' => $clienteNombre,
            'logo'  => $logoBase64,
            'empresa' => [
                'nombre' => 'TierOne eSports SL',
                'cif'    => 'B-12345678',
                'direccion' => 'Avenida de la Innovación, Sevilla, España',
                'email'  => 'facturacion@tierone.com',
            ]
        ];

        // Configurar opciones y cargar vista
        $pdf = Pdf::setOptions([
            'isHtml5ParserEnabled' => true,
            'isRemoteEnabled' => true,
            'defaultFont' => 'sans-serif'
        ])->loadView('pdf.invoice', $data);

        if ($action === 'download') {
            return $pdf->download('Factura-' . $orden->numero_orden . '.pdf');
        }

        return $pdf->stream('Factura-' . $orden->numero_orden . '.pdf');
    }
}
