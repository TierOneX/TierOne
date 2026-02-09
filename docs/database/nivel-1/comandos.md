# 📊 Comandos de Referencia - Nivel 1

Cheat sheet con todos los comandos útiles para trabajar con la base de datos del Nivel 1.

---

## 🗄️ Migraciones

### Ejecutar Migraciones

```bash
# Ejecutar todas las migraciones pendientes
php artisan migrate

# Ejecutar migraciones con output detallado
php artisan migrate --verbose

# Ejecutar en modo pretend (muestra SQL sin ejecutar)
php artisan migrate --pretend
```

### Resetear Base de Datos

```bash
# Resetear TODAS las tablas y ejecutar migraciones + seeders
php artisan migrate:fresh --seed

# Solo resetear y ejecutar migraciones (sin seeders)
php artisan migrate:fresh

# Revertir última migración
php artisan migrate:rollback

# Revertir todas las migraciones
php artisan migrate:reset

# Revertir y volver a ejecutar
php artisan migrate:refresh
```

### Ver Estado

```bash
# Ver estado de todas las migraciones
php artisan migrate:status

# Ver información de la base de datos
php artisan db:show

# Ver estructura de una tabla específica
php artisan db:table users
php artisan db:table juegos
php artisan db:table categorias
```

---

## 🌱 Seeders

### Ejecutar Seeders

```bash
# Ejecutar todos los seeders
php artisan db:seed

# Ejecutar un seeder específico
php artisan db:seed --class=UserSeeder
php artisan db:seed --class=ProveedorSeeder
php artisan db:seed --class=JuegoSeeder
php artisan db:seed --class=CategoriaSeeder

# Ejecutar con output detallado
php artisan db:seed --verbose
```

### Crear Nuevos Seeders

```bash
# Crear un nuevo seeder
php artisan make:seeder NombreSeeder

# Ejemplo:
php artisan make:seeder TorneoSeeder
php artisan make:seeder PartidaSeeder
```

---

## 🔍 Verificación de Datos

### Usando Tinker

```bash
# Abrir tinker (REPL de Laravel)
php artisan tinker
```

**Dentro de tinker:**

```php
// Contar registros
DB::table('users')->count();
DB::table('juegos')->count();
DB::table('categorias')->count();
DB::table('proveedores')->count();

// Ver todos los datos
DB::table('users')->get();
DB::table('juegos')->get();

// Ver datos específicos
DB::table('users')->where('rol', 'admin')->get();
DB::table('juegos')->where('genero', 'MOBA')->get();

// Ver primer registro
DB::table('users')->first();

// Ver últimos 3 registros
DB::table('juegos')->latest()->limit(3)->get();

// Salir de tinker
exit
```

### Usando Comandos SQL Directos

```bash
# En tinker
DB::select('SELECT * FROM users');
DB::select('SELECT COUNT(*) as total FROM juegos');
DB::select('SELECT nombre, email FROM users WHERE rol = ?', ['admin']);
```

---

## 🧹 Mantenimiento

### Limpiar Cachés

```bash
# Limpiar caché de configuración
php artisan config:clear

# Limpiar caché de aplicación
php artisan cache:clear

# Limpiar caché de rutas
php artisan route:clear

# Limpiar caché de vistas
php artisan view:clear

# Limpiar TODO
php artisan optimize:clear
```

### Optimizar Aplicación

```bash
# Optimizar aplicación (cachear config, rutas, etc.)
php artisan optimize

# Cachear configuración
php artisan config:cache

# Cachear rutas
php artisan route:cache
```

---

## 🔧 Configuración

### Ver Configuración

```bash
# Ver toda la configuración de la aplicación
php artisan about

# Ver configuración de base de datos
php artisan config:show database

# Ver información de PHP
php --version
php -m  # Ver extensiones cargadas
php --ini  # Ver ubicación de php.ini
```

### Verificar Conexión

```bash
# En tinker
DB::connection()->getPdo();  # Si funciona, la conexión es correcta

# Ver nombre de la base de datos actual
DB::connection()->getDatabaseName();

# Probar query simple
DB::select('SELECT 1');
```

---

## 📋 Rutas y API

### Ver Rutas

```bash
# Listar todas las rutas
php artisan route:list

# Listar solo rutas API
php artisan route:list --path=api

# Buscar ruta específica
php artisan route:list --name=users
```

---

## 🛠️ Desarrollo

### Crear Recursos

```bash
# Crear migración
php artisan make:migration create_nombre_table

# Crear modelo
php artisan make:model NombreModelo

# Crear modelo con migración
php artisan make:model NombreModelo -m

# Crear controlador
php artisan make:controller NombreController

# Crear controlador de recursos (CRUD)
php artisan make:controller NombreController --resource

# Crear todo (modelo + migración + controller + seeder)
php artisan make:model NombreModelo -mcrs
```

---

## 💾 Backup y Restauración

### Backup de Base de Datos

```bash
# Exportar base de datos (desde terminal)
mysqldump -u root tierone_db > backup_tierone.sql

# Con fecha
mysqldump -u root tierone_db > backup_tierone_20260203.sql
```

### Restaurar Base de Datos

```bash
# Importar backup
mysql -u root tierone_db < backup_tierone.sql

# Crear base de datos e importar
mysql -u root -e "CREATE DATABASE tierone_db"
mysql -u root tierone_db < backup_tierone.sql
```

---

## 🚀 Flujo de Trabajo Completo

### Setup Inicial (Primera vez)

```bash
# 1. Navegar al proyecto
cd c:\Users\Fran\Desktop\TierOne\TierOne

# 2. Instalar dependencias
composer install

# 3. Copiar .env
copy .env.example .env

# 4. Generar key
php artisan key:generate

# 5. Crear base de datos (en phpMyAdmin o MySQL)
# Luego ejecutar:

# 6. Ejecutar migraciones y seeders
php artisan migrate:fresh --seed

# 7. Verificar
php artisan tinker
DB::table('users')->count();
exit
```

### Desarrollo Diario

```bash
# 1. Iniciar XAMPP (Apache + MySQL)

# 2. Navegar al proyecto
cd c:\Users\Fran\Desktop\TierOne\TierOne

# 3. Si hiciste cambios en migraciones/seeders
php artisan migrate:fresh --seed

# 4. Limpiar cachés si es necesario
php artisan optimize:clear

# 5. Iniciar servidor de desarrollo
php artisan serve
```

### Resetear Todo

```bash
# Resetear base de datos completa
php artisan migrate:fresh --seed

# Limpiar todos los cachés
php artisan optimize:clear

# Verificar que todo funciona
php artisan about
```

---

## 🎯 Comandos Más Usados

### Top 10 Comandos Esenciales

```bash
# 1. Resetear y poblar base de datos
php artisan migrate:fresh --seed

# 2. Ver estructura de tabla
php artisan db:table users

# 3. Abrir tinker para consultas
php artisan tinker

# 4. Ver estado de migraciones
php artisan migrate:status

# 5. Limpiar cachés
php artisan optimize:clear

# 6. Listar rutas
php artisan route:list

# 7. Ver información del sistema
php artisan about

# 8. Ejecutar seeders
php artisan db:seed

# 9. Crear migración
php artisan make:migration nombre

# 10. Iniciar servidor
php artisan serve
```

---

## 📝 Ejemplos Prácticos

### Verificar Datos Insertados

```bash
php artisan tinker
```

```php
// Verificar usuarios
echo "Usuarios: " . DB::table('users')->count() . "\n";
echo "Admins: " . DB::table('users')->where('rol', 'admin')->count() . "\n";

// Verificar juegos
echo "Juegos: " . DB::table('juegos')->count() . "\n";
echo "Juegos MOBA: " . DB::table('juegos')->where('genero', 'MOBA')->count() . "\n";

// Ver primer usuario
$user = DB::table('users')->first();
echo "Primer usuario: " . $user->username . "\n";

exit
```

### Buscar Datos Específicos

```php
// En tinker
// Buscar usuario por email
DB::table('users')->where('email', 'admin1@tierone.com')->first();

// Buscar juegos de un proveedor
DB::table('juegos')->where('proveedor_id', 1)->get();

// Buscar categorías activas
DB::table('categorias')->where('activa', 1)->get();
```

---

## 🔗 Enlaces Relacionados

- [← Volver al Hub Nivel 1](README.md)
- [Seeders Detallados](seeders.md)
- [Troubleshooting](troubleshooting.md)

---

**Última actualización:** 2026-02-03
