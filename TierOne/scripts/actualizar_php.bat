@echo off
chcp 65001 > nul
color 0E
echo ================================================================
echo     ACTUALIZAR PHP 8.0 → 8.2 EN XAMPP
echo ================================================================
echo.
echo ESTE SCRIPT VA A:
echo 1. Respaldar tu PHP actual (C:\xampp\php → C:\xampp\php_8.0_backup)
echo 2. Mostrarte el enlace para descargar PHP 8.2
echo 3. Instruirte sobre cómo instalar PHP 8.2
echo.
echo ⚠️  IMPORTANTE: Cierra XAMPP antes de continuar.
echo.
set /p continuar="¿XAMPP está cerrado? (S/N): "
if /i not "%continuar%"=="S" (
    echo Proceso cancelado. Cierra XAMPP y vuelve a ejecutar este script.
    pause
    exit /b 0
)

echo.
echo [1/4] Verificando instalación de XAMPP...
echo ----------------------------------------------------------------
if not exist "C:\xampp\php" (
    color 0C
    echo ❌ ERROR: No se encontró C:\xampp\php
    echo    XAMPP no parece estar instalado en la ubicación estándar.
    pause
    exit /b 1
)
echo ✓ XAMPP encontrado
echo.

echo [2/4] Creando respaldo de PHP 8.0...
echo ----------------------------------------------------------------
if exist "C:\xampp\php_8.0_backup" (
    echo Ya existe un backup previo en C:\xampp\php_8.0_backup
    set /p sobrescribir="¿Sobrescribir el backup? (S/N): "
    if /i "%sobrescribir%"=="S" (
        rmdir /s /q "C:\xampp\php_8.0_backup"
    )
)

if not exist "C:\xampp\php_8.0_backup" (
    echo Creando backup...
    move "C:\xampp\php" "C:\xampp\php_8.0_backup"
    echo ✓ Backup creado en C:\xampp\php_8.0_backup
) else (
    echo Omitiendo backup (ya existe)
)
echo.

echo [3/4] INSTRUCCIONES PARA DESCARGAR PHP 8.2
echo ================================================================
echo.
echo 1. Abre tu navegador y ve a:
echo    https://windows.php.net/download/
echo.
echo 2. Descarga: "PHP 8.2.x VS16 x64 Thread Safe" (ZIP)
echo    Busca la versión más reciente de PHP 8.2
echo.
echo 3. Extrae el archivo ZIP en: C:\xampp\php
echo    (Crea la carpeta C:\xampp\php si no existe)
echo.
echo 4. Copia el archivo de configuración:
echo    C:\xampp\php_8.0_backup\php.ini → C:\xampp\php\php.ini
echo.
echo ================================================================
echo.
echo Presiona cualquier tecla cuando hayas completado los pasos...
pause > nul

echo.
echo [4/4] Verificando instalación...
echo ----------------------------------------------------------------
if not exist "C:\xampp\php\php.exe" (
    color 0C
    echo ❌ ERROR: No se encontró C:\xampp\php\php.exe
    echo    Asegúrate de haber extraído PHP correctamente.
    pause
    exit /b 1
)

C:\xampp\php\php.exe -v
if errorlevel 1 (
    color 0C
    echo ❌ ERROR: PHP no se ejecuta correctamente.
    pause
    exit /b 1
)

echo.
color 0A
echo ================================================================
echo     ✓ PHP ACTUALIZADO EXITOSAMENTE
echo ================================================================
echo.
echo PRÓXIMOS PASOS:
echo 1. Inicia XAMPP
echo 2. Ejecuta: setup_proyecto.bat
echo.
pause
