# 🌱 Seeders - Nivel 1

Documentación detallada de los 4 seeders implementados en el Nivel 1 de Base de Datos.

---

## 📋 Resumen

| Seeder | Registros | Archivo | Estado |
|--------|-----------|---------|--------|
| UserSeeder | 3 | `UserSeeder.php` | ✅ Completado |
| ProveedorSeeder | 3 | `ProveedorSeeder.php` | ✅ Completado |
| JuegoSeeder | 5 | `JuegoSeeder.php` | ✅ Completado |
| CategoriaSeeder | 8 | `CategoriaSeeder.php` | ✅ Completado |
| **TOTAL** | **19** | - | - |

---

## 1️⃣ UserSeeder

**Archivo:** `database/seeders/UserSeeder.php`  
**Tabla:** `users`  
**Registros:** 3 usuarios

### Datos Insertados

| ID | Username | Email | Rol | País | Verificado |
|----|----------|-------|-----|------|------------|
| 1 | admin1 | admin1@tierone.com | admin | España | ✅ Sí |
| 2 | player1 | player1@tierone.com | player | México | ✅ Sí |
| 3 | streamer1 | streamer1@tierone.com | streamer | Argentina | ❌ No |

### Características

- **Contraseña:** Todos los usuarios tienen la contraseña `password123`
- **Hash:** Generado con bcrypt (12 rounds)
- **Roles disponibles:** `player`, `admin`, `streamer`
- **Verificación:** 2 usuarios verificados, 1 sin verificar
- **Estado:** Todos activos

### Uso

```bash
# Ejecutar solo este seeder
php artisan db:seed --class=UserSeeder
```

### Verificación

```php
// En tinker
DB::table('users')->count();  // Debe retornar: 3
DB::table('users')->where('rol', 'admin')->count();  // Debe retornar: 1
```

---

## 2️⃣ ProveedorSeeder

**Archivo:** `database/seeders/ProveedorSeeder.php`  
**Tabla:** `proveedores`  
**Registros:** 3 proveedores

### Datos Insertados

| ID | Nombre | Tipo | País | Activo |
|----|--------|------|------|--------|
| 1 | Riot Games | Desarrollador | Estados Unidos | ✅ |
| 2 | Valve Corporation | Desarrollador | Estados Unidos | ✅ |
| 3 | Epic Games | Distribuidor | Estados Unidos | ✅ |

### Características

- **Tipos:** Desarrollador, Distribuidor
- **Contacto:** Todos tienen email y teléfono
- **Estado:** Todos activos
- **País:** Todos de Estados Unidos

### Uso

```bash
# Ejecutar solo este seeder
php artisan db:seed --class=ProveedorSeeder
```

### Verificación

```php
// En tinker
DB::table('proveedores')->count();  // Debe retornar: 3
DB::table('proveedores')->where('tipo', 'Desarrollador')->count();  // Debe retornar: 2
```

---

## 3️⃣ JuegoSeeder

**Archivo:** `database/seeders/JuegoSeeder.php`  
**Tabla:** `juegos`  
**Registros:** 5 juegos

### Datos Insertados

| ID | Nombre | Género | Precio | Proveedor | Activo |
|----|--------|--------|--------|-----------|--------|
| 1 | League of Legends | MOBA | Gratis | Riot Games | ✅ |
| 2 | Valorant | FPS | Gratis | Riot Games | ✅ |
| 3 | Counter-Strike 2 | FPS | Gratis | Valve Corporation | ✅ |
| 4 | Dota 2 | MOBA | Gratis | Valve Corporation | ✅ |
| 5 | Fortnite | Battle Royale | Gratis | Epic Games | ✅ |

### Características

- **Géneros:** MOBA, FPS, Battle Royale
- **Precio:** Todos gratuitos (modelo F2P)
- **Relación:** Cada juego está vinculado a un proveedor
- **Estado:** Todos activos
- **Plataformas:** PC (todos)

### Uso

```bash
# Ejecutar solo este seeder
php artisan db:seed --class=JuegoSeeder
```

### Verificación

```php
// En tinker
DB::table('juegos')->count();  // Debe retornar: 5
DB::table('juegos')->where('genero', 'MOBA')->count();  // Debe retornar: 2
DB::table('juegos')->where('genero', 'FPS')->count();  // Debe retornar: 2
```

---

## 4️⃣ CategoriaSeeder

**Archivo:** `database/seeders/CategoriaSeeder.php`  
**Tabla:** `categorias`  
**Registros:** 8 categorías

### Datos Insertados

| ID | Nombre | Slug | Activa |
|----|--------|------|--------|
| 1 | Videojuegos | videojuegos | ✅ |
| 2 | Acción | accion | ✅ |
| 3 | Estrategia | estrategia | ✅ |
| 4 | Deportes | deportes | ✅ |
| 5 | RPG | rpg | ✅ |
| 6 | Aventura | aventura | ✅ |
| 7 | Simulación | simulacion | ✅ |
| 8 | Carreras | carreras | ✅ |

### Características

- **Slugs:** Todos en minúsculas, sin acentos
- **Estado:** Todas activas
- **Jerarquía:** Planas (sin categorías padre por ahora)
- **Descripción:** Todas tienen descripción opcional

### Uso

```bash
# Ejecutar solo este seeder
php artisan db:seed --class=CategoriaSeeder
```

### Verificación

```php
// En tinker
DB::table('categorias')->count();  // Debe retornar: 8
DB::table('categorias')->where('activa', 1)->count();  // Debe retornar: 8
```

---

## 🔄 DatabaseSeeder

**Archivo:** `database/seeders/DatabaseSeeder.php`

Este archivo orquesta la ejecución de todos los seeders en el orden correcto.

### Orden de Ejecución

```php
$this->call([
    UserSeeder::class,        // 1. Primero usuarios
    ProveedorSeeder::class,   // 2. Luego proveedores
    JuegoSeeder::class,       // 3. Juegos (depende de proveedores)
    CategoriaSeeder::class,   // 4. Finalmente categorías
]);
```

### Uso

```bash
# Ejecutar todos los seeders
php artisan db:seed

# O con migraciones
php artisan migrate:fresh --seed
```

---

## 📊 Comandos Útiles

### Ejecutar Seeders

```bash
# Todos los seeders
php artisan db:seed

# Un seeder específico
php artisan db:seed --class=UserSeeder
php artisan db:seed --class=ProveedorSeeder
php artisan db:seed --class=JuegoSeeder
php artisan db:seed --class=CategoriaSeeder

# Resetear y ejecutar todo
php artisan migrate:fresh --seed
```

### Verificar Datos

```bash
# Abrir tinker
php artisan tinker

# Contar registros
DB::table('users')->count();
DB::table('proveedores')->count();
DB::table('juegos')->count();
DB::table('categorias')->count();

# Ver todos los datos
DB::table('users')->get();
DB::table('juegos')->get();

# Salir
exit
```

---

## 🔗 Enlaces Relacionados

- [← Volver al Hub Nivel 1](README.md)
- [Código fuente de seeders](../../../TierOne/database/seeders/)
- [Modelos relacionados](../../../TierOne/app/Models/)

---

**Última actualización:** 2026-02-03
