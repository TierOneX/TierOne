<?php

namespace App\Services;

use App\Models\Orden;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Log;

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

        // 1. Determinar el tipo de factura
        $tipoFactura = $this->resolverTipoFactura($orden->numero_orden);

        // 2. Procesamiento del logo
        $logoBase64 = '';
        if (extension_loaded('gd')) {
            $logoPath = public_path('images/Logo.png');
            if (file_exists($logoPath)) {
                $logoBase64 = 'data:image/png;base64,' . base64_encode(file_get_contents($logoPath));
            }
        }

        // 3. Procesamiento dinámico de los items
        $itemsProcesados = $orden->items->map(function ($item) use ($orden, $tipoFactura) {
            $nombre = $item->producto->nombre ?? 'Producto';
            
            // Resolución de imagen principal del producto
            $urlImagen = null;
            if ($item->producto) {
                $urlImagen = $item->producto->imagenes->first()->url_imagen ?? $item->producto->imagen_principal ?? null;
            }
            
            $imagenBase64 = '';
            $data = is_array($item->personalizacion_data) ? $item->personalizacion_data : json_decode($item->personalizacion_data ?? '{}', true);

            // --- A. LÓGICA POR TIPO DE COMPRA ---

            if ($tipoFactura === 'torneo') {
                if (isset($data['torneo_nombre'])) {
                    $nombre = 'Inscripción Torneo: ' . $data['torneo_nombre'];
                    $urlImagen = $data['juego_imagen'] ?? $urlImagen;
                } else {
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
                        $nombre = 'Inscripción Torneo: ' . $inscripcion->torneo->nombre;
                        $urlImagen = $inscripcion->torneo->juego->imagen_url ?? null;
                    }
                }
            }
            elseif ($tipoFactura === 'hydra') {
                if (isset($data['pack_name'])) {
                    $nombre = 'Pack ' . $data['pack_name'] . ': ' . number_format($data['hc_amount'] ?? 0) . ' Hydra Coins';
                    $urlImagen = 'assets/hydra-coin.png';
                }
            }
            elseif ($tipoFactura === 'partida') {
                if (isset($data['titulo'])) {
                    $nombre = 'Partida: ' . $data['titulo'] . ' (' . ($data['juego'] ?? '') . ')';
                }
                if (isset($data['partida_id'])) {
                    $partida = \App\Models\Partida::with('juego')->find($data['partida_id']);
                    if ($partida && $partida->juego) {
                        $urlImagen = $partida->juego->imagen_url ?? null;
                    }
                }
            }

            // --- B. PRODUCTOS PERSONALIZADOS (Tienda) ---
            if ($item->personalizacion_imagen) {
                $path = str_replace(['/storage/', 'storage/'], '', $item->personalizacion_imagen);
                $absolutePath = storage_path('app/public/' . $path);
                
                if (file_exists($absolutePath)) {
                    $imageData = base64_encode(file_get_contents($absolutePath));
                    $mime = mime_content_type($absolutePath) ?: 'image/png';
                    $imagenBase64 = 'data:' . $mime . ';base64,' . $imageData;
                }
            }

            // --- C. RESOLUCIÓN DE IMAGEN FINAL ---
            if (empty($imagenBase64) && extension_loaded('gd') && $urlImagen) {
                $imagenBase64 = $this->resolverImagenBase64($urlImagen);
            }

            return [
                'nombre' => $nombre,
                'cantidad' => $item->cantidad,
                'precio_unitario' => $item->precio_unitario,
                'subtotal' => $item->subtotal,
                'imagen_base64' => $imagenBase64,
                'variante_nombre' => $item->variante->nombre ?? null,
                'es_personalizado' => (bool)$item->personalizacion_imagen || (bool)$item->personalizacion_data
            ];
        });

        // 4. Resolución de datos del cliente (Nombre legal para factura)
        $clienteNombre = trim(($orden->usuario->nombre ?? '') . ' ' . ($orden->usuario->apellido ?? ''));

        // 5. Etiqueta del tipo de factura
        $etiquetaTipo = match($tipoFactura) {
            'torneo' => 'INSCRIPCIÓN TORNEO',
            'hydra' => 'COMPRA HYDRA COINS',
            'partida' => 'ENTRADA PARTIDA',
            default => 'PEDIDO MERCHANDISING',
        };

        $data = [
            'orden' => $orden,
            'usuario' => $orden->usuario,
            'items_procesados' => $itemsProcesados,
            'cliente_nombre' => $clienteNombre,
            'tipo_factura' => $tipoFactura,
            'etiqueta_tipo' => $etiquetaTipo,
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

    /**
     * Determina el tipo de factura basado en el prefijo del número de orden.
     */
    private function resolverTipoFactura(string $numeroOrden): string
    {
        if (str_starts_with($numeroOrden, 'TRN-')) return 'torneo';
        if (str_starts_with($numeroOrden, 'HYD-')) return 'hydra';
        if (str_starts_with($numeroOrden, 'PTD-')) return 'partida';
        return 'merchandising';
    }

    /**
     * Resuelve la imagen a base64 desde una URL o path.
     */
    private function resolverImagenBase64(?string $urlImagen): string
    {
        if (!$urlImagen || !extension_loaded('gd')) return '';

        if (str_starts_with($urlImagen, 'http')) {
            try {
                $imageData = @file_get_contents($urlImagen);
                if ($imageData) {
                    $finfo = new \finfo(FILEINFO_MIME_TYPE);
                    $mimeType = $finfo->buffer($imageData);
                    return 'data:' . $mimeType . ';base64,' . base64_encode($imageData);
                }
            } catch (\Exception $e) {
                Log::error("Error descargando imagen para PDF: " . $e->getMessage());
            }
            return '';
        }

        $rutas = [
            public_path($urlImagen),
            public_path('storage/' . $urlImagen),
            storage_path('app/public/' . $urlImagen),
        ];

        foreach ($rutas as $path) {
            if (file_exists($path) && is_file($path)) {
                try {
                    $data = file_get_contents($path);
                    $mime = mime_content_type($path);
                    return 'data:' . $mime . ';base64,' . base64_encode($data);
                } catch (\Exception $e) {
                    continue;
                }
            }
        }

        return '';
    }
}
