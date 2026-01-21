#!/bin/bash
# ================================================
# Script de Instalación Automatizada - TierOne
# Linux/Mac Bash Script
# ================================================

set -e  # Salir si hay algún error

echo "=========================================="
echo "INSTALACIÓN AUTOMATIZADA - TIERONE"
echo "=========================================="
echo ""

# Verificar que estamos en el directorio correcto
if [ ! -f "composer.json" ]; then
    echo "ERROR: Este script debe ejecutarse desde la carpeta raíz del proyecto TierOne"
    exit 1
fi

echo "[1/6] Verificando PHP y extensiones..."
if ! command -v php &> /dev/null; then
    echo "ERROR: PHP no está instalado"
    exit 1
fi

if ! php -m | grep -q mongodb; then
    echo "ERROR: La extensión MongoDB de PHP no está instalada"
    echo "Instala con: sudo pecl install mongodb"
    exit 1
fi

echo "[OK] PHP y extensiones verificadas"
echo ""

echo "[2/6] Instalando dependencias de Composer..."
composer install
echo "[OK] Dependencias instaladas"
echo ""

echo "[3/6] Configurando archivo .env..."
if [ ! -f ".env" ]; then
    cp .env.example .env
    php artisan key:generate
    echo "[OK] Archivo .env creado"
else
    echo "[SKIP] .env ya existe"
fi
echo ""

echo "[4/6] Creando base de datos MySQL..."
echo "IMPORTANTE: Asegúrate de que MySQL está corriendo"
echo ""
echo "Opciones:"
echo "1. Ejecutar script SQL automáticamente (requiere credenciales MySQL)"
echo "2. Crear manualmente"
echo ""
read -p "Selecciona una opción (1 o 2): " opcion

if [ "$opcion" == "1" ]; then
    read -p "Usuario MySQL (por defecto 'root'): " mysql_user
    mysql_user=${mysql_user:-root}
    
    read -sp "Contraseña MySQL: " mysql_pass
    echo ""
    
    echo "Ejecutando script SQL..."
    mysql -u "$mysql_user" -p"$mysql_pass" < database/setup_mysql.sql
    
    if [ $? -eq 0 ]; then
        echo "[OK] Base de datos creada exitosamente"
    else
        echo "ERROR: No se pudo crear la base de datos"
        echo "Por favor, créala manualmente"
    fi
else
    echo "[MANUAL] Por favor, crea la base de datos 'tierone_db' manualmente"
    echo "Ejecuta: mysql -u root -p < database/setup_mysql.sql"
fi
echo ""

echo "[5/6] Ejecutando migraciones..."
php artisan migrate || echo "ADVERTENCIA: Error al ejecutar migraciones. Verifica la configuración de la base de datos."
echo ""

echo "[6/6] Instalando dependencias NPM..."
npm install
echo "[OK] Dependencias NPM instaladas"
echo ""

echo "=========================================="
echo "INSTALACIÓN COMPLETADA"
echo "=========================================="
echo ""
echo "Próximos pasos:"
echo "1. Verifica tu archivo .env con las credenciales correctas"
echo "2. Ejecuta: php artisan serve (en una terminal)"
echo "3. Ejecuta: npm run dev (en otra terminal)"
echo "4. Accede a: http://localhost:8000"
echo ""
