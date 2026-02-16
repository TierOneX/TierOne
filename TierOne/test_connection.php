<?php
try {
    $pdo = new PDO('mysql:host=127.0.0.1;dbname=tierone_db', 'root', '');
    echo "✅ Conexión exitosa a tierone_db\n";
    echo "✅ MySQL está corriendo\n";
    echo "✅ La base de datos 'tierone_db' existe\n";
    echo "✅ Todo listo para crear migraciones\n";
} catch (PDOException $e) {
    echo "❌ Error de conexión: " . $e->getMessage() . "\n";
}
