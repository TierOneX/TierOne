# Documentación de la Página de Tienda (Shop)

Esta página gestiona la visualización del catálogo completo de productos de TierOne, permitiendo a los usuarios navegar, filtrar y descubrir artículos de merchandising. Se encuentra implementada en `resources/js/Pages/Shop.jsx`, utilizando **React** y **Inertia.js** para recibir datos del backend.

## 1. Estructura y Componentes Principales

La página `Shop` utiliza varios elementos clave para construir su interfaz:

### 1.1 Layout Principal (`MainLayout`)
Envuelve todo el contenido de la tienda. Este layout (`resources/js/Layouts/MainLayout.jsx`) es responsable de renderizar el **Header** (navegación superior) y el **Footer** (pie de página) de manera consistente en toda la aplicación.
- Garantiza que la tienda mantenga la identidad visual del sitio.

### 1.2 Sección Hero
La parte superior de la página presenta un encabezado impactante:
- **Título**: "Tienda" con un gradiente de texto (`bg-clip-text`) para un efecto metálico/premium.
- **Subtítulo**: Texto descriptivo que refuerza la exclusividad de los productos ("Merhandising de la mejor calidad...").
- **Estilo**: Fondo oscuro con un gradiente vertical (`from-black via-gray-900`) para dar profundidad.

### 1.3 Barra de Herramientas (Search & Filter)
Ubicada debajo del Hero, permite la interacción del usuario:
- **Buscador**: Un input de texto (`searchTerm`) con un icono de lupa SVG. Al escribir, actualiza el estado local aunque la lógica de filtrado actual es visual (se puede conectar a una API de búsqueda).
- **Botón de Filtros**: Un botón "FILTER" que alterna la variable de estado `showFilter`. Aunque actualmente solo cambia el estado visual, está preparado para desplegar un panel de filtros avanzados en el futuro.

### 1.4 Navegación por Categorías
Una lista horizontal de botones tipo "píldora" que permite filtrar los productos.
- **Categorías Definidas**: `ALL`, `HOODIES`, `JERSEYS`, `BOTTOMS`, `ACCESSORIES`, `HEADWEAR`.
- **Comportamiento**: Al hacer clic en una categoría, se actualiza el estado `activeCategory`. El botón activo se resalta con fondo blanco y texto negro, mientras que los inactivos tienen borde gris y fondo transparente.
- **Scroll**: En dispositivos móviles, esta lista tiene desplazamiento horizontal (`overflow-x-auto`) con la barra de scroll oculta (`scrollbar-hide`) para una experiencia limpia.

---

## 2. Gestión de Datos y Estado

El componente `Shop` gestiona tanto los datos que vienen del servidor como el estado de la interfaz de usuario.

### 2.1 Props e Iniciación
El componente recibe la prop `productos` desde el controlador de Laravel (vía Inertia).
```jsx
export default function Shop({ productos = [] }) { ... }
```
- **Datos Reales**: Si `productos` contiene un array con elementos, la página renderizará esos datos.
- **Datos Mock (Fallback)**: Si `productos` llega vacío (por ejemplo, durante el desarrollo o si la BD está vacía), el componente utiliza automáticamente un array interno `mockProducts` con datos de ejemplo (camisetas, sudaderas, etc.).

### 2.2 Estados Locales (`useState`)
- `searchTerm`: String. Almacena el texto de búsqueda actual.
- `activeCategory`: String (Default: 'ALL'). Almacena la categoría seleccionada por el usuario.
- `showFilter`: Boolean. Controla si se muestran opciones de filtro adicionales.
- `isHovered` (en `ProductCard`): Boolean. Controla si el cursor está sobre un producto para activar animaciones.

---

## 3. Renderizado de Productos (`ProductCard`)

La visualización de cada artículo se delega en el subcomponente `ProductCard`, que encapsula la lógica de presentación individual.

### 3.1 Anatomía de la Tarjeta
- **Contenedor**: Borde sutil que se ilumina (`border-red-600/50`) al hacer hover.
- **Badge "Destacado"**: Si el producto tiene `product.destacado === true`, muestra una etiqueta roja "Tournament Discount" en la esquina superior izquierda.
- **Imagen**:
    - Muestra la imagen principal del producto (`imagen_principal`).
    - **Efecto Hover**: La imagen hace zoom (`scale-110`) suavemente cuando el usuario pasa el ratón.
    - **Fallback**: Si no hay imagen, muestra un contenedor gris con un icono de imagen genérico SVG.
- **Botón "Quick View"**: Aparece desde abajo con una animación de deslizamiento (`translate-y-0`) solo al hacer hover sobre la tarjeta.

### 3.2 Precios y Descuentos
La tarjeta calcula y muestra la información de precios:
- **Precio Venta**: Se muestra siempre destacado en blanco y grande.
- **Precio Proveedor/Original**: Si `precio_proveedor > precio_venta` (indicando un descuento), se muestra el precio original tachado (`line-through`) y en gris al lado del precio actual.

---

## 4. Adaptabilidad y UX (Responsive Design)

La página está diseñada con Tailwind CSS siguiendo la filosofía "Mobile First":
- **Grilla de Producos (`grid-cols`)**:
    - Móvil: 1 columna.
    - Tablet (sm): 2 columnas.
    - Desktop (lg): 3 columnas.
    - Pantallas Ultra (xl): 4 columnas.
- **Feedback de Inventario Vacío**: Si la lista de productos a mostrar está vacía, se renderiza un bloque específico con un borde discontinuo y un mensaje "No products found", invitando al usuario a esperar al próximo "drop".
- **Botón "Load More"**: Se muestra al final de la lista si hay productos, simulando una paginación o carga infinita (actualmenet visual).

## 5. Futuras Mejoras Sugeridas
- Conectar el buscador y los filtros de categoría directamente con el backend de Laravel para realizar filtrado en servidor.
- Implementar la funcionalidad del botón "Load More" para paginación real.
- Añadir funcionalidad al botón "Quick View" (abrir un modal con detalles del producto).
