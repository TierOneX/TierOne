# 🎮 Games & Matches API Contract

**Base URL**: `/api/v1`  
**Versión**: 1.0  
**Estado**: 🚧 Borrador

---

## 📋 Índice de Endpoints

### Juegos (Catálogo)
| Método | Endpoint | Descripción | Auth |
|:------:|----------|-------------|:----:|
| `GET` | `/games` | Listar juegos disponibles | 🔓 |
| `GET` | `/games/{id}` | Detalle del juego | 🔓 |
| `GET` | `/games/{id}/ranks` | Obtener rangos del juego | 🔓 |

### Partidas (Matches)
| Método | Endpoint | Descripción | Auth |
|:------:|----------|-------------|:----:|
| `GET` | `/matches` | Listar partidas (Lobby) | 🔓 |
| `POST` | `/matches` | Crear partida | 🔒 |
| `GET` | `/matches/{id}` | Detalle partida | 🔓 |
| `POST` | `/matches/{id}/join` | Unirse a partida | 🔒 |
| `POST` | `/matches/{id}/report` | Reportar resultado | 🔒 |
| `GET` | `/matches/active` | Mis partidas activas | 🔒 |

---

## 📝 Definición de Endpoints

### 1. Listar Juegos

**Descripción**: Obtiene el catálogo de juegos soportados por la plataforma.

- **URL**: `/api/v1/games`
- **Método**: `GET`
- **Autenticación**: Pública

#### 📤 Response

**✅ Success (200 OK)**

```json
{
  "data": [
    {
      "id": 1,
      "nombre": "League of Legends",
      "slug": "league-of-legends",
      "imagen_url": "https://...",
      "modos_juego": ["1v1", "5v5"],
      "api_integrada": true
    },
    {
      "id": 2,
      "nombre": "CS:GO",
      "slug": "csgo",
      "api_integrada": true
    }
  ]
}
```

---

### 2. Crear Partida

**Descripción**: Crea un nuevo desafío/partida pública o privada.

- **URL**: `/api/v1/matches`
- **Método**: `POST`
- **Autenticación**: `Bearer Token` ✅

#### 📩 Request

**Body Parameters**

| Campo | Tipo | Requerido | Descripción |
|-------|------|:---------:|-------------|
| `game_id` | Int | ✅ | ID del juego |
| `modo` | String | ✅ | `1v1`, `2v2`, `5v5` |
| `buy_in` | Decimal | ✅ | Apuesta por jugador (0 para free) |
| `titulo` | String | ❌ | Título opcional de la sala |

**Ejemplo Body**
```json
{
  "game_id": 1,
  "modo": "1v1",
  "buy_in": 5.00,
  "titulo": "Mid Lane Only - Noobs Keep Out"
}
```

#### 📤 Response

**✅ Success (201 Created)**

```json
{
  "success": true,
  "data": {
    "id": 5001,
    "titulo": "Mid Lane Only...",
    "status": "pending",
    "fecha_creacion": "...",
    "lobby_url": "https://tierone.com/lobby/5001"
  }
}
```

**❌ Errors**

| Código | Descripción |
|:------:|-------------|
| `402` | Saldo insuficiente para el buy-in |
| `400` | Modo de juego no válido |

---

### 3. Unirse a Partida

**Descripción**: Unirse a una partida existente. Bloquea el saldo del usuario.

- **URL**: `/api/v1/matches/{id}/join`
- **Método**: `POST`
- **Autenticación**: `Bearer Token` ✅

#### 📤 Response

**✅ Success (200 OK)**

```json
{
  "success": true,
  "message": "Te has unido a la partida",
  "match_status": "ready" // Si se llenó la sala
}
```

---

### 4. Reportar Resultado (Manual)

**Descripción**: Enviar el resultado de la partida (si no hay integración automática por API).

- **URL**: `/api/v1/matches/{id}/report`
- **Método**: `POST`
- **Autenticación**: `Bearer Token` ✅

#### 📩 Request

**Body Parameters**

| Campo | Tipo | Requerido | Descripción |
|-------|------|:---------:|-------------|
| `winner_id` | Int | ✅ | ID del usuario/equipo ganador |
| `score` | String | ❌ | Resultado (ej: "16-14") |
| `evidence_url`| String | ✅ | URL de screenshot/video |

**Ejemplo Body**
```json
{
  "winner_id": 101,
  "score": "1-0",
  "evidence_url": "https://imgur.com/..."
}
```

#### 📤 Response

**✅ Success (200 OK)**

```json
{
  "success": true,
  "message": "Resultado reportado. Esperando confirmación del rival.",
  "status": "verifying"
}
```

---
