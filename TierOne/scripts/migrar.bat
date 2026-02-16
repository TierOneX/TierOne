@echo off
chcp 65001 > nul
color 0A
echo ================================================================
echo     MIGRACIONES RÁPIDAS - TIERONE
echo ================================================================
echo.

cd /d "%~dp0"

echo ⚠️  Este script eliminará TODAS las tablas y las recreará.
echo.
set /p confirmar="¿Continuar? (S/N): "
if /i not "%confirmar%"=="S" (
    echo Cancelado.
    pause
    exit /b 0
)

echo.
echo Ejecutando migraciones...
php artisan migrate:fresh --seed --force

if errorlevel 1 (
    color 0C
    echo.
    echo ❌ ERROR: Revisa los mensajes anteriores.
    pause
    exit /b 1
) else (
    color 0A
    echo.
    echo ✓ ¡Completado! Tablas creadas y datos insertados.
    echo.
    php artisan migrate:status
)

echo.
pause
