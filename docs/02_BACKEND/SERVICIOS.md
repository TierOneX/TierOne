# 🛠️ Definición Exhaustiva de Servicios y Lógica

Este documento detalla el "cerebro" del sistema, donde reside la lógica de negocio pura de TierOne.

---

## 📂 Finanzas y Facturación

### `InvoiceService.php`
- **Lógica**: Generación de PDFs legales.
- **Detalle de Implementación**:
  - Utiliza `Barryvdh\DomPDF\Facade\Pdf`.
  - Carga dinámicamente imágenes en Base64 para evitar errores de renderizado.
  - Formatea montos según la normativa de IVA española (21%).

### `OrderService.php`
- **Lógica**: Gestión de transaccionalidad de pedidos.
- **Detalle de Implementación**:
  - `createOrder()` envuelve todas las operaciones en un bloque `DB::transaction`.
  - Genera números de seguimiento (`tracking_number`) una vez la orden pasa a estado `enviada`.

---

## 📂 Integraciones Externas

### `TwitchAuthService.php`
- **Lógica**: Sincronización de perfiles sociales.
- **Detalle de Implementación**:
  - Maneja el intercambio de `code` por `access_token`.
  - Mapea campos de Twitch (`display_name`, `profile_image_url`) a la tabla local `users`.

### `TwitchStreamService.php`
- **Lógica**: Verificación de estado "Live".
- **Detalle de Implementación**:
  - Consulta el endpoint `GET /streams` de Twitch API.
  - Almacena en caché los resultados para evitar exceder los límites de la API (Rate Limiting).

---

## 📂 E-commerce Avanzado

### `CustomizationService.php`
- **Lógica**: Motor del personalizador.
- **Detalle de Implementación**:
  - `calcularRecargo()`: Cruza el array de `zonas` con los precios base para añadir el coste de personalización al total de Stripe.
  - `saveRenderedDesign()`: Convierte el canvas de React en un archivo `.png` físico en el servidor para que el proveedor sepa qué producir.

---

## 📂 Catálogo

### `ProductService.php`
- **Lógica**: Reglas de negocio del stock.
- **Detalle de Implementación**:
  - Gestión de variantes: Si una variante se agota, el producto puede seguir listado pero la variante se marca como `out_of_stock`.

---
[🔙 Volver al Hub](../00_HUB.md) | *Referencia de Lógica - TierOne*
