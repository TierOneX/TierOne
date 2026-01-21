@echo off
REM Script para crear todas las migraciones de TierOne

echo Creando migraciones restantes del modulo E-commerce...
call php artisan make:migration create_direcciones_envio_table
call php artisan make:migration create_ordenes_table
call php artisan make:migration create_items_orden_table
call php artisan make:migration create_pagos_table
call php artisan make:migration create_comunicaciones_proveedor_table
call php artisan make:migration create_reviews_table

echo Creando migraciones del modulo Torneos...
call php artisan make:migration create_juegos_table
call php artisan make:migration create_integraciones_api_table
call php artisan make:migration create_partidas_table
call php artisan make:migration create_participantes_partida_table
call php artisan make:migration create_resultados_partida_table
call php artisan make:migration create_reportes_table
call php artisan make:migration create_torneos_table
call php artisan make:migration create_sponsors_torneo_table
call php artisan make:migration create_inscripciones_torneo_table
call php artisan make:migration create_partidas_torneo_table
call php artisan make:migration create_premios_torneo_table

echo Creando migraciones del modulo Financiero...
call php artisan make:migration create_transacciones_table
call php artisan make:migration create_retiros_table

echo Todas las migraciones creadas exitosamente!
pause
