# 🔧 Scripts de Utilidad - TierOne

Este directorio contiene scripts automatizados para facilitar el desarrollo y la gestión del proyecto.

## 📂 Estructura

### 🚀 [install/](install/)
Scripts para la configuración inicial del entorno.
- `install.bat`: Script de instalación para Windows.
- `install.sh`: Script de instalación para Linux/Mac.
- `create_migrations.bat`: Crea automáticamente todas las migraciones necesarias para el esquema del proyecto.

### 🗄️ [database/](database/)
Scripts relacionados con la base de datos.
- `setup_mysql.sql`: Script SQL para crear la base de datos `tierone_db` e inicializar privilegios.

## ⚠️ Uso Correcto
Todos los scripts deben ejecutarse desde la **raíz del proyecto** (`TierOne/`) para asegurar que las rutas relativas funcionen correctamente.

Ejemplo:
```powershell
.\scripts\install\install.bat
```
