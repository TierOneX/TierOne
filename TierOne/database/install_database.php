<?php

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Script de instalación de base de datos para TierOne
 * Ejecutar con: php database/install_database.php
 */

require __DIR__ . '/../vendor/autoload.php';

$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "\n==========================================\n";
echo "CREANDO BASE DE DATOS MYSQL - TIERONE\n";
echo "==========================================\n\n";

try {
    // Intentar conectar a MySQL sin especificar base de datos
    $pdo = new PDO(
        'mysql:host=' . env('DB_HOST', '127.0.0.1') . ';port=' . env('DB_PORT', '3306'),
        env('DB_USERNAME', 'root'),
        env('DB_PASSWORD', ''),
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );

    $dbName = env('DB_DATABASE', 'tierone_db');
    
    echo "[1/2] Creando base de datos '$dbName'...\n";
    
    // Crear base de datos si no existe
    $sql = "CREATE DATABASE IF NOT EXISTS `$dbName` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci";
    $pdo->exec($sql);
    
    echo "✓ Base de datos '$dbName' creada exitosamente!\n\n";
    
    echo "[2/2] Verificando conexión a la base de datos...\n";
    
    // Verificar que Laravel puede conectarse
    DB::connection()->getPdo();
    
    echo "✓ Conexión a MySQL verificada!\n\n";
    
    echo "==========================================\n";
    echo "COMPLETADO EXITOSAMENTE\n";
    echo "==========================================\n\n";
    echo "Próximos pasos:\n";
    echo "1. Ejecuta: php artisan migrate\n";
    echo "2. Ejecuta: php artisan db:seed (opcional)\n\n";
    
    exit(0);
    
} catch (PDOException $e) {
    echo "\n❌ ERROR: No se pudo conectar a MySQL\n";
    echo "Mensaje: " . $e->getMessage() . "\n\n";
    echo "Verifica que:\n";
    echo "- MySQL está corriendo (inicia desde XAMPP Control Panel)\n";
    echo "- Las credenciales en .env son correctas\n";
    echo "- DB_HOST=" . env('DB_HOST', '127.0.0.1') . "\n";
    echo "- DB_PORT=" . env('DB_PORT', '3306') . "\n";
    echo "- DB_USERNAME=" . env('DB_USERNAME', 'root') . "\n\n";
    
    exit(1);
} catch (Exception $e) {
    echo "\n❌ ERROR INESPERADO:\n";
    echo $e->getMessage() . "\n\n";
    exit(1);
}
