# Documentación de la Página de Inicio (Home)

La página `Home` es el punto de entrada principal de la aplicación TierOne. Está diseñada para ofrecer una visión general rápida de las secciones más importantes de la plataforma: torneos, juegos, tienda y comunidad.
Se implementa en `resources/js/Pages/Home.jsx`.

## 1. Estructura General

La página se compone de varios bloques apilados verticalmente, envueltos en el layout principal.

```jsx
<div className="min-h-screen" style={{ background: '#0B0B0B', color: '#ffffff' }}>
    <Header />
    <BannerCarousel />
    <GamesCarousel />
    <MerchSection />
    <TournamentsSection />
    <Footer />
</div>
```

---

## 2. Componentes Clave

### 2.1 Header (`Components/Header.jsx`)
La barra de navegación superior.
- **Transparencia y Scroll**: Cambia su opacidad y sombra al hacer scroll (`useEffect` detecta `window.scrollY`).
- **Navegación**: Enlaces a las secciones principales (Inicio, Partidas, Torneos, Tienda).
- **Responsive**: Incluye un menú hamburguesa para móviles y una barra de navegación inferior fija (`mobileBottomNav`) para facilitar el acceso en pantallas pequeñas.

### 2.2 Carrusel Principal (`Components/Home/BannerCarousel.jsx`)
Muestra banners destacados a pantalla completa (o casi, `80vh`).
- **Rotación Automática**: Cambia de banner cada 6 segundos (`setInterval`).
- **Transiciones**: Efecto de opacidad (`opacity-0` a `opacity-1`) suave.
- **Contenido**: Cada banner tiene un título grande, subtítulo, botón de llamada a la acción (CTA) y un "badge" o etiqueta.

### 2.3 Carrusel de Juegos (`Components/Home/GamesCarousel.jsx`)
Presenta los juegos disponibles en la plataforma.
- **Comportamiento Dual**:
    - **Desktop**: Scroll horizontal suave con flechas de navegación que desplazan el contenedor.
    - **Móvil**: Muestra una sola tarjeta a la vez con navegación automática o manual.
- **Estilo**: Tarjetas oscuras con imágenes de fondo (`object-cover`) y gradientes para mejorar la legibilidad del texto.

### 2.4 Sección de Merchandising (`Components/Home/MerchSection.jsx`)
Muestra una selección destacada de productos de la tienda.
- **Grid de Productos**: Diseño de rejilla responsive (`grid-cols-2` a `grid-cols-4`).
- **Tarjetas de Producto**: Muestran imagen, precio, categoría y rating. Incluyen efectos hover para revelar el botón "Ver producto".

### 2.5 Sección de Torneos (`Components/Home/TournamentsSection.jsx`)
Lista los próximos torneos o los que están en curso.
- **Estado del Torneo**: Muestra visualmente si el torneo está "ABIERTO", "EN CURSO" o "FINALIZADO" mediante colores y etiquetas.
- **Barra de Progreso**: Indica el porcentaje de plazas ocupadas (`inscripciones / max_participantes`).

---

## 3. SEO y Metadatos
Utiliza el componente `<Head>` de Inertia.js para inyectar etiquetas en el `<head>` del documento HTML.
- **Title**: "Inicio - TierOne Gaming"
- **Meta Description**: Descripción optimizada para buscadores sobre la plataforma.

## 4. Estilos Globales
- **Fondo**: `#0B0B0B` (Casi negro, "Night Black").
- **Acento**: `#e31837` (Rojo TierOne).
- **Tipografía**: Fuentes sans-serif modernas con uso intensivo de mayúsculas (UPPERCASE) y pesos elevados (Black/Bold) para títulos.
