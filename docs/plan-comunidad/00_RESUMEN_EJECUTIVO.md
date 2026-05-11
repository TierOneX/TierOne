# TierOne Community — Resumen Ejecutivo

## Estado Actual del Proyecto (Mayo 2026)

El proyecto TierOne ya tiene **construidos y funcionales** los siguientes módulos:

### ✅ Módulos Completados
| Módulo | Estado | Evidencia |
|---|---|---|
| **Auth (Breeze + Sanctum)** | ✅ Operativo | Login, registro, perfil, API tokens |
| **E-Commerce completo** | ✅ Operativo | Catálogo, carrito, checkout con Stripe |
| **Personalización (Fabric.js)** | ✅ Operativo | Editor canvas, zonas admin, upload, renders |
| **Facturación PDF** | ✅ Operativo | DomPDF con logo base64 |
| **Panel Admin E-Commerce** | ✅ Operativo | CRUD productos, categorías, órdenes, proveedores, finanzas |
| **Torneos (Backend API)** | ✅ Parcial | CRUD de torneos, inscripciones, partidas (API REST) |
| **Base de Juegos** | ⚠️ Básico | Tabla `juegos` con nombre, slug, descripción corta, imagen manual |

### 🔴 Módulos Pendientes (del Plan de Acción v1.0)
| Módulo | Estado |
|---|---|
| **Comunidad / IGDB + Twitch** | ❌ No iniciado |
| **Wager System (apuestas)** | ❌ No iniciado |
| **Wallet / Transacciones de usuario** | ❌ No iniciado |
| **Notificaciones in-app** | ❌ No iniciado |
| **Perfiles públicos de jugador** | ❌ No iniciado |

---

## Divergencias con el Plan de Acción v1.0

El documento original planteaba una arquitectura **React SPA + Laravel API REST separados**. El proyecto real usa:

| Aspecto | Plan v1.0 | Realidad del Proyecto |
|---|---|---|
| **Frontend** | React SPA independiente + React Router | **React 18 + Inertia.js** (renderizado servidor) |
| **Estado global** | Zustand | **Props de Inertia** (no hay Zustand) |
| **Routing** | React Router v6 | **Rutas Laravel** (web.php / api.php) |
| **Laravel version** | Laravel 11 | **Laravel 12** |
| **Caché** | Redis | **Database** (CACHE_STORE=database) |
| **Colas** | Redis | **Database** (QUEUE_CONNECTION=database) |
| **Modelos** | Inglés (Product, User) | **Español** (Producto, Orden, Categoria) |
| **Tabla de juegos** | `games_cache` (caché pura) | **`juegos`** (tabla propia con datos manuales) |

> [!IMPORTANT]
> El plan de comunidad debe adaptarse al stack real: **Inertia.js + Laravel web routes**, no endpoints API puros + SPA.

---

## Objetivo de este Plan
Crear el **Módulo Comunidad** adaptado al proyecto real, utilizando:
- **IGDB API** → Enriquecer la tabla `juegos` con metadatos profesionales
- **Twitch Helix API** → Datos en tiempo real (streams, clips, rankings)
- **Inertia.js** → Páginas React renderizadas desde Laravel (no SPA independiente)

## Índice de Documentos
| Archivo | Contenido |
|---|---|
| [01_IGDB_DATOS.md](./01_IGDB_DATOS.md) | Todos los campos de IGDB que extraeremos |
| [02_TWITCH_HELIX.md](./02_TWITCH_HELIX.md) | Datos en tiempo real de Twitch Helix |
| [03_BASE_DATOS.md](./03_BASE_DATOS.md) | Migraciones y cambios al esquema MySQL |
| [04_BACKEND_SERVICIOS.md](./04_BACKEND_SERVICIOS.md) | TwitchAuthService, GameService, TwitchService |
| [05_FRONTEND_PAGINAS.md](./05_FRONTEND_PAGINAS.md) | Páginas y componentes React/Inertia |
| [06_CACHE_ESTRATEGIA.md](./06_CACHE_ESTRATEGIA.md) | TTLs y estrategia de caché |
| [07_FASES_EJECUCION.md](./07_FASES_EJECUCION.md) | Orden de tareas y dependencias |
