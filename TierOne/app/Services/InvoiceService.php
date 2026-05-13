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
            $urlImagen = $item->producto->imagenes->first()->url_imagen ?? null;
            $imagenBase64 = '';

            // A. Lógica específica para TORNEOS
            if ($tipoFactura === 'torneo') {
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

            // A.2 Lógica específica para HYDRA COINS
            if ($tipoFactura === 'hydra') {
                $data = is_array($item->personalizacion_data) ? $item->personalizacion_data : json_decode($item->personalizacion_data, true);
                if (isset($data['pack_name'])) {
                    $nombre = 'Pack ' . $data['pack_name'] . ': ' . number_format($data['hc_amount']) . ' Hydra Coins';
                    $urlImagen = 'assets/hydra-coin.png'; // Ruta al icono de Hydra
                }
            }

            // A.3 Lógica específica para PARTIDAS
            if ($tipoFactura === 'partida') {
                $data = is_array($item->personalizacion_data) ? $item->personalizacion_data : json_decode($item->personalizacion_data, true);
                if (isset($data['tipo']) && $data['tipo'] === 'partida') {
                    $nombre = 'Partida: ' . ($data['titulo'] ?? 'Match') . ' (' . ($data['juego'] ?? '') . ')';
                }
                // Intentar obtener la imagen del juego a través de la partida
                if (isset($data['partida_id'])) {
                    $partida = \App\Models\Partida::with('juego')->find($data['partida_id']);
                    if ($partida && $partida->juego) {
                        $urlImagen = $partida->juego->imagen_url ?? null;
                    }
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

            // C. Lógica de imagen Base64 estándar (si no hay personalización)
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
                'es_personalizado' => (bool)$item->personalizacion_imagen
            ];
        });

        // 4. Resolución ROBUSTA de datos del cliente
        $clienteNombre = $this->resolverNombreCliente($orden, $tipoFactura);

        // 5. Etiqueta del tipo de factura
        $etiquetaTipo = match($tipoFactura) {
            'torneo' => 'INSCRIPCIÓN TORNEO',
            'hydra' => 'COMPRA HYDRA COINS',
            'partida' => 'ENTRADA PARTIDA',
            default => 'PEDIDO MERCHANDISING',
        };

        $data = [
            'orden' => $orden,
            'items_procesados' => $itemsProcesados,
            'cliente_nombre' => $clienteNombre,
            'tipo_factura' => $tipoFactura,
            'etiqueta_tipo' => $etiquetaTipo,
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
        return 'merchandising'; // TIO- u otro
    }

    /**
     * Resuelve el nombre del cliente de forma robusta.
     * Para compras digitales (torneo, hydra, partida) → SIEMPRE usa datos del usuario.
     * Para merchandising → usa la dirección de envío si existe, sino datos del usuario.
     */
    private function resolverNombreCliente(Orden $orden, string $tipoFactura): string
    {
        // Para compras digitales, SIEMPRE usar el nombre del usuario autenticado
        if (in_array($tipoFactura, ['torneo', 'hydra', 'partida'])) {
            return trim(($orden->usuario->nombre ?? '') . ' ' . ($orden->usuario->apellido ?? ''));
        }

        // Para merchandising, usar dirección de envío si existe y es válida
        if ($orden->direccionEnvio && $orden->id_direccion_envio) {
            // Verificar que la dirección pertenece al usuario de la orden
            if ($orden->direccionEnvio->id_usuario === $orden->id_usuario) {
                return $orden->direccionEnvio->nombre_completo;
            }
        }

        // Fallback: nombre del usuario
        return trim(($orden->usuario->nombre ?? '') . ' ' . ($orden->usuario->apellido ?? ''));
    }

    /**
     * Resuelve la imagen a base64 desde una URL relativa.
     */
    private function resolverImagenBase64(?string $urlImagen): string
    {
        if (!$urlImagen || !extension_loaded('gd')) return '';

        // Intentar múltiples rutas
        $rutas = [
            public_path('storage/' . $urlImagen),
            public_path($urlImagen),
            storage_path('app/public/' . $urlImagen),
        ];

        // Si es una URL externa (IGDB, etc.), intentar descargar
        if (str_starts_with($urlImagen, 'http')) {
            try {
                $imageData = @file_get_contents($urlImagen);
                if ($imageData) {
                    $type = 'jpeg'; // Default
                    $finfo = new \finfo(FILEINFO_MIME_TYPE);
                    $mimeType = $finfo->buffer($imageData);
                    if (str_contains($mimeType, 'png')) $type = 'png';
                    elseif (str_contains($mimeType, 'webp')) $type = 'webp';
                    return 'data:image/' . $type . ';base64,' . base64_encode($imageData);
                }
            } catch (\Exception $e) {
                // Silently fail
            }
            return '';
        }

        foreach ($rutas as $path) {
            if (file_exists($path)) {
                $type = pathinfo($path, PATHINFO_EXTENSION) ?: 'png';
                $data = file_get_contents($path);
                return 'data:image/' . $type . ';base64,' . base64_encode($data);
            }
        }

        return '';
    }
}
