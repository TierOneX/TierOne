# ⚛️ Definición Exhaustiva del Frontend (JSX/React)

Este documento detalla la estructura y propósito de las vistas principales del frontend de TierOne.

---

## 📂 Vistas de E-commerce

### `Shop.jsx`
- **Responsabilidad**: Interfaz de catálogo.
- **Componentes Clave**: `ProductCard`, `FilterSidebar`.
- **Lógica**: Maneja el estado de los filtros dinámicos y la paginación vía API.

### `ProductCustomizer.jsx`
- **Responsabilidad**: Editor visual de productos personalizables.
- **Tecnología**: **Fabric.js** para la manipulación de canvas.
- **Lógica**: 
  - Permite añadir texto, imágenes y cambiar colores.
  - Genera un render final en base64 para el `InvoiceService`.
  - Calcula el recargo de personalización en tiempo real.

### `Checkout.jsx`
- **Responsabilidad**: Formulario de pago final.
- **Integración**: `Stripe Elements`.
- **Lógica**: Valida la dirección de envío y confirma el `PaymentIntent` generado por el backend.

---

## 📂 Vistas Gaming y Comunidad

### `PanelAdminGaming.jsx`
- **Responsabilidad**: Centro de mando para administradores.
- **Secciones**:
  - **Torneos**: Creación y edición.
  - **Partidas**: Monitorización de resultados en vivo.
  - **Usuarios**: Gestión de baneos y roles.
  - **Finanzas**: Aprobación de retiros y gráficas de ingresos.

### `MatchDetail.jsx`
- **Responsabilidad**: Visualización de una partida específica.
- **Características**: Chat en tiempo real, estadísticas de jugadores y feed de eventos del juego.

---

## 📂 Infraestructura de React

### `App.jsx`
- **Responsabilidad**: Punto de entrada y definición de rutas (React Router).
- **Middleware**: Envuelve la aplicación en proveedores de contexto (`AuthContext`, `CartContext`).

### `Contexts/AuthContext.jsx`
- **Responsabilidad**: Almacena el estado del usuario autenticado, su avatar de Twitch y su balance de Hydra Coins en toda la aplicación.

### `Contexts/CartContext.jsx`
- **Responsabilidad**: Gestiona el carrito de compras, persistiendo los datos en `localStorage` y sincronizándolos con el servidor.

---
[🔙 Volver al Hub](../00_HUB.md) | *Referencia Frontend - TierOne*
