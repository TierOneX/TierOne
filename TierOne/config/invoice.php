<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Datos de la Empresa (Emisor de la Factura)
    |--------------------------------------------------------------------------
    |
    | Aquí se definen los datos que aparecerán como emisor en las facturas PDF.
    |
    */

    'seller' => [
        'name'          => env('INVOICE_SELLER_NAME', 'TierOne eSports SL'),
        'id'            => env('INVOICE_SELLER_ID', 'B-12345678'), // CIF/NIF
        'address'       => env('INVOICE_SELLER_ADDRESS', 'Calle Falsa 123, Madrid, España'),
        'city'          => env('INVOICE_SELLER_CITY', 'Madrid'),
        'postal_code'   => env('INVOICE_SELLER_POSTAL_CODE', '28001'),
        'country'       => env('INVOICE_SELLER_COUNTRY', 'España'),
        'phone'         => env('INVOICE_SELLER_PHONE', '+34 900 000 000'),
        'email'         => env('INVOICE_SELLER_EMAIL', 'facturacion@tierone.com'),
        'website'       => env('INVOICE_SELLER_WEBSITE', 'www.tierone.com'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Configuración del Logo
    |--------------------------------------------------------------------------
    */
    'logo_path' => public_path('images/Logo.png'),

    /*
    |--------------------------------------------------------------------------
    | Opciones de PDF
    |--------------------------------------------------------------------------
    */
    'pdf_options' => [
        'isHtml5ParserEnabled' => true,
        'isRemoteEnabled'      => true,
        'paper'                => 'a4',
        'orientation'          => 'portrait',
    ],
];
