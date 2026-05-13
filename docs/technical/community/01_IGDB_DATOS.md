# 01 — Datos de IGDB (Base de Datos de Videojuegos)

IGDB es propiedad de Twitch/Amazon y es la base de datos de videojuegos más completa del mundo.
Se accede a ella con las mismas credenciales de `dev.twitch.tv`.

## Endpoint Principal
```
POST https://api.igdb.com/v4/games
Headers:
  Client-ID: {TWITCH_CLIENT_ID}
  Authorization: Bearer {access_token}
Body (formato Apicalypse):
  fields name, summary, storyline, cover.*, screenshots.*, artworks.*, videos.*, 
         genres.name, themes.name, platforms.name, 
         involved_companies.company.name, involved_companies.developer, involved_companies.publisher,
         similar_games.name, similar_games.cover.*, 
         aggregated_rating, aggregated_rating_count, rating, rating_count,
         first_release_date, game_modes.name, player_perspectives.name,
         websites.url, websites.category, franchises.name, collections.name;
  where slug = "league-of-legends";
```

## Mapa Completo de Campos

### 🎨 Visuales (Imágenes)
| Campo IGDB | Tipo | Uso en TierOne | Resolución |
|---|---|---|---|
| `cover.url` | String | Portada principal en listados y tarjetas | 264×374 → 720×1024 |
| `cover.image_id` | String | Construir URL con tamaño personalizado | `https://images.igdb.com/igdb/image/upload/t_{size}/{image_id}.jpg` |
| `screenshots[].url` | Array | Fondo hero de la página del juego (glassmorphism) | 1920×1080 |
| `screenshots[].image_id` | Array | Galería de capturas en la ficha | Múltiples tamaños |
| `artworks[].url` | Array | Banners promocionales, sliders de la home | 1920×1080 |
| `artworks[].image_id` | Array | Fondos de sección y overlays visuales | Máxima calidad |

**Tamaños de imagen disponibles** (sustituir `t_{size}` en la URL):
| Código | Resolución | Uso ideal |
|---|---|---|
| `t_thumb` | 90×128 | Miniaturas en listas |
| `t_cover_big` | 264×374 | Portada en tarjeta |
| `t_cover_big_2x` | 528×748 | Portada retina |
| `t_screenshot_big` | 889×500 | Capturas en galería |
| `t_screenshot_huge` | 1280×720 | Fondo hero |
| `t_1080p` | 1920×1080 | Fondo de pantalla completo |
| `t_original` | Original | Máxima calidad (pesado) |

### 📺 Multimedia (Vídeos)
| Campo IGDB | Tipo | Uso en TierOne |
|---|---|---|
| `videos[].video_id` | String | ID de YouTube → embeber trailer: `https://www.youtube.com/embed/{video_id}` |
| `videos[].name` | String | Título del vídeo (ej: "Official Trailer", "Gameplay") |

### 📝 Contenido Textual
| Campo IGDB | Tipo | Uso en TierOne |
|---|---|---|
| `name` | String | Nombre oficial del juego |
| `summary` | Text | Descripción corta para SEO, tarjetas y meta tags |
| `storyline` | Text | Historia completa del juego → sección "Sobre el juego" |

### 🏷️ Clasificación y Taxonomía
| Campo IGDB | Tipo | Uso en TierOne |
|---|---|---|
| `genres[].name` | Array | Tags de género: "MOBA", "Shooter", "RPG" |
| `themes[].name` | Array | Tags de temática: "Fantasía", "Ciencia ficción", "Bélico" |
| `game_modes[].name` | Array | Modos: "Multijugador", "Co-op", "Battle Royale" |
| `player_perspectives[].name` | Array | "Primera persona", "Tercera persona", "Vista isométrica" |
| `platforms[].name` | Array | "PC (Windows)", "PlayStation 5", "Nintendo Switch" |
| `franchises[].name` | Array | Franquicia: "Call of Duty", "Final Fantasy" |
| `collections[].name` | Array | Colección/saga a la que pertenece |

### 🏢 Empresas
| Campo IGDB | Tipo | Uso en TierOne |
|---|---|---|
| `involved_companies[].company.name` | Array | Nombre: "Riot Games", "Valve" |
| `involved_companies[].developer` | Boolean | Si es el desarrollador |
| `involved_companies[].publisher` | Boolean | Si es el publisher |

### ⭐ Métricas de Calidad
| Campo IGDB | Tipo | Uso en TierOne |
|---|---|---|
| `aggregated_rating` | Float (0-100) | Nota media de **crítica profesional** |
| `aggregated_rating_count` | Integer | Número de reviews profesionales |
| `rating` | Float (0-100) | Nota media de la **comunidad** |
| `rating_count` | Integer | Número de votos de la comunidad |

### 🔗 Relaciones
| Campo IGDB | Tipo | Uso en TierOne |
|---|---|---|
| `similar_games[].name` | Array | Nombres de juegos similares → "También te podría gustar" |
| `similar_games[].cover.*` | Array | Portadas de los juegos similares para la fila visual |
| `first_release_date` | Unix timestamp | Fecha de lanzamiento → convertir con `Carbon::createFromTimestamp()` |

### 🌐 Webs Oficiales
| Campo IGDB | `websites.category` | Uso |
|---|---|---|
| `websites[].url` | 1 = Oficial | Enlace a la web del juego |
| `websites[].url` | 4 = Facebook | Enlace a la comunidad de Facebook |
| `websites[].url` | 5 = Twitter/X | Enlace al perfil de Twitter |
| `websites[].url` | 6 = Twitch | Canal principal del juego en Twitch |
| `websites[].url` | 8 = Instagram | Enlace a Instagram |
| `websites[].url` | 9 = YouTube | Canal oficial de YouTube |
| `websites[].url` | 11 = Steam | Enlace a la tienda de Steam |
| `websites[].url` | 12 = Reddit | Subreddit del juego |
| `websites[].url` | 13 = Epic Games | Enlace a la tienda de Epic |
| `websites[].url` | 16 = Discord | Invitación al Discord oficial |

---

## Ejemplo de Respuesta Completa (League of Legends)
```json
{
  "id": 115,
  "name": "League of Legends",
  "slug": "league-of-legends",
  "summary": "League of Legends is a fast-paced, competitive online game...",
  "storyline": "In the world of Runeterra...",
  "cover": {
    "image_id": "co1wyy",
    "url": "//images.igdb.com/igdb/image/upload/t_cover_big/co1wyy.jpg"
  },
  "screenshots": [
    { "image_id": "sc6jrk", "url": "//images.igdb.com/..." },
    { "image_id": "sc6jrl", "url": "//images.igdb.com/..." }
  ],
  "artworks": [
    { "image_id": "ar1abc", "url": "//images.igdb.com/..." }
  ],
  "videos": [
    { "video_id": "7kGNJI1DBTc", "name": "Season 2024 Cinematic" }
  ],
  "genres": [
    { "name": "MOBA" },
    { "name": "Strategy" }
  ],
  "themes": [
    { "name": "Fantasy" }
  ],
  "involved_companies": [
    { "company": { "name": "Riot Games" }, "developer": true, "publisher": true }
  ],
  "aggregated_rating": 86.5,
  "rating": 82.3,
  "first_release_date": 1256688000,
  "similar_games": [
    { "name": "Dota 2", "cover": { "image_id": "co2xyz" } },
    { "name": "Heroes of the Storm", "cover": { "image_id": "co3abc" } }
  ]
}
```

> [!TIP]
> Todos los campos con `image_id` permiten construir URLs con el tamaño deseado. Conviene guardar el `image_id` en BD y construir la URL en el frontend según el contexto (miniatura vs fondo completo).
