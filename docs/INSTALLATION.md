# Guía de Instalación - TierOne

Esta guía te ayudará a instalar y configurar el proyecto **TierOne** con **MySQL** como base de datos.

---

## 📋 Requisitos Previos

Antes de comenzar, verifica que tienes instalado:

1. **PHP 8.2+**
2. **Composer** (gestor de dependencias PHP)
3. **Node.js & NPM** (para el frontend React)
4. **MySQL 8.0+** o **MariaDB** (base de datos)

---

## 🔍 Paso 1: Verificar Requisitos

Abre **PowerShell** o **CMD** en la carpeta del proyecto y ejecuta:

```powershell
# Navegar a la carpeta del proyecto Laravel
cd C:\Users\Fran\Desktop\TierOne\TierOne

# 1. Verificar versión de PHP
php -v

# 2. Verificar Composer
composer --version

# 3. Verificar Node.js
node -v

# 4. Verificar MySQL
mysql --version
```

---

## 🗄️ Paso 2: Crear Base de Datos MySQL

### Opción 1: Usando MySQL Workbench o phpMyAdmin

1. Abre **MySQL Workbench** o **phpMyAdmin**
2. Ejecuta este comando SQL:

```sql
CREATE DATABASE tierone_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Opción 2: Desde línea de comandos

```powershell
# Conectar a MySQL
mysql -u root -p

# Crear la base de datos
CREATE DATABASE tierone_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Salir
exit
```

---

## 🔧 Paso 3: Configurar Variables de Entorno

Abre el archivo `.env` ubicado en `C:\Users\Fran\Desktop\TierOne\TierOne\.env` con tu editor de código.

### 3.1 Configurar conexión MySQL

Asegúrate de que la sección de base de datos se vea así:

```ini
# ========================================
# CONFIGURACIÓN DE BASE DE DATOS (MySQL)
# ========================================
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=tierone_db
DB_USERNAME=root
DB_PASSWORD=
```

> **💡 Nota:** Si tu MySQL tiene contraseña, agrégala en `DB_PASSWORD=tu_contraseña`

### 3.2 Guardar el archivo `.env`

---

## 📦 Paso 4: Instalar Dependencias

### 4.1 Instalar dependencias de PHP

```powershell
cd C:\Users\Fran\Desktop\TierOne\TierOne
composer install
```

### 4.2 Instalar dependencias de Node.js

```powershell
npm install
```

---

## 🧪 Paso 5: Verificar Conexión a MySQL

Ejecuta:

```powershell
php artisan config:clear
php artisan migrate:status
```

**Si sale error** del tipo "database does not exist", asegúrate de haber creado la base de datos `tierone_db` en MySQL (Paso 2).

---

## 🏗️ Paso 6: Ejecutar Migraciones

Ejecuta las migraciones para crear las tablas en la base de datos:

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

## 🚀 Paso 7: Iniciar el Proyecto

### 7.1 Iniciar Backend (Laravel)

En una terminal:

```powershell
cd C:\Users\Fran\Desktop\TierOne\TierOne
php artisan serve
```

Deberías ver:

```
   INFO  Server running on [http://127.0.0.1:8000].
```

### 7.2 Iniciar Frontend (React + Vite)

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

### 7.3 Acceder a la aplicación

Abre tu navegador en: **http://localhost:5173**

---

## ✅ Verificación Final

Ejecuta estos comandos para confirmar que todo funciona:

```powershell
# 1. Verificar que Laravel puede conectarse a MySQL
php artisan db:show

# 2. Ver estado de las migraciones
php artisan migrate:status
```

---

## 🗄️ Estructura de Base de Datos

El proyecto utiliza MySQL para todos los datos:

| Módulo | Tablas |
|--------|--------|
| **Usuarios y Autenticación** | `users`, `password_reset_tokens`, `sessions` |
| **E-commerce** | `categorias`, `productos`, `proveedores`, `ordenes`, `items_orden`, `pagos` |
| **Gaming** | `juegos`, `partidas`, `participantes_partida`, `resultados_partida` |
| **Torneos** | `torneos`, `inscripciones_torneo`, `partidas_torneo`, `premios_torneo`, `sponsors_torneo` |
| **Sistema** | `reviews`, `reportes`, `transacciones`, `retiros`, `integraciones_api` |

---

## 🆘 Solución de Problemas

### ❌ Error: "SQLSTATE[HY000] [1049] Unknown database 'tierone_db'"

**Causa:** La base de datos MySQL no existe.

**Solución:**

```sql
CREATE DATABASE tierone_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

---

### ❌ Error: "Access denied for user 'root'@'localhost'"

**Causa:** Credenciales incorrectas en el archivo `.env`.

**Solución:**

1. Verifica tu usuario y contraseña de MySQL
2. Actualiza `DB_USERNAME` y `DB_PASSWORD` en `.env`
3. Ejecuta `php artisan config:clear`

---

### ❌ Error: "SQLSTATE[HY000] [2002] Connection refused"

**Causa:** El servicio de MySQL no está corriendo.

**Solución:**

- **Windows (XAMPP):** Inicia MySQL desde el panel de control de XAMPP
- **Windows (MySQL Service):**
  ```powershell
  Start-Service -Name MySQL80
  ```
- **Linux/Mac:**
  ```bash
  sudo systemctl start mysql
  ```

---

## 📚 Próximos Pasos

Una vez completada la instalación:

1. **Crear seeders** para poblar datos de prueba
2. **Desarrollar APIs REST**
3. **Implementar autenticación**
4. **Desarrollar el frontend React**

---

## 📞 Soporte

Si encuentras problemas, revisa:

- Logs de Laravel: `C:\Users\Fran\Desktop\TierOne\TierOne\storage\logs\laravel.log`
- Variables de entorno: Asegúrate de que `.env` está correctamente configurado
- Verifica que MySQL esté corriendo y accesible

---

**Última actualización:** Enero 2026  
**Versión:** 2.0 (MySQL only)
