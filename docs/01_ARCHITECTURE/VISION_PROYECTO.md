# 🎮 VISIÓN GENERAL DEL PROYECTO TIERONE
Auditoría técnica completa — 20/02/2026

## 🌿 MAPA DE RAMAS
| Rama | Tipo | Estado | Descripción |
| :--- | :--- | :--- | :--- |
| main | Base | Estable | Base limpia del proyecto |
| dev | Integración | Activa | Rama de integración general |
| feature/backend-refactor | Backend | ✅ Activa | Rama actual de backend |
| feature/seeders | Backend | Completa | Seeders y factories de BD |
| frontend-home | Frontend | Completa | Página Home con secciones |
| frontend-landing_page | Frontend | Completa | Landing page Hero + Features |
| frontend-shop | Frontend | Completa | Tienda con filtros y búsqueda |
| feature/frontend-product | Frontend | Completa | Página detalle de producto |
| feature/frontend-carrito | Frontend | Más avanzada | Carrito + CartContext |
| frontend-panel_admin | Frontend | Completa | Panel de administración |

## 🔧 BACKEND — feature/backend-refactor

### Stack técnico
- Laravel 11 + Sanctum (autenticación por tokens)
- Inertia.js (para el puente con React)
- MySQL (base de datos)

### 📦 Modelos (26 modelos)
| Módulo | Modelos |
| :--- | :--- |
| Usuarios | User |
| Catálogo | Producto, Categoria, Juego, ImagenProducto, VarianteProducto |
| Proveedores | Proveedor, ComunicacionProveedor |
| E-commerce | Carrito, ItemCarrito, Orden, ItemOrden, DireccionEnvio, Pago, Retiro, Transaccion |
| Torneos | Torneo, InscripcionTorneo, PremioTorneo, SponsorTorneo |
| Partidas | Partida, PartidaTorneo, ParticipantePartida, ResultadosPartida |
| Social | Review, Reporte |

### 🎮 Controladores (14 controladores)
| Controlador | Rutas disponibles | Form Requests |
| :--- | :--- | :--- |
| ProductoController | GET index/show (público), POST/PUT/DELETE (admin) | ✅ Store + Update |
| CategoriaController | GET index/show (público), POST/PUT/DELETE (admin) | ❌ Pendiente |
| JuegoController | GET index/show (público), POST/PUT/DELETE (admin) | ❌ Pendiente |
| UserController | CRUD completo (sólo admin) | ❌ Pendiente |
| ProveedorController | CRUD completo (sólo admin) | ❌ Pendiente |
| TorneoController | GET (público), POST (auth), PUT/DELETE (owner) | ✅ Store + Update |
| OrdenController | CRUD (auth + owner) | ✅ Store + Update |
| CarritoController | CRUD (auth) | ✅ Store |
| PartidaController | CRUD (auth) + join | ✅ Store + Update |
| InscripcionTorneoController | CRUD (auth) | ❌ Pendiente |
| ReviewController | GET/POST/DELETE (auth) | ✅ Store |
| ReporteController | CRUD (sólo admin) | ❌ Pendiente |
| DireccionEnvioController | CRUD (auth) | ❌ Pendiente |
| ProfileController | Edit/Update/Destroy | ❌ Pendiente |

### 🛡️ Middleware implementado
- `auth:sanctum` — Autenticación por token
- `throttle:api` — Rate limiting (60 req/min auth, 30 sin auth)
- `role:admin` / `role:admin,staff` — Control de roles
- `torneo.owner` — Verifica que el usuario es dueño del torneo
- `orden.owner` — Verifica que el usuario es dueño de la orden

### 🚦 Rutas API (`routes/api.php`)
**PÚBLICAS:**
- GET `/api/productos` → index (catálogo)
- GET `/api/productos/{id}` → show
- GET `/api/categorias` → index
- GET `/api/juegos` → index
- GET `/api/torneos` → index
- GET `/api/torneos/{id}` → show

**AUTH (Sanctum):**
- GET `/api/user` → usuario autenticado
- GET/POST/PUT/DELETE `/api/ordenes` → OrdenController
- GET/POST/PUT/DELETE `/api/carritos` → CarritoController
- GET/POST/PUT/DELETE `/api/partidas` → PartidaController
- GET/POST/PUT/DELETE `/api/inscripciones-torneo` → InscripcionTorneoController
- GET/POST/PUT/DELETE `/api/direcciones-envio` → DireccionEnvioController
- GET/POST/PUT/DELETE `/api/reviews` → ReviewController

**ADMIN:**
- `/api/users`, `/api/proveedores`, `/api/reportes`

**ADMIN+STAFF:**
- POST/PUT/DELETE `/api/categorias`, `/api/productos`, `/api/juegos`

> [!WARNING]
> **GAP:** No existe AuthController (login/register). La ramificación del backend no tiene rutas /api/login, /api/register, /api/logout. El frontend confía en el sistema de auth de Inertia/Breeze (routes/auth.php).

---

## 🖥️ FRONTEND — Análisis rama por rama

### 📐 Stack técnico
- React 18 + Inertia.js (SSR-like, sin SPA pura)
- Tailwind CSS (estilos)
- Lucide React (iconos)
- Breeze (scaffolding de auth)

### 🏠 frontend-home — Página principal
- **Página**: `Pages/Home.jsx`
- **Props**: `{ games, products, tournaments }` via Inertia
- **Componentes**:
  - `BannerCarousel` — Carrusel de banners (hardcoded)
  - `GamesCarousel` — Consume `games[]`
  - `MerchSection` — Consume `products[]` (precio_venta, imagen_principal)
  - `TournamentsSection` — Consume `tournaments[]`

### 🎯 frontend-landing_page — Landing pública
- **Página**: `Pages/LandingPage.jsx`
- **Estado**: Datos hardcoded, no consume API.

### 🛒 frontend-shop — Tienda
- **Página**: `Pages/Shop.jsx`
- **Props**: `{ productos = [] }` via Inertia
- **GAPs**: Búsqueda/filtros en cliente, categorías hardcoded.

### 📦 feature/frontend-product — Detalle de producto
- **Página**: `Pages/Product.jsx`
- **Props**: `{ producto, relacionados }` via Inertia
- **Componentes**: `ProductGallery`, `ProductInfo`, `VariantSelector`, `AddToCartBar`, `ProductAccordion`, `RelatedProducts`.

### 🛍️ feature/frontend-carrito — Carrito de compras
- **Contexto**: `CartContext.jsx` (localStorage)
- **GAPs**: No persiste en backend, no hay checkout dinámico.

### 🔐 frontend-panel_admin — Panel de administración
- **Páginas**: Dashboard, Products, Categories, Orders, Proveedores, Reviews, Reports, Finanzas.
- **GAP CRÍTICO**: Rutas `panel.ecommerce.*` no existen en `web.php`.

---

## 🔴 GAPS CRÍTICOS IDENTIFICADOS
1. **AuthController inexistente en API**: El frontend usa Breeze web sessions; la API usa Sanctum.
2. **Carrito offline**: El `CartContext` solo usa localStorage.
3. **Panel Admin huérfano**: Sin rutas web definidas.
4. **Checkout incompleto**: Falta integración con `OrdenController`.
5. **Filtros estáticos**: Categorías de la tienda no vienen de la BD.

---

## 📋 PRÓXIMOS PASOS PRIORIZADOS

### Prioridad ALTA
- [ ] Crear rutas web para el Panel Admin en `web.php`
- [ ] Implementar `OrdenService` y `CarritoService`
- [ ] Conectar `CartContext` con la API para checkout
- [ ] Añadir `withCount('inscripciones')` en `TorneoController`

### Prioridad MEDIA
- [ ] Categorías dinámicas en la tienda
- [ ] Creación de la página de Checkout
- [ ] Fusión de ramas hacia `dev`

---
[🔙 Volver al Hub](../00_HUB.md) | *Visión del Proyecto - TierOne*
