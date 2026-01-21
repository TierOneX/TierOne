# 🎮 TierOne - Plataforma Gaming E-commerce + Torneos

[![Laravel](https://img.shields.io/badge/Laravel-11-FF2D20?logo=laravel)](https://laravel.com)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://reactjs.org)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql)](https://www.mysql.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb)](https://www.mongodb.com)

**TierOne** es una plataforma integral que combina E-commerce con sistema de torneos gaming profesionales.

---

## 🎯 Características Principales

- 🛒 **E-commerce** - Tienda de merchandising con dropshipping
- 🏆 **Torneos Gaming** - Sistema completo de competiciones
- 💰 **Gestión Financiera** - Pagos, premios y retiros
- 🎮 **Integraciones API** - Riot Games, Steam y más
- 📊 **Dashboard Admin** - Panel de control completo

---

## 🚀 Inicio Rápido

### Prerequisitos

- PHP 8.2+
- Composer
- Node.js & NPM
- MySQL 8.0+
- MongoDB (local o Atlas)

### Instalación

```bash
# 1. Clonar el repositorio
git clone [url-del-repo]
cd TierOne

# 2. Ejecutar script de instalación
# Windows
.\scripts\install\install.bat

# Linux/Mac
bash scripts/install/install.sh
```

Para más detalles, consulta la [Guía de Instalación Completa](docs/INSTALLATION.md).

---

## 📁 Estructura del Proyecto

```
TierOne/
├── docs/                    # 📚 Documentación completa
│   ├── daily-reviews/      # Revisiones diarias
│   ├── presentations/      # Presentaciones del proyecto
│   ├── database/           # Documentación de BD
│   ├── api/                # Contratos de API
│   └── installation/       # Guías de instalación
├── scripts/                # 🔧 Scripts de utilidad
│   ├── install/           # Scripts de instalación
│   └── database/          # Scripts de BD
├── TierOne/               # 🚀 Aplicación Laravel
└── README.md              # Este archivo
```

---

## 📚 Documentación

| Documento | Descripción |
|-----------|-------------|
| [Instalación](docs/INSTALLATION.md) | Guía completa de instalación |
| [Base de Datos](docs/database/ER-Diagram.md) | Diagrama ER y estructura |
| [API](docs/api/README.md) | Documentación de endpoints |
| [Presentación Completa](docs/presentations/proyecto-completo.md) | Overview del proyecto |

---

## 🛠️ Stack Tecnológico

### Backend
- **Framework:** Laravel 11
- **Lenguaje:** PHP 8.2+
- **ORM:** Eloquent

### Frontend
- **Framework:** React 18
- **Integración:** Inertia.js
- **Bundler:** Vite

### Base de Datos
- **Relacional:** MySQL 8.0
- **NoSQL:** MongoDB Atlas
- **Arquitectura:** Híbrida

### Integraciones
- **Pagos:** Stripe
- **APIs Gaming:** Riot Games, Steam

---

## 📊 Estado del Proyecto

| Fase | Estado | Progreso |
|------|--------|----------|
| Documentación | ✅ Completado | 100% |
| Base de Datos | ✅ Completado | 100% |
| Backend API | 🚧 Pendiente | 0% |
| Frontend | 🚧 En desarrollo | 30% |
| Integraciones | 🚧 Pendiente | 0% |

---

## 🤝 Contribuir

Para contribuir al proyecto:

1. Fork el repositorio
2. Crea una rama: `git checkout -b feature/nueva-funcionalidad`
3. Commit tus cambios: `git commit -m 'Añadir nueva funcionalidad'`
4. Push a la rama: `git push origin feature/nueva-funcionalidad`
5. Crea un Pull Request

Consulta [CONTRIBUTING.md](CONTRIBUTING.md) para más detalles.

---

## 📝 Licencia

Este proyecto es privado y propietario.

---

## 📞 Contacto

Para preguntas o soporte, contacta al equipo de desarrollo.

---

**Última actualización:** Enero 2026  
**Versión:** 0.1.0-dev
