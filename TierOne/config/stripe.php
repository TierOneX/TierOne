<?php

return [

    /*
     |--------------------------------------------------------------------------
     | Stripe Keys
     |--------------------------------------------------------------------------
     |
     | La clave pública (STRIPE_KEY) se usa en el frontend con Stripe.js.
     | La clave secreta (STRIPE_SECRET) solo se usa en el servidor.
     | El webhook secret se usa para verificar eventos de Stripe.
     |
     */

    'key' => env('STRIPE_KEY', ''),
    'secret' => env('STRIPE_SECRET', ''),
    'webhook_secret' => env('STRIPE_WEBHOOK_SECRET', ''),

    /*
     |--------------------------------------------------------------------------
     | Configuración de la Currency
     |--------------------------------------------------------------------------
     */
    'currency' => env('STRIPE_CURRENCY', 'eur'),

];
