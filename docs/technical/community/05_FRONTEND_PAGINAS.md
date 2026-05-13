# 05 — Frontend: Páginas y Componentes React (Inertia)

Todas las páginas usan **Inertia.js** (no React Router). Los datos llegan como props desde el controlador Laravel.

---

## Estructura de Archivos

```
resources/js/
├── Pages/
│   └── Community/
│       ├── Index.jsx            ← Explorador de juegos + Trending
│       └── GameProfile.jsx      ← Ficha completa de un juego
├── Components/
│   └── Community/
│       ├── GameCard.jsx          ← Tarjeta de juego para el grid
│       ├── GameHero.jsx          ← Banner hero con artwork de fondo
│       ├── GameInfo.jsx          ← Sinopsis, developer, rating, tags
│       ├── TrailerPlayer.jsx     ← Reproductor de trailer de YouTube
│       ├── LiveStreamGrid.jsx    ← Grid de streams en vivo
│       ├── StreamCard.jsx        ← Tarjeta individual de stream
│       ├── ClipCarousel.jsx      ← Carrusel de clips populares
│       ├── SimilarGames.jsx      ← Fila de juegos similares
│       ├── GameWebLinks.jsx      ← Links a Steam, Discord, Reddit, etc.
│       └── TrendingBar.jsx       ← Barra de trending (top Twitch)
```

---

## Página 1: `Community/Index.jsx`

**Ruta**: `/community`
**Props desde Inertia**: `{ juegos, topGames }`

### Secciones:
1. **Hero Banner**: Artwork aleatorio de un juego destacado como fondo (glassmorphism).
2. **Trending Bar**: Los 10 juegos más populares en Twitch ahora mismo (horizontal scroll).
3. **Grid de Juegos**: Tarjetas con portada, nombre, rating y género. Click → `/community/{slug}`.
4. **Filtros**: Por género (MOBA, Shooter, RPG), por plataforma, búsqueda por nombre.

### Wireframe Conceptual:
```
┌──────────────────────────────────────────────────────────────┐
│  ▓▓▓▓▓▓▓▓▓▓▓▓ HERO: Artwork de fondo ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  │
│  ░░░░░░░░░░░░  Glassmorphism overlay  ░░░░░░░░░░░░░░░░░░░  │
│       🎮 COMUNIDAD TIERONE                                   │
│       Explora, conecta, compite                              │
│       [🔍 Buscar juego...]                                   │
├──────────────────────────────────────────────────────────────┤
│  🔥 TRENDING EN TWITCH AHORA                                │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ → scroll │
│  │ CS2 │ │ LoL │ │Val  │ │Fort │ │GTA  │ │Apex │           │
│  │120K │ │ 98K │ │ 75K │ │ 60K │ │ 55K │ │ 40K │           │
│  └─────┘ └─────┘ └─────┘ └─────┘ └─────┘ └─────┘           │
├──────────────────────────────────────────────────────────────┤
│  Filtros: [Todos] [MOBA] [Shooter] [RPG] [Battle Royale]    │
├──────────────────────────────────────────────────────────────┤
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │  Cover   │ │  Cover   │ │  Cover   │ │  Cover   │       │
│  │  LoL     │ │  CS2     │ │  Valo    │ │  Fortnite│       │
│  │  ⭐ 86/100│ │  ⭐ 91/100│ │  ⭐ 83/100│ │  ⭐ 78/100│       │
│  │  MOBA    │ │  Shooter │ │  Shooter │ │  BR      │       │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘       │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │  ...     │ │  ...     │ │  ...     │ │  ...     │       │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘       │
└──────────────────────────────────────────────────────────────┘
```

---

## Página 2: `Community/GameProfile.jsx`

**Ruta**: `/community/{slug}`
**Props desde Inertia**: `{ juego, liveStreams, topClips, torneos }`

### Secciones:
1. **GameHero**: Artwork/screenshot a pantalla completa como fondo + glassmorphism.
   - Portada oficial (cover) a la izquierda.
   - Nombre, developer, publisher, fecha, plataformas.
   - Rating de crítica y comunidad (dos barras circulares).
   - Tags de género y temática.
2. **TrailerPlayer**: Si hay `video_ids`, botón "Ver Trailer" que abre un modal con el reproductor de YouTube.
3. **Tabs de contenido**:
   - **Sobre el juego**: `summary` + `storyline` completo.
   - **En Vivo**: `LiveStreamGrid` con los streams actuales.
   - **Clips**: `ClipCarousel` con los mejores momentos de la semana.
   - **Torneos TierOne**: Torneos activos de este juego en la plataforma (enlazados).
   - **Galería**: Screenshots del juego en formato masonry/grid.
4. **Sidebar**: 
   - Links oficiales (Steam, Discord, Reddit, Twitter).
   - Juegos similares (`SimilarGames`).
   - Merch asociado (productos de TierOne filtrados por este juego, si los hay).

### Wireframe Conceptual:
```
┌──────────────────────────────────────────────────────────────┐
│  ▓▓▓▓▓▓▓ ARTWORK DE FONDO (1080p, blur + overlay) ▓▓▓▓▓▓▓  │
│  ┌─────────┐                                                │
│  │         │  LEAGUE OF LEGENDS                              │
│  │  COVER  │  Riot Games · 2009 · PC, Mac                   │
│  │ 264x374 │                                                 │
│  │         │  ⭐ Crítica: 86/100  |  👥 Comunidad: 82/100    │
│  │         │  [MOBA] [Strategy] [Fantasy]                    │
│  └─────────┘  [▶ Ver Trailer]  [🎮 Torneos]  [🛒 Merch]     │
├──────────────────────────────────────────────────────────────┤
│  [Sobre el juego] [En Vivo 🔴] [Clips] [Torneos] [Galería]  │
├──────────────────────────────────────────────────────────────┤
│                                           │                  │
│  📝 SOBRE EL JUEGO                        │ 🔗 LINKS         │
│  League of Legends is a fast-paced...     │ 🌐 Web Oficial   │
│  (summary completo)                       │ 💬 Discord        │
│                                           │ 📱 Reddit         │
│  📖 HISTORIA                              │ 🎮 Steam          │
│  In the world of Runeterra...             │                  │
│  (storyline completo)                     │ 🎮 SIMILARES      │
│                                           │ ┌────┐ ┌────┐    │
│  📺 EN VIVO AHORA                         │ │Dota│ │HotS│    │
│  ┌────────┐ ┌────────┐ ┌────────┐        │ │ 2  │ │    │    │
│  │Stream1 │ │Stream2 │ │Stream3 │        │ └────┘ └────┘    │
│  │Faker   │ │Caps    │ │Tyler1  │        │                  │
│  │12.4K 👁 │ │8.2K 👁 │ │6.1K 👁 │        │ 🛒 MERCH         │
│  └────────┘ └────────┘ └────────┘        │ Camiseta LoL     │
│  ┌────────┐ ┌────────┐ ┌────────┐        │ Gorra Riot       │
│  │Stream4 │ │Stream5 │ │Stream6 │        │                  │
│  └────────┘ └────────┘ └────────┘        │                  │
│                                           │                  │
│  🎬 CLIPS DE LA SEMANA                    │                  │
│  ← [Clip 1] [Clip 2] [Clip 3] [Clip 4] →│                  │
│                                           │                  │
└──────────────────────────────────────────────────────────────┘
```

---

## Componentes Clave

### `GameCard.jsx`
- Portada con hover: zoom + overlay de glassmorphism con datos.
- Badge de rating (color dinámico: verde > 80, amarillo > 60, rojo < 60).
- Tags de género como pills.
- Indicador "LIVE" si hay streams activos.

### `LiveStreamGrid.jsx`
- Grid responsivo de tarjetas de stream.
- Auto-refresh cada 90 segundos usando `useEffect` + `router.reload({ only: ['liveStreams'] })` de Inertia.
- Estado vacío: "No hay streams en vivo ahora. ¡Vuelve más tarde!"

### `ClipCarousel.jsx`
- Carrusel horizontal con controles prev/next.
- Click en clip → abre modal con iframe embebido del clip de Twitch.
- Muestra: thumbnail, título, streamer, vistas, duración.

### `TrailerPlayer.jsx`
- Modal con iframe de YouTube.
- Si no hay trailer (`video_ids` vacío): no se muestra el botón.
- Selector si hay múltiples videos.

### `SimilarGames.jsx`
- Fila horizontal de portadas pequeñas.
- Click → navega a `/community/{slug}` del juego similar (si existe en TierOne) o muestra tooltip informativo.

### `GameWebLinks.jsx`
- Iconos clicables: Steam, Discord, Reddit, Twitter, YouTube, web oficial.
- Mapeo de `websites.category` a iconos:
  - 1 → 🌐, 4 → Facebook, 5 → Twitter/X, 6 → Twitch, 9 → YouTube, 11 → Steam, 12 → Reddit, 16 → Discord

---

## Actualización del Header/Navbar

Añadir un nuevo enlace "Comunidad" en `Header.jsx`:
```jsx
<NavLink href="/community" active={route().current('community.*')}>
    Comunidad
</NavLink>
```

---

## Helpers de Imágenes IGDB

Crear un helper reutilizable para construir URLs de imágenes de IGDB:

```jsx
// resources/js/Utils/igdb.js

/**
 * Construye la URL de una imagen de IGDB a partir de su image_id.
 * @param {string} imageId - El image_id de IGDB (ej: "co1wyy")
 * @param {string} size - Tamaño: 't_thumb', 't_cover_big', 't_screenshot_huge', 't_1080p', etc.
 * @returns {string} URL completa de la imagen
 */
export function igdbImageUrl(imageId, size = 't_cover_big') {
    if (!imageId) return '/images/placeholder-game.png';
    return `https://images.igdb.com/igdb/image/upload/${size}/${imageId}.jpg`;
}

/**
 * Tamaños predefinidos para uso rápido.
 */
export const IGDB_SIZES = {
    THUMB: 't_thumb',           // 90x128
    COVER: 't_cover_big',       // 264x374
    COVER_2X: 't_cover_big_2x', // 528x748
    SCREENSHOT: 't_screenshot_big',  // 889x500
    SCREENSHOT_HD: 't_screenshot_huge', // 1280x720
    FULL_HD: 't_1080p',         // 1920x1080
    ORIGINAL: 't_original',
};
```

> [!TIP]
> Al usar `image_id` en lugar de URLs completas en la BD, podemos cambiar el tamaño de la imagen dinámicamente en el frontend sin necesidad de volver a consultar la API. Una portada en un listado usa `t_cover_big`, pero la misma portada como fondo hero usa `t_1080p`.
