# Plan de Implementación: Integración de MongoDB en Laravel

**Proyecto**: TierOne (E-Commerce Laravel)  
**Objetivo**: Configuración de MongoDB como base de datos para el proyecto  
**Fecha**: 2026-01-19

---

## User Review Required

### ⚠️ IMPORTANT: Decisión de Arquitectura de Base de Datos

Existen dos enfoques principales para integrar MongoDB en Laravel:

1. **MongoDB como base de datos principal**: Reemplazar completamente SQLite/MySQL por MongoDB
2. **Arquitectura híbrida**: Mantener una base de datos relacional (MySQL/PostgreSQL) para datos estructurados y usar MongoDB para datos no estructurados (logs, sesiones, caché, documentos flexibles)

#### 💡 Recomendación

Para un proyecto de E-Commerce, sugiero una **arquitectura híbrida**:

- **MySQL/PostgreSQL**: Para datos críticos (usuarios, productos, pedidos, pagos)
- **MongoDB**: Para catálogos flexibles, logs, sesiones, carritos de compra, reviews/comentarios

> **¿Qué enfoque prefieres?**

---

### ⚠️ WARNING: Requisitos Previos

Para usar MongoDB con Laravel necesitas:

1. **Extensión PHP `mongodb`** instalada en tu sistema
2. **Servidor MongoDB** instalado localmente o acceso a **MongoDB Atlas** (cloud)

> **¿Ya tienes MongoDB instalado o prefieres usar MongoDB Atlas (gratuito)?**

---

## Proposed Changes

### 📦 Dependencias del Proyecto

#### [MODIFY] [composer.json](file:///c:/Users/Fran/Desktop/TierOne/TierOne/composer.json)

Añadir el paquete oficial de MongoDB para Laravel:

- Agregar `"mongodb/laravel-mongodb": "^5.0"` a la sección `require`
- Este paquete proporciona soporte completo para Eloquent con MongoDB

```json
{
    "require": {
        "php": "^8.2",
        "laravel/framework": "^11.0",
        "mongodb/laravel-mongodb": "^5.0"
    }
}
```

---

### ⚙️ Configuración de Base de Datos

#### [MODIFY] [config/database.php](file:///c:/Users/Fran/Desktop/TierOne/TierOne/config/database.php)

Añadir configuración de conexión MongoDB:

- Agregar nueva conexión `mongodb` en el array `connections`
- Configurar parámetros: host, port, database, username, password
- Soporte para conexiones locales y MongoDB Atlas

```php
'connections' => [
    // ... conexiones existentes ...
    
    'mongodb' => [
        'driver' => 'mongodb',
        'host' => env('MONGODB_HOST', '127.0.0.1'),
        'port' => env('MONGODB_PORT', 27017),
        'database' => env('MONGODB_DATABASE', 'tierone'),
        'username' => env('MONGODB_USERNAME'),
        'password' => env('MONGODB_PASSWORD'),
        'options' => [
            'appname' => 'TierOne',
        ],
    ],
],
```

#### [MODIFY] [.env](file:///c:/Users/Fran/Desktop/TierOne/TierOne/.env)

Añadir variables de entorno para MongoDB:

```env
MONGODB_CONNECTION=mongodb
MONGODB_HOST=127.0.0.1
MONGODB_PORT=27017
MONGODB_DATABASE=tierone
MONGODB_USERNAME=
MONGODB_PASSWORD=
```

#### [MODIFY] [.env.example](file:///c:/Users/Fran/Desktop/TierOne/TierOne/.env.example)

Actualizar el archivo de ejemplo con las mismas variables MongoDB para que otros desarrolladores sepan qué configurar.

---

### 🔧 Service Provider

#### [MODIFY] [config/app.php](file:///c:/Users/Fran/Desktop/TierOne/TierOne/config/app.php)

Registrar el Service Provider de MongoDB (si es necesario para Laravel 12, algunas versiones lo auto-descubren):

- Verificar si `MongoDB\Laravel\MongoDBServiceProvider` necesita registro manual

```php
'providers' => [
    // ... otros providers ...
    MongoDB\Laravel\MongoDBServiceProvider::class,
],
```

---

### 📚 Documentación

#### [MODIFY] [README.md](file:///c:/Users/Fran/Desktop/TierOne/README.md)

Actualizar documentación del proyecto:

- Agregar sección sobre configuración de MongoDB
- Documentar requisitos de instalación
- Incluir instrucciones para instalar extensión PHP MongoDB
- Añadir ejemplos de uso básico

#### [NEW] docs/mongodb-setup.md

Crear guía detallada de configuración:

- Instalación de MongoDB en Windows
- Instalación de extensión PHP MongoDB
- Configuración de MongoDB Atlas (alternativa cloud)
- Ejemplos de modelos con MongoDB
- Mejores prácticas

---

## Verification Plan

### ✅ Verificación de Requisitos

#### 1. Verificar extensión PHP MongoDB

```powershell
php -m | findstr mongodb
```

Si no está instalada, proporcionar guía de instalación.

#### 2. Verificar servidor MongoDB

```powershell
mongosh --version
```

O verificar conexión a MongoDB Atlas.

---

### 🧪 Automated Tests

#### 1. Instalar dependencias

```bash
cd TierOne
composer require mongodb/laravel-mongodb
```

#### 2. Probar conexión

```bash
php artisan tinker
```

En tinker:
```php
DB::connection('mongodb')->getMongoDB()->listCollections()
```

---

### 🔍 Manual Verification

1. Crear modelo de prueba que use MongoDB
2. Insertar documento de prueba en una colección
3. Consultar datos para verificar que la conexión funciona correctamente
4. Verificar en **MongoDB Compass** (GUI) o `mongosh` que los datos se guardaron

---

## Guía de Instalación de MongoDB

### Opción 1: MongoDB Local (Windows)

#### Paso 1: Descargar MongoDB Community Server

1. Ir a [MongoDB Download Center](https://www.mongodb.com/try/download/community)
2. Seleccionar versión para Windows
3. Descargar e instalar

#### Paso 2: Instalar extensión PHP MongoDB

```powershell
# Verificar versión de PHP
php -v

# Descargar DLL desde https://pecl.php.net/package/mongodb
# Copiar php_mongodb.dll a la carpeta ext de PHP
# Ejemplo: C:\php\ext\

# Editar php.ini y agregar:
extension=mongodb
```

#### Paso 3: Reiniciar servidor web

```powershell
# Si usas Apache
httpd -k restart

# Si usas PHP built-in server
php artisan serve
```

---

### Opción 2: MongoDB Atlas (Cloud - Gratuito)

#### Paso 1: Crear cuenta en MongoDB Atlas

1. Ir a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crear cuenta gratuita
3. Crear un cluster (tier gratuito M0)

#### Paso 2: Configurar acceso

1. Crear usuario de base de datos
2. Añadir IP a whitelist (o permitir acceso desde cualquier IP: `0.0.0.0/0`)
3. Obtener connection string

#### Paso 3: Configurar .env

```env
MONGODB_CONNECTION=mongodb
MONGODB_HOST=cluster0.xxxxx.mongodb.net
MONGODB_PORT=27017
MONGODB_DATABASE=tierone
MONGODB_USERNAME=tu_usuario
MONGODB_PASSWORD=tu_password
```

O usar connection string completo:

```env
MONGODB_DSN=mongodb+srv://usuario:password@cluster0.xxxxx.mongodb.net/tierone?retryWrites=true&w=majority
```

Y en `config/database.php`:

```php
'mongodb' => [
    'driver' => 'mongodb',
    'dsn' => env('MONGODB_DSN'),
    'database' => env('MONGODB_DATABASE', 'tierone'),
],
```

---

## Ejemplos de Uso

### Modelo con MongoDB

```php
<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Review extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'reviews';

    protected $fillable = [
        'product_id',
        'user_id',
        'rating',
        'comment',
        'images',
        'helpful_count',
    ];

    protected $casts = [
        'images' => 'array',
        'rating' => 'integer',
        'helpful_count' => 'integer',
    ];
}
```

### Crear documento

```php
Review::create([
    'product_id' => 1,
    'user_id' => 5,
    'rating' => 5,
    'comment' => 'Excelente producto!',
    'images' => ['img1.jpg', 'img2.jpg'],
    'helpful_count' => 0,
]);
```

### Consultar documentos

```php
// Obtener todas las reviews de un producto
$reviews = Review::where('product_id', 1)->get();

// Obtener reviews con rating >= 4
$topReviews = Review::where('rating', '>=', 4)->get();

// Búsqueda en arrays
$reviewsWithImages = Review::whereNotNull('images')->get();
```

---

## Casos de Uso Recomendados para MongoDB

### ✅ Ideal para MongoDB

- **Carritos de compra**: Estructura flexible, datos temporales
- **Reviews y comentarios**: Datos no estructurados, pueden incluir imágenes, videos
- **Logs de actividad**: Alto volumen de escritura
- **Sesiones de usuario**: Datos temporales
- **Catálogos de productos con atributos variables**: Productos con diferentes características
- **Historial de navegación**: Datos analíticos

### ❌ Mejor en MySQL/PostgreSQL

- **Usuarios y autenticación**: Datos críticos, relaciones complejas
- **Pedidos y transacciones**: Integridad referencial, ACID
- **Pagos**: Datos financieros críticos
- **Inventario**: Necesita transacciones atómicas

---

## Arquitectura Híbrida Recomendada

```mermaid
graph TB
    subgraph "MySQL/PostgreSQL"
        A[Users]
        B[Products]
        C[Orders]
        D[Payments]
    end
    
    subgraph "MongoDB"
        E[Reviews]
        F[Shopping Carts]
        G[Activity Logs]
        H[User Sessions]
        I[Product Catalog Extended]
    end
    
    A -->|user_id| E
    B -->|product_id| E
    A -->|user_id| F
    B -->|product_id| F
    A -->|user_id| G
```

---

## Próximos Pasos Después de la Aprobación

1. [ ] Confirmar enfoque de arquitectura (híbrida vs solo MongoDB)
2. [ ] Confirmar disponibilidad de MongoDB (local vs Atlas)
3. [ ] Instalar paquete Composer
4. [ ] Configurar archivos
5. [ ] Verificar funcionamiento
6. [ ] Crear documentación
7. [ ] Migrar modelos apropiados a MongoDB
8. [ ] Crear seeders para datos de prueba
9. [ ] Implementar tests

---

## Referencias

- [MongoDB Laravel Package](https://github.com/mongodb/laravel-mongodb)
- [MongoDB PHP Extension](https://www.php.net/manual/en/mongodb.installation.php)
- [MongoDB Atlas Documentation](https://www.mongodb.com/docs/atlas/)
- [Laravel Database Documentation](https://laravel.com/docs/database)

---

**Última actualización**: 2026-01-19  
**Versión**: 1.0  
**Estado**: Pendiente de aprobación
