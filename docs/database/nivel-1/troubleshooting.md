# 🔧 Troubleshooting - Nivel 1

Guía de solución de problemas comunes encontrados durante la implementación del Nivel 1 de Base de Datos.

---

## 🚨 Problemas Comunes

### 1. Extensión intl no habilitada

**Síntoma:**
```
RuntimeException: The "intl" PHP extension is required to use the [format] method.
```

**Causa:**  
La extensión `intl` de PHP no está habilitada en XAMPP.

**Solución paso a paso:**

1. **Localizar php.ini:**
   ```bash
   php --ini
   ```
   Normalmente está en: `C:\xampp\php\php.ini`

2. **Editar php.ini:**
   - Abrir el archivo con un editor de texto (como Administrador)
   - Buscar: `;extension=intl`
   - Cambiar a: `extension=intl` (quitar el `;`)

3. **Guardar y reiniciar:**
   - Guardar el archivo
   - Abrir Panel de Control de XAMPP
   - Detener Apache
   - Iniciar Apache

4. **Verificar:**
   ```bash
   php -m | findstr intl
   ```
   Debe mostrar `intl` en la lista

**Estado:** ✅ Resuelto

---

### 2. Comando db:show no funciona

**Síntoma:**
```
SQLSTATE[42S02]: Base table or view not found: 1146 
Table 'performance_schema.session_status' doesn't exist
```

**Causa:**  
El comando `php artisan db:show` intenta acceder a tablas del sistema de MySQL (`performance_schema`) que no existen en versiones antiguas de XAMPP.

**Solución:**

**NO usar** `php artisan db:show`

**Usar alternativas:**

```bash
# ✅ Funciona - Ver estructura de tabla
php artisan db:table users
php artisan db:table juegos

# ✅ Funciona - Usar tinker
php artisan tinker
DB::table('users')->get();
exit

# ✅ Funciona - phpMyAdmin
# Abrir http://localhost/phpmyadmin
```

**Estado:** ⚠️ Limitación de XAMPP (usar alternativas)

---

### 3. Error "Could not open input file: artisan"

**Síntoma:**
```
Could not open input file: artisan
```

**Causa:**  
Estás ejecutando comandos desde el directorio incorrecto.

**Solución:**

```bash
# Navegar al directorio correcto
cd c:\Users\Fran\Desktop\TierOne\TierOne

# Ahora ejecutar comandos
php artisan migrate
php artisan db:seed
```

**Verificar directorio actual:**
```bash
# Debe mostrar la ruta del proyecto Laravel
pwd
# o
cd
```

**Estado:** ✅ Resuelto

---

### 4. Error de conexión a MySQL

**Síntoma:**
```
SQLSTATE[HY000] [2002] No se puede establecer una conexión
```

**Causa:**  
MySQL no está corriendo o la configuración del `.env` es incorrecta.

**Solución:**

1. **Verificar que MySQL está corriendo:**
   - Abrir Panel de Control de XAMPP
   - Verificar que MySQL tiene luz verde
   - Si no, hacer clic en "Start"

2. **Verificar configuración .env:**
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=tierone_db
   DB_USERNAME=root
   DB_PASSWORD=
   ```

3. **Verificar que la base de datos existe:**
   - Abrir http://localhost/phpmyadmin
   - Verificar que existe `tierone_db`
   - Si no existe, crearla

4. **Limpiar caché de configuración:**
   ```bash
   php artisan config:clear
   php artisan cache:clear
   ```

**Estado:** ✅ Resuelto

---

### 5. Migraciones fallan con error de sintaxis

**Síntoma:**
```
Syntax error or access violation: 1071 Specified key was too long
```

**Causa:**  
Problema con índices en versiones antiguas de MySQL.

**Solución:**

1. **Editar `AppServiceProvider.php`:**
   ```php
   // app/Providers/AppServiceProvider.php
   use Illuminate\Support\Facades\Schema;

   public function boot(): void
   {
       Schema::defaultStringLength(191);
   }
   ```

2. **Ejecutar migraciones de nuevo:**
   ```bash
   php artisan migrate:fresh
   ```

**Estado:** ℹ️ Preventivo (no ocurrió en este proyecto)

---

### 6. Seeders no insertan datos

**Síntoma:**  
Los seeders se ejecutan sin errores pero no hay datos en las tablas.

**Causa posible:**

1. Las migraciones no se ejecutaron
2. Error silencioso en el seeder
3. DatabaseSeeder no llama a los seeders

**Solución:**

1. **Verificar que las migraciones se ejecutaron:**
   ```bash
   php artisan migrate:status
   ```

2. **Verificar DatabaseSeeder.php:**
   ```php
   $this->call([
       UserSeeder::class,
       ProveedorSeeder::class,
       JuegoSeeder::class,
       CategoriaSeeder::class,
   ]);
   ```

3. **Ejecutar con verbose:**
   ```bash
   php artisan db:seed --verbose
   ```

4. **Verificar datos:**
   ```bash
   php artisan tinker
   DB::table('users')->count();
   exit
   ```

**Estado:** ✅ Resuelto

---

### 7. Puerto 3306 ya está en uso

**Síntoma:**
```
Port 3306 is already in use
```

**Causa:**  
Otra instancia de MySQL está corriendo (por ejemplo, MySQL instalado fuera de XAMPP).

**Solución:**

**Opción 1 - Detener otro MySQL:**
```bash
# En PowerShell como Administrador
net stop MySQL80
```

**Opción 2 - Cambiar puerto en XAMPP:**
1. Abrir Panel de Control de XAMPP
2. Clic en "Config" de MySQL
3. Editar `my.ini`
4. Cambiar puerto a `3307`
5. Actualizar `.env`:
   ```env
   DB_PORT=3307
   ```

**Estado:** ℹ️ Preventivo (no ocurrió en este proyecto)

---

## 📋 Checklist de Diagnóstico

Si tienes problemas, verifica estos puntos:

### Entorno
- [ ] XAMPP está instalado
- [ ] Apache está corriendo (luz verde)
- [ ] MySQL está corriendo (luz verde)
- [ ] PHP versión 8.x o superior
- [ ] Composer instalado

### Configuración
- [ ] Archivo `.env` existe
- [ ] Configuración de base de datos correcta en `.env`
- [ ] Base de datos `tierone_db` existe
- [ ] Extensión `intl` habilitada

### Archivos
- [ ] Estás en el directorio correcto del proyecto
- [ ] Archivo `artisan` existe en la raíz
- [ ] Carpeta `database/migrations` existe
- [ ] Carpeta `database/seeders` existe

### Ejecución
- [ ] Migraciones ejecutadas sin errores
- [ ] Seeders ejecutados sin errores
- [ ] Datos visibles en phpMyAdmin o tinker

---

## 🔍 Comandos de Diagnóstico

```bash
# Verificar versión de PHP
php --version

# Verificar extensiones de PHP
php -m

# Verificar configuración de Laravel
php artisan about

# Ver estado de migraciones
php artisan migrate:status

# Limpiar cachés
php artisan config:clear
php artisan cache:clear
php artisan route:clear

# Verificar conexión a base de datos
php artisan tinker
DB::connection()->getPdo();
exit
```

---

## 💡 Tips Generales

### Antes de ejecutar comandos:

1. **Siempre verifica que estás en el directorio correcto:**
   ```bash
   cd c:\Users\Fran\Desktop\TierOne\TierOne
   ```

2. **Verifica que XAMPP está corriendo:**
   - Apache: ✅ Verde
   - MySQL: ✅ Verde

3. **Limpia cachés si cambias configuración:**
   ```bash
   php artisan config:clear
   ```

### Si algo falla:

1. **Lee el mensaje de error completo**
2. **Busca en este documento**
3. **Verifica el checklist de diagnóstico**
4. **Usa comandos de diagnóstico**

---

## 🔗 Enlaces Útiles

- [← Volver al Hub Nivel 1](README.md)
- [Documentación de Laravel](https://laravel.com/docs)
- [XAMPP FAQ](https://www.apachefriends.org/faq.html)

---

**Última actualización:** 2026-02-03
