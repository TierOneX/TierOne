<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Factura {{ $orden->numero_orden }}</title>
    <style>
        body {
            font-family: Helvetica, Arial, sans-serif;
            font-size: 12px;
            color: #dddddd;
            background-color: #0d0d0d;
            margin: 0;
            padding: 0;
        }

        /* Contenedor principal */
        .page-wrap {
            padding: 30px 45px;
        }

        /* Barra roja superior */
        .red-bar {
            height: 5px;
            background-color: #E10600;
        }

        /* Tablas generales */
        table {
            width: 100%;
            border-collapse: collapse;
        }
        td, th {
            vertical-align: top;
        }

        /* Colores de texto reutilizables */
        .text-white { color: #ffffff; }
        .text-red { color: #E10600; }
        .text-gray { color: #888888; }
        .text-light { color: #cccccc; }
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .bold { font-weight: bold; }
        .italic { font-style: italic; }

        /* Tamaños */
        .text-xs { font-size: 9px; }
        .text-sm { font-size: 11px; }
        .text-md { font-size: 13px; }
        .text-lg { font-size: 16px; }
        .text-xl { font-size: 22px; }
        .text-xxl { font-size: 28px; }

        /* Spacing helpers */
        .pt-5 { padding-top: 5px; }
        .pt-10 { padding-top: 10px; }
        .pt-15 { padding-top: 15px; }
        .pb-5 { padding-bottom: 5px; }
        .pb-10 { padding-bottom: 10px; }
        .pb-15 { padding-bottom: 15px; }
        .mb-20 { margin-bottom: 20px; }
        .mb-30 { margin-bottom: 30px; }

        /* Línea divisoria roja */
        .divider {
            border-bottom: 2px solid #E10600;
            margin-bottom: 25px;
        }

        /* Línea divisoria gris */
        .divider-gray {
            border-bottom: 1px solid #282828;
            margin-bottom: 20px;
        }
    </style>
</head>
<body>

<!-- BARRA ROJA SUPERIOR -->
<div class="red-bar"></div>

<div class="page-wrap">

    <!-- ============================================= -->
    <!--  CABECERA                                      -->
    <!-- ============================================= -->
    <table class="mb-30">
        <tr>
            <td style="width: 50%;">
                <table>
                    <tr>
                        @if(extension_loaded('gd') && $logo)
                        <td style="width: 60px; padding-right: 15px;">
                            <img src="{{ $logo }}" width="60" height="60">
                        </td>
                        @endif
                        <td>
                            <div class="text-xxl bold italic text-white" style="letter-spacing: 2px;">
                                TIER<span class="text-red">ONE</span>
                            </div>
                            <div class="text-xs text-gray" style="letter-spacing: 4px; text-transform: uppercase; padding-top: 5px;">
                                eSports & Gaming Platform
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
            <td style="width: 50%;" class="text-right text-sm text-gray" style="line-height: 1.6;">
                <span class="bold text-white text-md">{{ $empresa['name'] }}</span><br>
                CIF: {{ $empresa['id'] }}<br>
                {{ $empresa['address'] }}<br>
                {{ $empresa['email'] }}
            </td>
        </tr>
    </table>

    <!-- SEPARADOR ROJO -->
    <div class="divider"></div>

    <!-- ============================================= -->
    <!--  TÍTULO FACTURA                                -->
    <!-- ============================================= -->
    <table class="mb-20">
        <tr>
            <td>
                <span class="text-xl bold italic text-white" style="letter-spacing: 1px;">FACTURA</span>
            </td>
            <td class="text-right text-sm text-gray">
                Nº Factura: <span class="bold text-red text-md">{{ $orden->numero_orden }}</span>
            </td>
        </tr>
    </table>

    <!-- ============================================= -->
    <!--  BLOQUE DE FACTURACIÓN (EMISOR / RECEPTOR)     -->
    <!-- ============================================= -->
    <table class="mb-30" cellpadding="0" cellspacing="0">
        <tr>
            <!-- Columna izquierda: Cliente -->
            <td style="width: 50%; background-color: #161616; border-left: 3px solid #E10600; padding: 18px 20px;">
                <div class="text-xs bold text-red pb-5" style="letter-spacing: 2px; text-transform: uppercase; border-bottom: 1px solid #252525; padding-bottom: 8px; margin-bottom: 10px;">
                    FACTURADO A
                </div>
                <div class="bold text-white text-md pb-5">
                    {{ $orden->direccionEnvio?->nombre_completo ?? ($orden->usuario?->nombre . ' ' . $orden->usuario?->apellido) }}
                </div>
                <div class="text-sm text-gray" style="line-height: 1.7;">
                    @if($orden->direccionEnvio)
                        {{ $orden->direccionEnvio->direccion_linea1 }}<br>
                        {{ $orden->direccionEnvio->codigo_postal }}, {{ $orden->direccionEnvio->ciudad }}<br>
                        {{ $orden->direccionEnvio->pais }}
                        @if($orden->direccionEnvio->telefono)
                            <br>Tel: {{ $orden->direccionEnvio->telefono }}
                        @endif
                    @elseif($orden->usuario?->direccion)
                        {{ $orden->usuario->direccion }}<br>
                        {{ $orden->usuario->codigo_postal }}, {{ $orden->usuario->ciudad }}<br>
                        {{ $orden->usuario->provincia }}, {{ $orden->usuario->pais }}
                        @if($orden->usuario->telefono)
                            <br>Tel: {{ $orden->usuario->telefono }}
                        @endif
                    @else
                        {{ $orden->usuario?->email }}
                    @endif

                    @if($orden->usuario?->dni_cif)
                        <br><span class="bold">NIF/CIF:</span> {{ $orden->usuario->dni_cif }}
                    @endif
                </div>
            </td>

            <!-- Separador entre celdas -->
            <td style="width: 15px;"></td>

            <!-- Columna derecha: Detalles -->
            <td style="width: 50%; background-color: #161616; padding: 18px 20px;">
                <div class="text-xs bold text-red pb-5" style="letter-spacing: 2px; text-transform: uppercase; border-bottom: 1px solid #252525; padding-bottom: 8px; margin-bottom: 10px;">
                    DETALLES
                </div>
                <table>
                    <tr>
                        <td class="text-sm text-gray pb-5" style="width: 40%;">Fecha:</td>
                        <td class="text-sm text-white pb-5">{{ $orden->fecha_orden ? $orden->fecha_orden->format('d/m/Y') : now()->format('d/m/Y') }}</td>
                    </tr>
                    <tr>
                        <td class="text-sm text-gray pb-5">Estado:</td>
                        <td class="text-sm pb-5">
                            <span style="background-color: #2a1010; color: #E10600; padding: 2px 8px; font-size: 10px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">
                                {{ strtoupper($orden->estado) }}
                            </span>
                        </td>
                    </tr>
                    @if($orden->tracking_number)
                    <tr>
                        <td class="text-sm text-gray">Tracking:</td>
                        <td class="text-sm text-white">{{ $orden->tracking_number }}</td>
                    </tr>
                    @endif
                </table>
            </td>
        </tr>
    </table>

    <!-- ============================================= -->
    <!--  TABLA DE PRODUCTOS                            -->
    <!-- ============================================= -->
    <table class="mb-30" cellpadding="0" cellspacing="0">
        <!-- Cabecera -->
        <tr>
            <td style="width: 50%; background-color: #161616; border-bottom: 2px solid #E10600; padding: 10px 14px;">
                <span class="text-xs bold text-red" style="letter-spacing: 1.5px; text-transform: uppercase;">PRODUCTO</span>
            </td>
            <td style="width: 12%; background-color: #161616; border-bottom: 2px solid #E10600; padding: 10px 14px;" class="text-right">
                <span class="text-xs bold text-red" style="letter-spacing: 1.5px; text-transform: uppercase;">CANT.</span>
            </td>
            <td style="width: 19%; background-color: #161616; border-bottom: 2px solid #E10600; padding: 10px 14px;" class="text-right">
                <span class="text-xs bold text-red" style="letter-spacing: 1.5px; text-transform: uppercase;">P. UNITARIO</span>
            </td>
            <td style="width: 19%; background-color: #161616; border-bottom: 2px solid #E10600; padding: 10px 14px;" class="text-right">
                <span class="text-xs bold text-red" style="letter-spacing: 1.5px; text-transform: uppercase;">SUBTOTAL</span>
            </td>
        </tr>

        <!-- Filas de productos -->
        @foreach($orden->items as $index => $item)
        <tr>
            <td style="padding: 12px 14px; border-bottom: 1px solid #1e1e1e; {{ $index % 2 === 0 ? '' : 'background-color: #111111;' }}">
                <table style="width: 100%;">
                    <tr>
                        @php
                            $imagenAMostrar = $item->personalizacion_imagen_base64 ?? $item->producto_imagen_base64 ?? null;
                        @endphp
                        @if($imagenAMostrar)
                        <td style="width: 60px; padding-right: 12px;">
                            <img src="{{ $imagenAMostrar }}" width="60" height="60" style="border: 1px solid #333; border-radius: 4px; object-fit: contain; background-color: #1a1a1a;">
                        </td>
                        @endif
                        <td style="vertical-align: middle;">
                            <div class="bold text-white">{{ $item->producto->nombre ?? 'Producto Eliminado' }}</div>
                            @if($item->variante)
                                <div class="text-xs text-gray" style="margin-top: 4px;">Opción: {{ $item->variante->nombre }}</div>
                            @endif
                            @if($item->personalizacion_imagen)
                                <div class="text-xs text-red bold" style="margin-top: 4px;">
                                    <span style="border: 1px solid #E10600; padding: 1px 4px; border-radius: 2px; font-size: 8px;">PERSONALIZADO</span>
                                </div>
                            @endif
                        </td>
                    </tr>
                </table>
            </td>
            <td class="text-right text-light" style="padding: 12px 14px; border-bottom: 1px solid #1e1e1e; {{ $index % 2 === 0 ? '' : 'background-color: #111111;' }}">
                {{ $item->cantidad }}
            </td>
            <td class="text-right text-light" style="padding: 12px 14px; border-bottom: 1px solid #1e1e1e; {{ $index % 2 === 0 ? '' : 'background-color: #111111;' }}">
                {{ number_format($item->precio_unitario, 2, ',', '.') }} €
            </td>
            <td class="text-right text-white bold" style="padding: 12px 14px; border-bottom: 1px solid #1e1e1e; {{ $index % 2 === 0 ? '' : 'background-color: #111111;' }}">
                {{ number_format($item->subtotal, 2, ',', '.') }} €
            </td>
        </tr>
        @endforeach
    </table>

    <!-- ============================================= -->
    <!--  BLOQUE DE TOTALES                             -->
    <!-- ============================================= -->
    <table class="mb-30">
        <tr>
            <!-- Espacio vacío a la izquierda -->
            <td style="width: 55%;"></td>

            <!-- Caja de totales a la derecha -->
            <td style="width: 45%; background-color: #161616; border-top: 3px solid #E10600; padding: 15px 20px;">
                <table>
                    <tr>
                        <td class="text-sm text-gray" style="padding: 6px 0;">Subtotal</td>
                        <td class="text-sm text-light text-right" style="padding: 6px 0;">{{ number_format($orden->subtotal, 2, ',', '.') }} €</td>
                    </tr>
                    <tr>
                        <td class="text-sm text-gray" style="padding: 6px 0;">
                            IVA @if($orden->subtotal > 0) ({{ round(($orden->impuestos / $orden->subtotal) * 100) }}%) @endif
                        </td>
                        <td class="text-sm text-light text-right" style="padding: 6px 0;">{{ number_format($orden->impuestos, 2, ',', '.') }} €</td>
                    </tr>
                    @if($orden->costo_envio > 0)
                    <tr>
                        <td class="text-sm text-gray" style="padding: 6px 0;">Envío</td>
                        <td class="text-sm text-light text-right" style="padding: 6px 0;">{{ number_format($orden->costo_envio, 2, ',', '.') }} €</td>
                    </tr>
                    @endif
                    @if($orden->descuento > 0)
                    <tr>
                        <td class="text-sm text-red" style="padding: 6px 0;">Descuento</td>
                        <td class="text-sm text-red text-right" style="padding: 6px 0;">-{{ number_format($orden->descuento, 2, ',', '.') }} €</td>
                    </tr>
                    @endif
                    <!-- Separador -->
                    <tr>
                        <td colspan="2" style="border-bottom: 1px solid #333333; padding: 5px 0;"></td>
                    </tr>
                    <!-- Total final -->
                    <tr>
                        <td class="bold text-white text-lg" style="padding-top: 12px;">TOTAL</td>
                        <td class="bold text-white text-lg text-right" style="padding-top: 12px;">{{ number_format($orden->total, 2, ',', '.') }} €</td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

    <!-- ============================================= -->
    <!--  PIE DE PÁGINA                                 -->
    <!-- ============================================= -->
    <div class="divider-gray"></div>
    <div class="text-center text-xs text-gray italic" style="line-height: 1.8;">
        Gracias por confiar en <span class="bold text-red">TierOne</span>. Para consultas: {{ $empresa['email'] }}<br>
        Documento generado electrónicamente — No requiere firma.
    </div>

</div>

</body>
</html>
