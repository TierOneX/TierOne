@echo off
chcp 65001 > nul
color 0A
echo ================================================================
echo     SETUP AUTOMÁTICO - PROYECTO TIERONE
echo ================================================================
echo.

:: Cambiar al directorio del proyecto
cd /d "%~dp0"

echo [1/6] Verificando versión de PHP...
echo ----------------------------------------------------------------
php -v
echo.

:: Verificar si PHP existe
php -v > nul 2>&1
if errorlevel 1 (
    color 0C
    echo ❌ ERROR: PHP no está instalado o no está en el PATH
    echo.
    echo Por favor, asegúrate de tener XAMPP instalado y PHP en el PATH.
    pause
    exit /b 1
)

echo [2/6] Verificando conexión con la base de datos...
echo ----------------------------------------------------------------
php artisan db:show
if errorlevel 1 (
    echo.
    echo ⚠️  No se pudo conectar a la base de datos.
    echo    Asegúrate de que:
    echo    - MySQL está ejecutándose en XAMPP
    echo    - La base de datos 'tierone_db' existe en phpMyAdmin
    echo.
    set /p continuar="¿Deseas continuar de todas formas? (S/N): "
    if /i not "%continuar%"=="S" (
        echo Proceso cancelado.
        pause
        exit /b 1
    )
)
echo.

echo [3/6] Limpiando caché de configuración...
echo ----------------------------------------------------------------
php artisan config:clear
php artisan cache:clear
php artisan route:clear
echo ✓ Caché limpiada
echo.

echo [4/6] Ejecutando migraciones (fresh)...
echo ----------------------------------------------------------------
echo ⚠️  ATENCIÓN: Esto eliminará TODAS las tablas existentes y las recreará.
set /p confirmar="¿Estás seguro? (S/N): "
if /i not "%confirmar%"=="S" (
    echo Migraciones canceladas.
    goto seeders_option
)

php artisan migrate:fresh --force
if errorlevel 1 (
    color 0C
    echo.
    echo ❌ ERROR: Las migraciones fallaron.
    echo.
    echo POSIBLES CAUSAS:
    echo 1. PHP 8.0 no es compatible - Necesitas PHP 8.2+
    echo 2. La base de datos 'tierone_db' no existe
    echo 3. MySQL no está ejecutándose
    echo.
    echo SOLUCIÓN RÁPIDA PARA PHP:
    echo 1. Descarga PHP 8.2+ desde: https://windows.php.net/download/
    echo 2. Extrae en C:\xampp\php (renombra la carpeta actual a php_old)
    echo 3. Ejecuta este script de nuevo
    echo.
    pause
    exit /b 1
)
echo ✓ Migraciones completadas exitosamente
echo.

:seeders_option
echo [5/6] ¿Deseas ejecutar los seeders (datos de prueba)?
echo ----------------------------------------------------------------
set /p seeders="Ejecutar seeders? (S/N): "
if /i not "%seeders%"=="S" (
    echo Seeders omitidos.
    goto final
)

echo Ejecutando seeders...
php artisan db:seed --force
if errorlevel 1 (
    color 0E
    echo ⚠️  Los seeders fallaron, pero las migraciones se completaron.
) else (
    echo ✓ Seeders completados exitosamente
)
echo.

:final
echo [6/6] Verificando el estado final...
echo ----------------------------------------------------------------
php artisan migrate:status
echo.

color 0A
echo ================================================================
echo     ✓ SETUP COMPLETADO
echo ================================================================
echo.
echo El proyecto está listo para usar.
echo.
echo PRÓXIMOS PASOS:
echo - Inicia el servidor: php artisan serve
echo - Accede a: http://localhost:8000
echo - Revisa las tablas en phpMyAdmin
echo.

pause
