# Guía de Instalación y Configuración - TierOne Platform

Esta guía detalla los pasos para instalar y configurar el entorno de desarrollo de **TierOne**, incluyendo la arquitectura híbrida de base de datos (MySQL + MongoDB).

---

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

1.  **PHP 8.2+**
2.  **Composer**
3.  **MySQL 8.0+** (o MariaDB)
4.  **MongoDB Server 7.0+** (o acceso a MongoDB Atlas)
5.  **Extensión PHP MongoDB** (`php_mongodb.dll` o `mongodb.so`)
6.  **Node.js & NPM** (para el frontend)

### 🩺 Verificación de Requisitos

Ejecuta estos comandos en tu terminal para verificar:

```bash
# 1. Versión de PHP
php -v

# 2. Extensión MongoDB (Debe aparecer 'mongodb' en la lista)
php -m | findstr mongodb

# 3. Versión de Composer
composer --version
```

> **Nota:** Si `php -m` no muestra `mongodb`, debes habilitar la extensión en tu `php.ini` (`extension=mongodb`).

---

## 🚀 1. Instalación del Proyecto

### 1.1 Clonar el Repositorio

```bash
git clone https://github.com/TSu_Usuario/TierOne.git
cd TierOne
```

### 1.2 Instalar Dependencias de Backend (PHP)

Como hemos restaurado el `composer.json`, ahora debes instalar las librerías:

```bash
cd TierOne
composer install
```

### 1.3 Configurar Variables de Entorno

Copia el archivo de ejemplo y genera la clave de la aplicación:

```bash
copy .env.example .env
php artisan key:generate
```

---

## 🗄️ 2. Configuración de Base de Datos Híbrida

TierOne utiliza una arquitectura híbrida:
*   **MySQL**: Para datos relacionales críticos (Usuarios, Órdenes, Pagos).
*   **MongoDB**: Para datos flexibles y de alto volumen (Reviews, Logs, Carrito).

### 2.1 Configurar `.env`

Abre el archivo `.env` y configura ambas conexiones de base de datos. Asegúrate de crear la base de datos MySQL vacía primero.

```ini
# --- Configuración MySQL (Principal) ---
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=tierone_db
DB_USERNAME=root
DB_PASSWORD=

# --- Configuración MongoDB (Auxiliar) ---
MONGODB_CONNECTION=mongodb
MONGODB_HOST=127.0.0.1
MONGODB_PORT=27017
MONGODB_DATABASE=tierone_data
MONGODB_USERNAME=
MONGODB_PASSWORD=
# Si usas Atlas, usa MONGODB_DSN en su lugar
```

### 2.2 Instalar Driver de MongoDB para Laravel

Para habilitar la integración híbrida, ejecuta:

```bash
composer require mongodb/laravel-mongodb:^5.0
```

---

## ⚙️ 3. Configuración de Archivos del Sistema

### 3.1 Registrar Conexión en `config/database.php`

> **IMPORTANTE**: Este paso es necesario para que Laravel reconozca MongoDB.

Abre `config/database.php` y añade esto dentro del array `connections`:

```php
'mongodb' => [
    'driver' => 'mongodb',
    'host' => env('MONGODB_HOST', '127.0.0.1'),
    'port' => env('MONGODB_PORT', 27017),
    'database' => env('MONGODB_DATABASE', 'tierone_data'),
    'username' => env('MONGODB_USERNAME', ''),
    'password' => env('MONGODB_PASSWORD', ''),
    'options' => [
        // Opciones adicionales si son necesarias
    ],
],
```

---

## 🏃 4. Ejecución y Verificación

### 4.1 Migraciones (Solo MySQL por ahora)

```bash
php artisan migrate
```

### 4.2 Iniciar Servidores

```bash
# Backend
php artisan serve

# Frontend (en otra terminal)
npm install
npm run dev
```

### 4.3 Verificar Conexión MongoDB

Para probar que MongoDB está conectado correctamente, puedes usar `tinker`:

```bash
php artisan tinker
```

Dentro de tinker:
```php
// Debe devolver una lista vacía (o colecciones existentes) si la conexión es exitosa
DB::connection('mongodb')->getMongoDB()->listCollections()
```

---

## 🆘 Solución de Problemas Comunes

*   **Error "Class 'MongoDB\Driver\Manager' not found"**: La extensión de PHP no está habilitada o instalada. Revisa tu `php.ini`.
*   **Error de conexión rechazado**: Verifica que el servicio de MongoDB esté corriendo (`services.msc` en Windows o `sudo systemctl status mongod` en Linux).
