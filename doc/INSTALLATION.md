# Guía de Instalación - Modelo Híbrido MySQL + MongoDB

Esta guía te ayudará a instalar y configurar el **modelo híbrido de base de datos** para el proyecto **TierOne**. Actualmente el proyecto usa **SQLite**, y vamos a migrarlo a una arquitectura híbrida con **MySQL** (datos relacionales) y **MongoDB** (datos flexibles).

---

## 📋 Requisitos Previos

Antes de comenzar, verifica que tienes instalado:

1. **PHP 8.2+**
2. **Composer** (gestor de dependencias PHP)
3. **Node.js & NPM** (para el frontend React)
4. **MySQL 8.0+** o **MariaDB** (base de datos relacional)
5. **MongoDB Server 7.0+** (base de datos NoSQL)
6. **Extensión PHP MongoDB** (`php_mongodb.dll` para Windows)

---

## 🔍 Paso 1: Verificar Requisitos

Abre **PowerShell** o **CMD** en la carpeta del proyecto y ejecuta:

```powershell
# Navegar a la carpeta del proyecto Laravel
cd C:\Users\Fran\Desktop\TierOne\TierOne

# 1. Verificar versión de PHP
php -v

# 2. Verificar extensión MongoDB (debe aparecer 'mongodb')
php -m | findstr mongodb

# 3. Verificar Composer
composer --version

# 4. Verificar Node.js
node -v
```

### ⚠️ Si MongoDB NO aparece en la lista:

1. Localiza tu archivo `php.ini`:
   ```powershell
   php --ini
   ```

2. Abre `php.ini` con un editor de texto

3. Busca la línea `;extension=mongodb` y elimina el punto y coma (`;`) para activarla:
   ```ini
   extension=mongodb
   ```

4. Si no existe, agrégala al final de la sección `[Extensions]`

5. **Reinicia tu servidor web** (si usas XAMPP, reinicia Apache)

6. Verifica de nuevo:
   ```powershell
   php -m | findstr mongodb
   ```

---

## 🗄️ Paso 2: Crear Bases de Datos

### 2.1 Crear Base de Datos MySQL

1. Abre **MySQL Workbench** o **phpMyAdmin**
2. Ejecuta este comando SQL:
   ```sql
   CREATE DATABASE tierone_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

### 2.2 Verificar MongoDB está corriendo

#### En Windows:

1. Abre `services.msc` (Servicios de Windows)
2. Busca **MongoDB Server**
3. Si está detenido, haz clic derecho → **Iniciar**

#### O desde PowerShell:

```powershell
# Verificar si MongoDB está corriendo
Get-Service -Name MongoDB

# Si está detenido, iniciarlo (como administrador)
Start-Service -Name MongoDB
```

---

## 🔧 Paso 3: Configurar Variables de Entorno

Abre el archivo `.env` ubicado en `C:\Users\Fran\Desktop\TierOne\TierOne\.env` con tu editor de código.

### 3.1 Reemplazar la sección de Base de Datos

**ANTES (SQLite):**
```ini
DB_CONNECTION=sqlite
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=laravel
# DB_USERNAME=root
# DB_PASSWORD=
```

**DESPUÉS (Modelo Híbrido - MySQL + MongoDB):**
```ini
# ========================================
# CONFIGURACIÓN MYSQL (Base de Datos Principal)
# ========================================
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=tierone_db
DB_USERNAME=root
DB_PASSWORD=

# ========================================
# CONFIGURACIÓN MONGODB (Base de Datos Auxiliar)
# ========================================
MONGODB_CONNECTION=mongodb
MONGODB_HOST=127.0.0.1
MONGODB_PORT=27017
MONGODB_DATABASE=tierone_data
MONGODB_USERNAME=
MONGODB_PASSWORD=

# Si usas MongoDB Atlas (cloud), descomenta y configura:
# MONGODB_DSN=mongodb+srv://<usuario>:<password>@cluster.mongodb.net/tierone_data
```

> **💡 Nota:** Si tu MySQL tiene contraseña, agrégala en `DB_PASSWORD=tu_contraseña`

### 3.2 Guardar el archivo `.env`

---

## 📦 Paso 4: Instalar Driver de MongoDB para Laravel

Ejecuta este comando en la carpeta del proyecto:

```powershell
cd C:\Users\Fran\Desktop\TierOne\TierOne
composer require mongodb/laravel-mongodb:^5.0
```

Esto instalará el paquete `mongodb/laravel-mongodb` que permite a Laravel trabajar con MongoDB.

**Salida esperada:**
```
Using version ^5.0 for mongodb/laravel-mongodb
./composer.json has been updated
Loading composer repositories with package information
...
```

---

## ⚙️ Paso 5: Registrar Conexión MongoDB en Laravel

Abre el archivo `C:\Users\Fran\Desktop\TierOne\TierOne\config\database.php`

### 5.1 Localizar el array `connections`

Busca la línea que dice:

```php
'connections' => [
```

### 5.2 Agregar configuración de MongoDB

**Antes del cierre del array `connections`** (después de la configuración `'sqlsrv'`), agrega:

```php
        'mongodb' => [
            'driver' => 'mongodb',
            'host' => env('MONGODB_HOST', '127.0.0.1'),
            'port' => env('MONGODB_PORT', 27017),
            'database' => env('MONGODB_DATABASE', 'tierone_data'),
            'username' => env('MONGODB_USERNAME', ''),
            'password' => env('MONGODB_PASSWORD', ''),
            'options' => [
                'appName' => 'TierOne Platform',
            ],
        ],
```

### 5.3 Ejemplo de ubicación exacta:

```php
'connections' => [

    'sqlite' => [
        // ... configuración SQLite
    ],

    'mysql' => [
        // ... configuración MySQL
    ],

    // ... otras conexiones

    'sqlsrv' => [
        // ... configuración SQL Server
    ],

    // ⬇️ AGREGAR AQUÍ ⬇️
    'mongodb' => [
        'driver' => 'mongodb',
        'host' => env('MONGODB_HOST', '127.0.0.1'),
        'port' => env('MONGODB_PORT', 27017),
        'database' => env('MONGODB_DATABASE', 'tierone_data'),
        'username' => env('MONGODB_USERNAME', ''),
        'password' => env('MONGODB_PASSWORD', ''),
        'options' => [
            'appName' => 'TierOne Platform',
        ],
    ],

], // ⬅️ Cierre del array connections
```

### 5.4 Guardar el archivo `database.php`

---

## 🧪 Paso 6: Verificar Conexiones

### 6.1 Limpiar caché de configuración

```powershell
php artisan config:clear
php artisan cache:clear
```

### 6.2 Probar conexión MySQL

```powershell
php artisan migrate:status
```

**Si sale error** del tipo "database does not exist", asegúrate de haber creado la base de datos `tierone_db` en MySQL (Paso 2.1).

### 6.3 Probar conexión MongoDB con Tinker

```powershell
php artisan tinker
```

Una vez dentro de **tinker**, ejecuta:

```php
DB::connection('mongodb')->getMongoDB()->listCollections();
```

**Resultado esperado:**
```
=> MongoDB\Model\CollectionInfoIterator {#...}
```

Si ves este resultado, ¡la conexión a MongoDB funciona! ✅

Para salir de tinker:
```php
exit
```

---

## 🏗️ Paso 7: Ejecutar Migraciones

Como acabas de cambiar de SQLite a MySQL, necesitas ejecutar las migraciones en la nueva base de datos:

```powershell
php artisan migrate
```

**Salida esperada:**
```
   INFO  Running migrations.

  2014_10_12_000000_create_users_table ............................ 26ms DONE
  2014_10_12_100000_create_password_resets_table .................. 15ms DONE
  ...
```

---

## 🚀 Paso 8: Iniciar el Proyecto

### 8.1 Iniciar Backend (Laravel)

En una terminal:

```powershell
cd C:\Users\Fran\Desktop\TierOne\TierOne
php artisan serve
```

Deberías ver:
```
   INFO  Server running on [http://127.0.0.1:8000].
```

### 8.2 Iniciar Frontend (React + Vite)

En **otra terminal** (nueva ventana):

```powershell
cd C:\Users\Fran\Desktop\TierOne\TierOne
npm run dev
```

Deberías ver:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### 8.3 Acceder a la aplicación

Abre tu navegador en: **http://localhost:5173**

---

## ✅ Verificación Final

Ejecuta estos comandos para confirmar que todo funciona:

```powershell
# 1. Verificar que Laravel puede conectarse a MySQL
php artisan db:show

# 2. Verificar que Laravel puede conectarse a MongoDB
php artisan tinker
```

Dentro de tinker:
```php
// Crear una colección de prueba en MongoDB
DB::connection('mongodb')->collection('test')->insert(['mensaje' => 'Conexión exitosa!']);

// Leer el documento
DB::connection('mongodb')->collection('test')->first();

// Salir
exit
```

---

## 🛠️ Arquitectura del Modelo Híbrido

| Tipo de Dato | Base de Datos | Colecciones/Tablas |
|-------------|---------------|-------------------|
| **Usuarios, Autenticación** | MySQL | `users`, `password_resets` |
| **Órdenes, Pagos** | MySQL | `orders`, `payments`, `transactions` |
| **Productos (estructura)** | MySQL | `products`, `categories` |
| **Reviews de Productos** | MongoDB | `product_reviews` |
| **Logs de Sistema** | MongoDB | `system_logs`, `activity_logs` |
| **Carrito de Compras** | MongoDB | `shopping_carts` |
| **Sesiones (opcional)** | MongoDB | `sessions` |

---

## 🆘 Solución de Problemas

### ❌ Error: "Class 'MongoDB\Driver\Manager' not found"

**Causa:** La extensión PHP de MongoDB no está instalada o habilitada.

**Solución:**
1. Verifica en `php -m` si aparece `mongodb`
2. Si no aparece, edita `php.ini` y agrega/descomenta: `extension=mongodb`
3. Reinicia tu servidor web

---

### ❌ Error: "SQLSTATE[HY000] [1049] Unknown database 'tierone_db'"

**Causa:** La base de datos MySQL no existe.

**Solución:**
```sql
CREATE DATABASE tierone_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

---

### ❌ Error: "Connection refused" (MongoDB)

**Causa:** El servicio de MongoDB no está corriendo.

**Solución:**
```powershell
# Verificar estado
Get-Service -Name MongoDB

# Iniciar servicio (como administrador)
Start-Service -Name MongoDB
```

---

### ❌ Error: "Target class [mongodb] does not exist"

**Causa:** El paquete `mongodb/laravel-mongodb` no está instalado correctamente.

**Solución:**
```powershell
composer require mongodb/laravel-mongodb:^5.0
php artisan config:clear
```

---

## 📚 Próximos Pasos

Una vez completada la instalación:

1. **Crear modelos híbridos** (algunos usando MySQL, otros MongoDB)
2. **Configurar repositorios** para abstraer la lógica de acceso a datos
3. **Implementar seeders** para poblar datos de prueba
4. **Desarrollar APIs REST** que utilicen ambas bases de datos

---

## 📞 Soporte

Si encuentras problemas, revisa:
- Logs de Laravel: `C:\Users\Fran\Desktop\TierOne\TierOne\storage\logs\laravel.log`
- Logs de MongoDB: Abre MongoDB Compass y verifica conexiones
- Variables de entorno: Asegúrate de que `.env` está correctamente configurado
