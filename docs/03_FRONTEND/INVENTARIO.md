# ⚛️ Inventario Detallado del Frontend (React)

TierOne utiliza React con Vite para ofrecer una experiencia de usuario rápida y dinámica, enfocada en una estética "Premium Gaming".

---

## 📂 Páginas Principales (`resources/js/Pages`)

### `Shop.jsx`
- **Función**: Catálogo interactivo de productos.
- **Características**: Filtros laterales reactivos, búsqueda en tiempo real y grid animado de productos.

### `Product.jsx`
- **Función**: Ficha técnica de un producto individual.
- **Características**: Selector de variantes (talla/color), carrusel de imágenes y acceso al personalizador.

### `ProductCustomizer.jsx`
- **Función**: El editor de ropa basado en **Fabric.js**.
- **Características**: Manipulación de capas, carga de imágenes de usuario, y renderizado del diseño final para el checkout.

### `Cart.jsx`
- **Función**: Gestión de la bolsa de la compra.
- **Características**: Sincronización inmediata con el backend y persistencia local (LocalStorage) para usuarios no logueados.

### `Checkout.jsx` / `HydraCheckout.jsx` / `TournamentCheckout.jsx`
- **Función**: Pasarelas de pago especializadas.
- **Características**: Integración con **Stripe Elements**, validación de direcciones y manejo de estados de carga/error del pago.

### `Tournaments.jsx` / `MatchDetail.jsx`
- **Función**: El núcleo competitivo.
- **Características**: Brackets de torneos, estadísticas de partidas en vivo y chat de comunidad.

### `PanelAdminGaming.jsx`
- **Función**: Panel de control todo-en-uno para administradores.
- **Características**: Es un componente masivo que gestiona usuarios, torneos, finanzas y reportes técnicos.

---

## 📂 Arquitectura de Componentes (`resources/js/Components`)

- **`Layouts/`**: Definición de la barra de navegación (Navbar), el pie de página (Footer) y la barra lateral de usuario.
- **`Contexts/`**: Gestión de estado global (Ej: `AuthContext` para el usuario y `CartContext` para el carrito).
- **`Utils/`**: Funciones auxiliares para formateo de moneda (EUR), fechas y manejo de errores de API.

---

## 🎨 Estética y Diseño
- **TailwindCSS**: Utilizado para garantizar la consistencia visual. Los colores base (oscuros con acentos neón) están definidos en `tailwind.config.js`.
- **Framer Motion**: Utilizado para micro-animaciones (hovers, transiciones de página y modales).

---
[🔙 Volver al Hub](../00_HUB.md) | *Interfaz de Usuario - TierOne*
