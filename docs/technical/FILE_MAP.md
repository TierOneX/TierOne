# 🗺️ Mapa de Archivos del Proyecto

Este documento proporciona una descripción detallada de cada archivo clave en el ecosistema **TierOne**, organizado por capas y módulos.

---

## 🚀 Raíz del Repositorio
| Archivo | Descripción |
|---------|-------------|
| `scripts/install.bat` | Script de instalación automatizada para Windows. |
| `scripts/ENV_CONFIG.md` | Documentación de todas las variables de entorno necesarias. |
| `AGENTS.md` | Guía de reglas y contexto para asistentes de IA. |
| `README.md` | Punto de entrada principal y visión general del proyecto. |

---

## 🧠 Backend (Laravel - /TierOne)

### 📂 App (Lógica de Negocio)
| Ruta | Clase | Descripción |
|------|-------|-------------|
| `app/Http/Controllers/` | `ShopController.php` | Gestiona el catálogo de productos y el carrito. |
| `app/Http/Controllers/` | `TournamentController.php` | Controla la creación de torneos, inscripciones y brackets. |
| `app/Http/Controllers/` | `StripeController.php` | Integración con la pasarela de pagos y webhooks. |
| `app/Http/Controllers/` | `InvoiceController.php` | Generación de facturas PDF tras la compra. |
| `app/Models/` | `Product.php` | Modelo de datos para merchandising y stock. |
| `app/Models/` | `Tournament.php` | Lógica de datos de torneos y participantes. |
| `app/Models/` | `User.php` | Gestión de usuarios, roles y saldos. |
| `app/Services/` | `InvoiceService.php` | Lógica encapsulada para la creación de PDFs complejos. |

### 📂 Database (Estructura)
| Ruta | Descripción |
|------|-------------|
| `database/migrations/` | Definición cronológica de todas las tablas de MySQL. |
| `database/seeders/` | Datos de prueba (productos reales, torneos demo, usuarios). |

---

## 🎨 Frontend (React + Inertia - /TierOne/resources/js)

### 📂 Components (UI Reutilizable)
| Componente | Descripción |
|------------|-------------|
| `DesignCanvas.jsx` | Editor basado en Fabric.js para personalizar productos. |
| `ProductCard.jsx` | Tarjeta visual de producto con animaciones Framer Motion. |
| `CartDrawer.jsx` | Panel lateral para la gestión rápida del carrito. |
| `TournamentBracket.jsx` | Visualización dinámica de los emparejamientos del torneo. |

### 📂 Pages (Vistas principales)
| Página | Ruta | Descripción |
|--------|------|-------------|
| `Shop/Index.jsx` | `/shop` | Tienda principal con filtros y categorías. |
| `Customizer/Editor.jsx`| `/customize` | Herramienta de diseño 3D/2D para merchandising. |
| `Checkout/Payment.jsx` | `/checkout` | Formulario de pago seguro con Stripe Elements. |
| `Admin/Dashboard.jsx` | `/admin` | Panel de control para gestionar ventas y torneos. |

---

## ⚙️ Configuración y Herramientas
| Archivo | Descripción |
|---------|-------------|
| `vite.config.js` | Configuración del bundler para React y Tailwind CSS. |
| `tailwind.config.js` | Definición del sistema de diseño (colores gaming, tipografía). |
| `composer.json` | Dependencias de backend (Stripe SDK, DomPDF, Inertia). |
| `package.json` | Dependencias de frontend (Fabric.js, Framer Motion, Axios). |
