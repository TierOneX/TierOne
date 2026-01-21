@echo off
REM ================================================
REM Script de Instalación Automatizada - TierOne
REM Windows Batch Script
REM ================================================

echo ==========================================
echo INSTALACION AUTOMATIZADA - TIERONE
echo ==========================================
echo.

REM Verificar que estamos en el directorio correcto
if not exist "composer.json" (
    echo ERROR: Este script debe ejecutarse desde la carpeta raiz del proyecto TierOne
    pause
    exit /b 1
)

echo [1/6] Verificando PHP y extensiones...
php -v >nul 2>&1
if errorlevel 1 (
    echo ERROR: PHP no está instalado o no está en el PATH
    pause
    exit /b 1
)

php -m | findstr mongodb >nul
if errorlevel 1 (
    echo ERROR: La extension MongoDB de PHP no está instalada
    echo Por favor, sigue la documentacion para instalar php_mongodb.dll
    pause
    exit /b 1
)

echo [OK] PHP y extensiones verificadas
echo.

echo [2/6] Instalando dependencias de Composer...
call composer install
if errorlevel 1 (
    echo ERROR: Error al instalar dependencias de Composer
    pause
    exit /b 1
)
echo [OK] Dependencias instaladas
echo.

echo [3/6] Configurando archivo .env...
if not exist ".env" (
    copy .env.example .env
    php artisan key:generate
    echo [OK] Archivo .env creado
) else (
    echo [SKIP] .env ya existe
)
echo.

echo [4/6] Creando base de datos MySQL...
echo IMPORTANTE: Asegurate de que MySQL está corriendo
echo.
echo Opciones:
echo 1. Ejecutar script SQL automaticamente (requiere credenciales MySQL)
echo 2. Crear manualmente via phpMyAdmin
echo.
set /p opcion="Selecciona una opcion (1 o 2): "

if "%opcion%"=="1" (
    set /p mysql_user="Usuario MySQL (por defecto 'root'): "
    if "%mysql_user%"=="" set mysql_user=root
    
    set /p mysql_pass="Contraseña MySQL (presiona Enter si no tiene): "
    
    echo Ejecutando script SQL...
    mysql -u %mysql_user% -p%mysql_pass% < database\setup_mysql.sql
    
    if errorlevel 1 (
        echo ERROR: No se pudo crear la base de datos
        echo Por favor, creala manualmente o via phpMyAdmin
        pause
    ) else (
        echo [OK] Base de datos creada exitosamente
    )
) else (
    echo [MANUAL] Por favor, crea la base de datos 'tierone_db' manualmente
    echo Usa phpMyAdmin o ejecuta: database\setup_mysql.sql
    pause
)
echo.

echo [5/6] Ejecutando migraciones...
php artisan migrate
if errorlevel 1 (
    echo ADVERTENCIA: Error al ejecutar migraciones
    echo Verifica que la base de datos MySQL está creada y configurada en .env
    pause
)
echo.

echo [6/6] Instalando dependencias NPM...
call npm install
if errorlevel 1 (
    echo ERROR: Error al instalar dependencias NPM
    pause
    exit /b 1
)
echo [OK] Dependencias NPM instaladas
echo.

echo ==========================================
echo INSTALACION COMPLETADA
echo ==========================================
echo.
echo Proximos pasos:
echo 1. Verifica tu archivo .env con las credenciales correctas
echo 2. Ejecuta: php artisan serve (en una terminal)
echo 3. Ejecuta: npm run dev (en otra terminal)
echo 4. Accede a: http://localhost:8000
echo.
pause
