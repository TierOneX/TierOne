#!/bin/bash

# Colores para la terminal
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

clear
echo -e "${YELLOW}===================================================${NC}"
echo -e "${YELLOW}   TierOne Platform - Setup Automatico (Linux/Mac)  ${NC}"
echo -e "${YELLOW}===================================================${NC}"
echo ""

# Ir a la raiz del proyecto (un nivel arriba del script)
cd "$(dirname "$0")/.."

# Verificar si estamos en el directorio correcto
if [ ! -d "TierOne" ]; then
    echo -e "${RED}[ERROR] No se encuentra la carpeta 'TierOne'.${NC}"
    echo "Asegurate de que el script este dentro de la carpeta 'scripts'."
    exit 1
fi

# Verificar dependencias basicas
echo -e "${GREEN}[*] Verificando dependencias del sistema...${NC}"

command -v php >/dev/null 2>&1 || { echo -e "${RED}[ERROR] PHP no instalado.${NC}"; exit 1; }
echo -e "[OK] PHP detectado."

command -v composer >/dev/null 2>&1 || { echo -e "${RED}[ERROR] Composer no instalado.${NC}"; exit 1; }
echo -e "[OK] Composer detectado."

command -v npm >/dev/null 2>&1 || { echo -e "${RED}[ERROR] NPM/Node.js no instalado.${NC}"; exit 1; }
echo -e "[OK] NPM detectado."

echo ""
echo -e "${GREEN}[*] Entrando en la carpeta del proyecto...${NC}"
cd TierOne

# Configurar .env
if [ ! -f ".env" ]; then
    echo -e "${GREEN}[*] Creando archivo .env desde .env.example...${NC}"
    cp .env.example .env
    echo -e "[OK] .env creado."
else
    echo -e "${YELLOW}[!] El archivo .env ya existe, saltando.${NC}"
fi

# Instalar dependencias PHP
echo -e "${GREEN}[*] Instalando dependencias de PHP (Composer)...${NC}"
composer install

# Generar clave de aplicacion
echo -e "${GREEN}[*] Generando clave de aplicacion de Laravel...${NC}"
php artisan key:generate

# Instalar dependencias JS
echo -e "${GREEN}[*] Instalando dependencias de JS (NPM)...${NC}"
npm install

# Intentar crear la base de datos
echo -e "${GREEN}[*] Configurando Base de Datos MySQL...${NC}"
if command -v mysql >/dev/null 2>&1; then
    echo -e "${GREEN}[*] Intentando crear la base de datos 'tierone_db' (usuario root)...${NC}"
    mysql -u root -e "CREATE DATABASE IF NOT EXISTS tierone_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
    if [ $? -eq 0 ]; then
        echo -e "[OK] Base de datos lista."
    else
        echo -e "${YELLOW}[!] No se pudo crear automaticamente. Creala manualmente en PHPMyAdmin.${NC}"
    fi
else
    echo -e "${YELLOW}[!] Comando 'mysql' no encontrado. Crea la BD 'tierone_db' manualmente.${NC}"
fi

# Ejecutar migraciones y seeders
echo -e "${GREEN}[*] Ejecutando migraciones y cargando datos de prueba...${NC}"
php artisan migrate:fresh --seed --no-interaction

# Crear enlace simbolico de almacenamiento
echo -e "${GREEN}[*] Creando enlace simbolico de almacenamiento (storage:link)...${NC}"
php artisan storage:link

# Sincronizar juegos con IGDB/Twitch
echo -e "${GREEN}[*] Sincronizando juegos con metadatos externos (IGDB/Twitch)...${NC}"
php artisan games:sync --all

# Compilar assets
echo -e "${GREEN}[*] Compilando assets frontend (Production Build)...${NC}"
npm run build

echo ""
echo -e "${YELLOW}===================================================${NC}"
echo -e "${GREEN}    INSTALACION COMPLETADA CON EXITO${NC}"
echo -e "${YELLOW}===================================================${NC}"
echo ""
echo "Para empezar a trabajar:"
echo "1. Ejecuta: php artisan serve"
echo "2. Ejecuta: npm run dev"
echo ""
