# Guía de Instalación - TierOne

Esta guía te ayudará a instalar y configurar el proyecto **TierOne** utilizando **MySQL** como motor de base de datos.

---

## 📋 Requisitos Previos

Antes de comenzar, verifica que tienes instalado:

1. **PHP 8.2+**
2. **Composer** (gestor de dependencias PHP)
3. **Node.js 20+ & NPM** (para el frontend React)
4. **MySQL 8.0+** (base de datos relacional)

---

## 🔍 Paso 1: Verificar Requisitos

Abre una terminal en la carpeta raíz del proyecto y ejecuta:

```powershell
# 1. Verificar versión de PHP
php -v

# 2. Verificar Composer
composer --version

# 3. Verificar Node.js
node -v

# 4. Verificar MySQL (opcional si usas XAMPP)
mysql --version
```

---

## 🗄️ Paso 2: Crear Base de Datos MySQL

### Opción 1: Usando el script automatizado (Recomendado)

Si tienes `mysql` en tu PATH, puedes usar nuestro script de inicialización:

```powershell
mysql -u root -p < database/setup_mysql.sql
```

### Opción 2: Manualmente (phpMyAdmin / Workbench)

1. Crea una base de datos llamada `tierone_db`.
2. Asegúrate de usar el cotejamiento `utf8mb4_unicode_ci`.

---

## 🔧 Paso 3: Configurar Variables de Entorno

1. Localiza el archivo `.env` en la carpeta `TierOne/`. Si no existe, el script de instalación lo creará por ti basándose en `.env.example`.
2. Verifica la configuración de la base de datos:

```ini
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=tierone_db
DB_USERNAME=root
DB_PASSWORD=tu_contraseña_si_tiene
```

---

## 📦 Paso 4: Instalación Automatizada

Contamos con scripts que automatizan la instalación de dependencias, generación de llaves y ejecución de migraciones iniciales.

**En Windows:**
```powershell
.\scripts\install.bat
```

**En Linux/Mac:**
```bash
bash scripts/install.sh
```

---

## 🚀 Paso 5: Iniciar el Proyecto

Para poner en marcha la aplicación, necesitarás dos terminales abiertas en la carpeta `TierOne/`:

### 5.1 Backend (Laravel)
```powershell
php artisan serve
```
*Acceso:* [http://127.0.0.1:8000](http://127.0.0.1:8000)

### 5.2 Frontend (React + Vite)
```powershell
npm run dev
```
*Acceso:* [http://localhost:5173](http://localhost:5173)

---

## ✅ Verificación Final

Confirma que la conexión a la base de datos es correcta:

```powershell
php artisan db:show
php artisan migrate:status
```

---

## 🆘 Solución de Problemas Comunes

- **"Unknown database 'tierone_db'"**: Asegúrate de haber completado el Paso 2.
- **"Access denied for user 'root'"**: Revisa el `DB_PASSWORD` en tu `.env`.
- **"Connection refused"**: Verifica que el servicio de MySQL (o XAMPP) esté activo.

---

**Última actualización:** Febrero 2026 | **Versión:** 2.1 (MySQL optimized)
