@echo off
setlocal enabledelayedexpansion

:: Colores (simulados con escape codes si el terminal lo soporta)
set "green=[32m"
set "red=[31m"
set "yellow=[33m"
set "blue=[34m"
set "reset=[0m"

cls
echo ===================================================
echo    TierOne Platform - Setup Automatico
echo ===================================================
echo.

:: Ir a la raiz del proyecto (un nivel arriba de donde esta el script)
cd /d "%~dp0.."

:: Verificar si estamos en el directorio correcto
if not exist "TierOne" (
    echo [ERROR] No se encuentra la carpeta 'TierOne'. 
    echo Asegurate de que el script este dentro de la carpeta 'scripts'.
    pause
    exit /b 1
)

:: Verificar dependencias basicas
echo [*] Verificando dependencias del sistema...

where php >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] PHP no encontrado. Asegurate de tener XAMPP instalado y PHP en el PATH.
    pause
    exit /b 1
)
echo [OK] PHP detectado.

where composer >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Composer no encontrado. Por favor instalalo desde https://getcomposer.org/
    pause
    exit /b 1
)
echo [OK] Composer detectado.

where npm >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js/NPM no encontrado. Por favor instalalo desde https://nodejs.org/
    pause
    exit /b 1
)
echo [OK] NPM detectado.

echo.
echo [*] Entrando en la carpeta del proyecto...
cd TierOne

:: Configurar .env
if not exist ".env" (
    echo [*] Configurando archivo .env...
    copy .env.example .env
    echo [OK] .env creado.
) else (
    echo [!] El archivo .env ya existe, saltando este paso.
)

:: Instalar dependencias PHP
echo [*] Instalando dependencias de PHP (Composer)...
echo Esto puede tardar unos minutos...
call composer install

:: Generar clave de aplicacion
echo [*] Generando clave de aplicacion de Laravel...
php artisan key:generate

:: Instalar dependencias JS
echo [*] Instalando dependencias de JS (NPM)...
call npm install

:: Intentar crear la base de datos
echo [*] Configurando Base de Datos MySQL...
where mysql >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [*] Intentando crear la base de datos 'tierone_db' (usuario root)...
    mysql -u root -e "CREATE DATABASE IF NOT EXISTS tierone_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
    if %ERRORLEVEL% EQU 0 (
        echo [OK] Base de datos lista.
    ) else (
        echo [!] No se pudo crear la base de datos automaticamente. 
        echo Por favor, crea 'tierone_db' manualmente en PHPMyAdmin.
    )
) else (
    echo [!] Comando 'mysql' no encontrado en el PATH. 
    echo Crea la base de datos 'tierone_db' manualmente.
)

:: Ejecutar migraciones y seeders
echo [*] Ejecutando migraciones y cargando datos de prueba...
php artisan migrate:fresh --seed --no-interaction

:: Compilar assets
echo [*] Compilando assets frontend (Production Build)...
call npm run build

echo.
echo ===================================================
echo    INSTALACION COMPLETADA CON EXITO
echo ===================================================
echo.
echo Para empezar a trabajar:
echo 1. Ejecuta: php artisan serve (en una terminal)
echo 2. Ejecuta: npm run dev     (en otra terminal para HMR)
echo.
echo URL Local: http://127.0.0.1:8000
echo.
pause
