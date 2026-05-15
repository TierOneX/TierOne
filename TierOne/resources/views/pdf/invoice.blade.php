<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Factura {{ $orden->numero_orden }}</title>
    <style>
        body {
            font-family: Helvetica, Arial, sans-serif;
            font-size: 11px;
            color: #dddddd;
            background-color: #0d0d0d;
            margin: 0;
            padding: 0;
        }

        /* Contenedor principal */
        .page-wrap {
            padding: 20px 40px;
        }

        /* Barra roja superior */
        .red-bar {
            height: 4px;
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
        .text-xs { font-size: 8px; }
        .text-sm { font-size: 10px; }
        .text-md { font-size: 12px; }
        .text-lg { font-size: 14px; }
        .text-xl { font-size: 20px; }
        .text-xxl { font-size: 26px; }

        /* Spacing helpers */
        .pt-5 { padding-top: 5px; }
        .pt-10 { padding-top: 10px; }
        .pb-5 { padding-bottom: 5px; }
        .pb-10 { padding-bottom: 10px; }
        .mb-20 { margin-bottom: 20px; }
        .mb-30 { margin-bottom: 30px; }

        /* Línea divisoria roja */
        .divider {
            border-bottom: 2px solid #E10600;
            margin-bottom: 20px;
        }

        /* Línea divisoria gris */
        .divider-gray {
            border-bottom: 1px solid #282828;
            margin-bottom: 15px;
        }

        /* Badge de tipo de factura */
        .tipo-badge {
            display: inline-block;
            background-color: #1a0505;
            border: 1px solid #E10600;
            color: #E10600;
            font-size: 8px;
            font-weight: bold;
            letter-spacing: 2px;
            text-transform: uppercase;
            padding: 2px 8px;
            margin-left: 8px;
        }

        .data-block {
            background-color: #161616;
            padding: 15px;
            border-left: 2px solid #E10600;
        }

        .data-block-title {
            text-xs bold text-red pb-5;
            letter-spacing: 1.5px;
            text-transform: uppercase;
            border-bottom: 1px solid #252525;
            padding-bottom: 5px;
            margin-bottom: 8px;
        }
    </style>
</head>
<body>

<div class="red-bar"></div>

<div class="page-wrap">

    <!-- CABECERA -->
    <table class="mb-20">
        <tr>
            <td style="width: 50%;">
                <table>
                    <tr>
                        @if($logo)
                        <td style="width: 50px; padding-right: 12px;">
                            <img src="{{ $logo }}" width="50" height="50">
                        </td>
                        @endif
                        <td>
                            <div class="text-xl bold italic text-white" style="letter-spacing: 1.5px;">
                                TIER<span class="text-red">ONE</span>
                            </div>
                            <div class="text-xs text-gray" style="letter-spacing: 3px; text-transform: uppercase;">
                                eSports Platform
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
            <td style="width: 50%; text-align: right;" class="text-sm text-gray">
                <span class="bold text-white">{{ $empresa['nombre'] }}</span><br>
                CIF: {{ $empresa['cif'] }}<br>
                {{ $empresa['direccion'] }}<br>
                {{ $empresa['email'] }}
            </td>
        </tr>
    </table>

    <div class="divider"></div>

    <!-- TÍTULO FACTURA -->
    <table class="mb-20">
        <tr>
            <td>
                <span class="text-lg bold italic text-white">FACTURA</span>
                <span class="tipo-badge">{{ $etiqueta_tipo }}</span>
            </td>
            <td class="text-right text-sm text-gray">
                Nº Factura: <span class="bold text-red">{{ $orden->numero_orden }}</span>
            </td>
        </tr>
    </table>

    <!-- BLOQUE DE CLIENTE Y ENVÍO -->
    <table class="mb-30">
        <tr>
            <!-- FACTURADO A -->
            <td style="width: 48%;">
                <div class="data-block">
                    <div style="color: #E10600; font-size: 8px; font-weight: bold; letter-spacing: 1.5px; text-transform: uppercase; border-bottom: 1px solid #252525; padding-bottom: 5px; margin-bottom: 8px;">
                        FACTURADO A
                    </div>
                    <div class="bold text-white text-md">{{ $cliente_nombre }}</div>
                    <div class="text-sm text-gray" style="line-height: 1.6; margin-top: 5px;">
                        Email: {{ $orden->usuario->email }}<br>
                        @if($orden->usuario->dni_cif)
                            NIF/CIF: <span class="text-white bold">{{ $orden->usuario->dni_cif }}</span><br>
                        @endif
                        ID Usuario: #{{ $orden->id_usuario }}
                    </div>
                </div>
            </td>

            <td style="width: 4%;"></td>

            <!-- ENVIADO A / DETALLES -->
            <td style="width: 48%;">
                <div class="data-block">
                    @if($orden->direccionEnvio && $orden->id_direccion_envio && $tipo_factura === 'merchandising')
                        <div style="color: #E10600; font-size: 8px; font-weight: bold; letter-spacing: 1.5px; text-transform: uppercase; border-bottom: 1px solid #252525; padding-bottom: 5px; margin-bottom: 8px;">
                            DIRECCIÓN DE ENVÍO
                        </div>
                        <div class="bold text-white text-md">{{ $orden->direccionEnvio->nombre_completo }}</div>
                        <div class="text-sm text-gray" style="line-height: 1.6; margin-top: 5px;">
                            {{ $orden->direccionEnvio->direccion_linea1 }}<br>
                            {{ $orden->direccionEnvio->codigo_postal }}, {{ $orden->direccionEnvio->ciudad }}<br>
                            {{ $orden->direccionEnvio->estado_provincia ? $orden->direccionEnvio->estado_provincia . ', ' : '' }}{{ $orden->direccionEnvio->pais }}
                        </div>
                    @else
                        <div style="color: #E10600; font-size: 8px; font-weight: bold; letter-spacing: 1.5px; text-transform: uppercase; border-bottom: 1px solid #252525; padding-bottom: 5px; margin-bottom: 8px;">
                            DETALLES DEL PEDIDO
                        </div>
                        <div class="text-sm text-gray" style="line-height: 1.6;">
                            Fecha: <span class="text-white">{{ $orden->fecha_orden ? $orden->fecha_orden->format('d/m/Y') : now()->format('d/m/Y') }}</span><br>
                            Estado: <span class="text-red bold">{{ strtoupper($orden->estado) }}</span><br>
                            Metodo: Stripe Checkout<br>
                            @if($tipo_factura !== 'merchandising')
                                <span class="italic text-xs">Servicio digital - Sin envío físico</span>
                            @endif
                        </div>
                    @endif
                </div>
            </td>
        </tr>
    </table>

    <!-- TABLA DE PRODUCTOS -->
    <table class="mb-30">
        <thead style="background-color: #161616; border-bottom: 2px solid #E10600;">
            <tr>
                <th style="text-align: left; padding: 10px; color: #E10600; font-size: 8px; letter-spacing: 1.5px;">PRODUCTO</th>
                <th style="text-align: right; padding: 10px; color: #E10600; font-size: 8px; letter-spacing: 1.5px; width: 60px;">CANT.</th>
                <th style="text-align: right; padding: 10px; color: #E10600; font-size: 8px; letter-spacing: 1.5px; width: 100px;">P. UNITARIO</th>
                <th style="text-align: right; padding: 10px; color: #E10600; font-size: 8px; letter-spacing: 1.5px; width: 100px;">SUBTOTAL</th>
            </tr>
        </thead>
        <tbody>
            @foreach($items_procesados as $index => $item)
            <tr style="border-bottom: 1px solid #1e1e1e; {{ $index % 2 === 0 ? '' : 'background-color: #0f0f0f;' }}">
                <td style="padding: 12px 10px;">
                    <table style="width: auto;">
                        <tr>
                            @if(!empty($item['imagen_base64']))
                            <td style="padding-right: 12px;">
                                <img src="{{ $item['imagen_base64'] }}" width="45" height="45" style="border-radius: 3px; border: 1px solid #333;">
                            </td>
                            @endif
                            <td>
                                <div class="bold text-white">{{ $item['nombre'] }}</div>
                                @if(!empty($item['variante_nombre']))
                                    <div class="text-xs text-gray" style="margin-top: 3px;">Opción: {{ $item['variante_nombre'] }}</div>
                                @endif
                                @if(!empty($item['es_personalizado']))
                                    <div class="text-xs text-red bold" style="margin-top: 3px; border: 1px solid #E10600; display: inline-block; padding: 1px 4px; border-radius: 2px; font-size: 7px;">PERSONALIZADO</div>
                                @endif
                            </td>
                        </tr>
                    </table>
                </td>
                <td style="padding: 12px 10px; text-align: right;" class="text-white">{{ $item['cantidad'] }}</td>
                <td style="padding: 12px 10px; text-align: right;" class="text-gray">{{ number_format($item['precio_unitario'], 2, ',', '.') }} €</td>
                <td style="padding: 12px 10px; text-align: right;" class="bold text-white">{{ number_format($item['subtotal'], 2, ',', '.') }} €</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <!-- TOTALES -->
    <table class="mb-30">
        <tr>
            <td style="width: 60%;"></td>
            <td style="width: 40%; background-color: #161616; border-top: 2px solid #E10600; padding: 15px;">
                <table style="width: 100%;">
                    <tr>
                        <td class="text-gray pb-5">Subtotal</td>
                        <td class="text-white text-right pb-5">{{ number_format($orden->subtotal, 2, ',', '.') }} €</td>
                    </tr>
                    @if($orden->impuestos > 0)
                    <tr>
                        <td class="text-gray pb-5">IVA (21%)</td>
                        <td class="text-white text-right pb-5">{{ number_format($orden->impuestos, 2, ',', '.') }} €</td>
                    </tr>
                    @else
                    <tr>
                        <td class="text-gray pb-5">IVA</td>
                        <td class="text-white text-right pb-5">N/A</td>
                    </tr>
                    @endif
                    @if($orden->costo_envio > 0)
                    <tr>
                        <td class="text-gray pb-5">Envío</td>
                        <td class="text-white text-right pb-5">{{ number_format($orden->costo_envio, 2, ',', '.') }} €</td>
                    </tr>
                    @endif
                    <tr>
                        <td colspan="2" style="border-bottom: 1px solid #282828; margin: 8px 0; padding-top: 8px;"></td>
                    </tr>
                    <tr>
                        <td class="bold text-white text-lg" style="padding-top: 10px;">TOTAL</td>
                        <td class="bold text-red text-lg text-right" style="padding-top: 10px;">{{ number_format($orden->total, 2, ',', '.') }} €</td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

    <!-- PIE -->
    <div class="divider-gray"></div>
    <div class="text-center text-xs text-gray italic">
        Gracias por confiar en <span class="bold text-red">TierOne</span>.<br>
        Este documento es una factura legal generada automáticamente.
    </div>

</div>

</body>
</html>
