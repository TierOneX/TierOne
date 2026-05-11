# 02 — Datos en Tiempo Real de Twitch Helix API

Twitch Helix API nos da lo que IGDB no puede: **datos en vivo**. Quién está jugando ahora, los mejores clips de la semana, y el ranking de popularidad.

## Autenticación
Usamos las **mismas credenciales** de dev.twitch.tv que para IGDB.

```
POST https://id.twitch.tv/oauth2/token
Body:
  client_id={TWITCH_CLIENT_ID}
  client_secret={TWITCH_CLIENT_SECRET}
  grant_type=client_credentials
  
Respuesta:
  { "access_token": "abc123...", "expires_in": 5184000, "token_type": "bearer" }
```

> El token dura ~60 días. Se cachea y se renueva automáticamente.

---

## Endpoints y Datos Disponibles

### 📺 1. Streams en Vivo
```
GET https://api.twitch.tv/helix/streams?game_id={twitch_game_id}&first=10
Headers:
  Client-ID: {TWITCH_CLIENT_ID}
  Authorization: Bearer {access_token}
```

| Campo | Tipo | Uso en TierOne |
|---|---|---|
| `user_name` | String | Nombre del streamer |
| `user_login` | String | Username para link directo |
| `title` | String | Título del stream |
| `viewer_count` | Integer | Espectadores ahora mismo |
| `thumbnail_url` | String | Preview del stream (reemplazar `{width}` y `{height}`) |
| `language` | String | Idioma del stream (filtrar por `es` para la comunidad española) |
| `started_at` | DateTime | Cuánto tiempo lleva en directo |
| `type` | String | `"live"` = en directo |
| `tags` | Array | Tags del stream (ej: "Competitivo", "Español") |

**Thumbnail URL personalizable:**
```
https://static-cdn.jtvnbs.net/previews-ttv/live_user_{user_login}-{width}x{height}.jpg

Ejemplos:
  440x248  → Tarjeta de stream
  640x360  → Preview mediano
  1280x720 → Preview grande
```

### 🎬 2. Clips Populares
```
GET https://api.twitch.tv/helix/clips?game_id={twitch_game_id}&first=6&started_at={7_days_ago}
```

| Campo | Tipo | Uso en TierOne |
|---|---|---|
| `title` | String | Título del clip |
| `url` | String | Link directo al clip en Twitch |
| `embed_url` | String | URL para embeber el clip con iframe |
| `broadcaster_name` | String | Canal de donde se sacó el clip |
| `creator_name` | String | Quién creó el clip |
| `view_count` | Integer | Visualizaciones totales |
| `thumbnail_url` | String | Preview del clip |
| `duration` | Float | Duración en segundos |
| `created_at` | DateTime | Cuándo se creó |

### 🏆 3. Ranking Global de Juegos (Top Games)
```
GET https://api.twitch.tv/helix/games/top?first=20
```

| Campo | Tipo | Uso en TierOne |
|---|---|---|
| `id` | String | **twitch_game_id** → vincular con IGDB |
| `name` | String | Nombre del juego |
| `box_art_url` | String | Portada del juego en Twitch (reemplazar `{width}x{height}`) |
| *(posición en la lista)* | Integer | Ranking de popularidad por espectadores |

### 🔍 4. Buscar Juego en Twitch (para vincular IDs)
```
GET https://api.twitch.tv/helix/games?name={game_name}
```

| Campo | Tipo | Uso en TierOne |
|---|---|---|
| `id` | String | `twitch_game_id` → guardar en tabla `juegos` |
| `name` | String | Nombre oficial en Twitch |
| `box_art_url` | String | Portada alternativa |
| `igdb_id` | String | **¡Vinculación directa con IGDB!** |

> [!IMPORTANT]
> Este endpoint devuelve el `igdb_id` directamente, lo que nos permite vincular automáticamente un juego de Twitch con su ficha completa en IGDB.

### 📊 5. Estadísticas de Juego (Viewer Count Actual)
Usando el endpoint de Streams con agregación:
```
GET https://api.twitch.tv/helix/streams?game_id={id}&first=1
```
Sumando los `viewer_count` de todos los streams activos obtenemos el **total de espectadores globales** del juego.

---

## Mapa de Vinculación entre APIs

```
┌─────────────────────┐     ┌──────────────────────┐
│   Tabla `juegos`    │     │   Twitch Helix API   │
│                     │     │                      │
│  igdb_id ──────────────────── igdb_id            │
│  twitch_game_id ───────────── id (game)          │
│  nombre ───────────────────── name               │
│                     │     │                      │
│  (datos estáticos   │     │  (datos en vivo)     │
│   de IGDB)          │     │  streams, clips,     │
│                     │     │  rankings            │
└─────────────────────┘     └──────────────────────┘
         │
         │ igdb_id
         ▼
┌─────────────────────┐
│     IGDB API        │
│                     │
│  cover, artworks,   │
│  screenshots,       │
│  summary, storyline │
│  genres, companies  │
│  ratings, videos    │
└─────────────────────┘
```

## Datos que se Muestran en Tiempo Real (Sin Guardar en BD)
Estos datos **no se almacenan** en MySQL, solo se cachean temporalmente:

| Dato | TTL Caché | Motivo |
|---|---|---|
| Streams en vivo | 90 segundos | Cambian constantemente |
| Clips populares | 1 hora | Se actualizan periódicamente |
| Top Games ranking | 5 minutos | Varía con las audiencias |
| Viewer count global | 2 minutos | Fluctúa por segundo |

> [!TIP]
> Para la implementación inicial podemos usar `Cache::remember()` de Laravel con driver `database` (el que ya tiene TierOne configurado). Si en el futuro necesitamos más rendimiento, migrar a Redis es un cambio de una línea en `.env`.
