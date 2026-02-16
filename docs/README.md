# 📚 TierOne - Centro de Documentación

Bienvenido al hub central de documentación del proyecto **TierOne**. Aquí encontrarás toda la información sobre la arquitectura, base de datos MySQL, API y flujos del sistema.

---

## 🗂️ Índice de Documentación

### 📋 Guías de Instalación

- **[📖 Guía de Instalación Completa](INSTALLATION.md)** - Instalación paso a paso del proyecto
  - Requisitos previos (PHP, MySQL, Node.js)
  - Configuración de entorno (.env)
  - Instalación de dependencias
  - Ejecución de migraciones

---

### 📅 Daily Reviews

**[📁 Carpeta daily-reviews/](daily-reviews/)**

- [📝 2026-01-21](daily-reviews/2026-01-21.md) - Implementación del esquema de base de datos

---

### 📊 Diagramas de Flujo

**[📁 Carpeta diagrams/](diagrams/)** - [Ver Índice](diagrams/README.md)

Diagramas Mermaid de los flujos principales:

- [🛒 Admin E-commerce](diagrams/DF-Admin-Ecommerce.md) - Panel de administración de tienda
- [🏆 Admin Torneos](diagrams/DF-Admin-Torneos.md) - Gestión de torneos y partidas  
- [💳 Pagos Stripe](diagrams/DF-Pagos-Stripe.md) - Sistema de pagos y transacciones
- [🔀 Git Workflow](diagrams/Feature-Branch-Workflow.md) - Estrategia de branching

---

### 🗄️ Base de Datos

**[📁 Carpeta database/](database/)** - [Ver Índice](database/README.md)

Arquitectura y diseño del esquema MySQL:

- **[📊 Diagrama ER Completo](database/ER-Diagram.md)** - Diagrama entidad-relación (~28 tablas)
  - 6 módulos: Usuarios, Juegos, Torneos, E-commerce, Finanzas, Reportes
  - Todas las relaciones y foreign keys
  
- **[📋 Plan de Implementación](database/Implementation-Plan.md)** - Guía paso a paso
  - Stack tecnológico
  - Estructura de tablas por módulo
  - Cronograma de desarrollo

- **[📉 Análisis y Correcciones v2](database/Analysis-Corrections-v2.md)** - Estado actual del esquema
  - Correcciones aplicadas
  - Deuda técnica pendiente
  - Propuestas de mejora

---

### 🔌 API REST

**[📁 Carpeta api/](api/)** - [Ver Índice](api/README.md)

Documentación de endpoints y contratos API:

#### Contratos por Módulo

**Autenticación:**
- [🔐 Auth API](api/contracts/Auth-API.md) - Login, Registro, Logout, Recuperar Password

**Usuarios:**
- [👥 Users API](api/contracts/Users-API.md) - Gestión de usuarios y perfiles

**Juegos y Partidas:**
- [🎮 Games API](api/contracts/Games-API.md) - Catálogo de juegos
- [⚔️ Matches API](api/contracts/Matches-API.md) - Creación de partidas y resultados

**Torneos:**
- [🏆 Tournaments API](api/contracts/Tournaments-API.md) - Brackets, Inscripciones, Premios

**E-Commerce:**
- [🛍️ Shop API](api/contracts/Shop-API.md) - Productos y órdenes
- [🛒 Cart API](api/contracts/Cart-API.md) - Gestión del carrito de compras
- [⭐ Reviews API](api/contracts/Reviews-API.md) - Reseñas con moderación

**Recursos:**
- [📄 Plantilla de Contratos](api/contracts/_TEMPLATE.md) - Template para nuevos endpoints

---

### 🎨 Frontend

**[📁 Carpeta frontend/](frontend/)** - [Ver Índice](frontend/README.md)

Documentación de React + Inertia.js (en construcción)

---

### 📊 Presentaciones

**[📁 Carpeta presentations/](presentations/)**

- [📊 Proyecto Completo](presentations/proyecto-completo.md) - Presentación ejecutiva del proyecto
  - Estado general (actualizado: Feb 2026)
  - Stack tecnológico
  - Roadmap y objetivos

---

### 📦 Archivos

**[📁 Carpeta archive/](archive/)**

Documentación histórica y archivada

---

## 🚀 Inicio Rápido

### Para Desarrolladores Nuevos

1. **📖 Instalación** → Lee [INSTALLATION.md](INSTALLATION.md)
2. **🗄️ Base de Datos** → Consulta [database/ER-Diagram.md](database/ER-Diagram.md)
3. **🔌 API** → Revisa [api/README.md](api/README.md)
4. **📊 Arquitectura** → Ver [presentations/proyecto-completo.md](presentations/proyecto-completo.md)

### Para Administradores

1. **📊 Estado del Proyecto** → [presentations/proyecto-completo.md](presentations/proyecto-completo.md)
2. **🗄️ Esquema de BD** → [database/ER-Diagram.md](database/ER-Diagram.md)
3. **📋 Flujos de Negocio** → [diagrams/README.md](diagrams/README.md)

---

## 📂 Estructura de Carpetas

```
docs/
├── README.md                    # Este archivo
├── INSTALLATION.md              # Guía de instalación
│
├── api/                         # Documentación de API
│   ├── README.md
│   └── contracts/               # Contratos por endpoint
│       ├── Auth-API.md
│       ├── Cart-API.md
│       ├── Games-API.md
│       ├── Matches-API.md
│       ├── Reviews-API.md
│       ├── Shop-API.md
│       ├── Tournaments-API.md
│       ├── Users-API.md
│       └── _TEMPLATE.md
│
├── database/                    # Documentación de BD
│   ├── README.md
│   ├── ER-Diagram.md           # Diagrama principal
│   ├── Implementation-Plan.md
│   └── Analysis-Corrections-v2.md
│
├── diagrams/                    # Diagramas de flujo
│   ├── README.md
│   ├── DF-Admin-Ecommerce.md
│   ├── DF-Admin-Torneos.md
│   ├── DF-Pagos-Stripe.md
│   └── Feature-Branch-Workflow.md
│
├── presentations/               # Presentaciones
│   └── proyecto-completo.md
│
├── frontend/                    # Docs de frontend
│   └── README.md
│
├── daily-reviews/              # Resúmenes diarios
│   └── 2026-01-21.md
│
└── archive/                    # Histórico
```

---

## 📞 Enlaces Rápidos

- **[← Volver al README Principal](../README.md)**
- **[📊 Presentación del Proyecto](presentations/proyecto-completo.md)**
- **[🗄️ Diagrama de Base de Datos](database/ER-Diagram.md)**
- **[🔌 Contratos API](api/README.md)**

---

**Estado**: ✅ Documentación actualizada  
**Última actualización**: Febrero 2026  
**Versión**: 2.0
