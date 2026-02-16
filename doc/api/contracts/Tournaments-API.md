# 🏆 Tournaments API Contract

**Base URL**: `/api/v1/tournaments`  
**Versión**: 1.0  
**Estado**: 🚧 Borrador

---

## 📋 Índice de Endpoints

| Método | Endpoint | Descripción | Auth |
|:------:|----------|-------------|:----:|
| `GET` | `/` | Listar torneos (filtros) | 🔓 |
| `POST` | `/` | Crear torneo | 🔒 (Org) |
| `GET` | `/{id}` | Detalle del torneo | 🔓 |
| `POST` | `/{id}/join` | Inscribirse al torneo | 🔒 |
| `GET` | `/{id}/bracket` | Ver bracket/cuadro | 🔓 |
| `POST` | `/{id}/start` | Iniciar torneo | 🔒 (Admin/Org) |

---

## 📝 Definición de Endpoints

### 1. Listar Torneos

**Descripción**: Obtiene una lista paginada de torneos con filtros opcionales.

- **URL**: `/api/v1/tournaments`
- **Método**: `GET`
- **Autenticación**: Pública

#### 📩 Request

**Query Parameters**

| Param | Tipo | Descripción | Ejemplo |
|-------|------|-------------|---------|
| `game_id` | Int | Filtrar por juego | `1` (LoL) |
| `status` | String | Estado (open, running, finished) | `open` |
| `page` | Int | Número de página | `1` |

#### 📤 Response

**✅ Success (200 OK)**

```json
{
  "data": [
    {
      "id": 101,
      "nombre": "Copa TierOne Invierno",
      "juego": "League of Legends",
      "fecha_inicio": "2026-02-15T18:00:00Z",
      "entry_fee": 10.00,
      "prize_pool": 500.00,
      "status": "open",
      "inscritos": 12,
      "max_participantes": 32
    }
    // ... más torneos
  ],
  "links": { ... },
  "meta": { ... }
}
```

---

### 2. Crear Torneo

**Descripción**: Crea un nuevo torneo (requiere rol de organizador).

- **URL**: `/api/v1/tournaments`
- **Método**: `POST`
- **Autenticación**: `Bearer Token` ✅

#### 📩 Request

**Body Parameters**

| Campo | Tipo | Requerido | Descripción |
|-------|------|:---------:|-------------|
| `nombre` | String | ✅ | Nombre del torneo |
| `game_id` | Int | ✅ | ID del juego |
| `fecha_inicio` | DateTime | ✅ | Inicio del evento |
| `entry_fee` | Decimal | ✅ | Costo inscripción |
| `max_participantes` | Int | ✅ | Slots disponibles |
| `formato` | String | ✅ | `single_elimination`, `swiss`, etc |

**Ejemplo Body**
```json
{
  "nombre": "Torneo CS:GO Weekly",
  "game_id": 2,
  "fecha_inicio": "2026-03-01 20:00:00",
  "entry_fee": 5.00,
  "max_participantes": 16,
  "formato": "single_elimination"
}
```

#### 📤 Response

**✅ Success (201 Created)**

```json
{
  "success": true,
  "data": {
    "id": 102,
    "nombre": "Torneo CS:GO Weekly",
    "status": "draft",
    "created_at": "..."
  }
}
```

---

### 3. Inscribirse al Torneo

**Descripción**: Inscribe al usuario autenticado (o su equipo) en el torneo. Descuenta el balance automáticamente.

- **URL**: `/api/v1/tournaments/{id}/join`
- **Método**: `POST`
- **Autenticación**: `Bearer Token` ✅

#### 📩 Request

**Body Parameters**

| Campo | Tipo | Requerido | Descripción |
|-------|------|:---------:|-------------|
| `team_id` | Int | ❌ | ID del equipo (si es torneo por equipos) |

**Ejemplo Body**
```json
{
  "team_id": 55
}
```

#### 📤 Response

**✅ Success (200 OK)**

```json
{
  "success": true,
  "message": "Inscripción exitosa",
  "balance_restante": 145.50
}
```

**❌ Errors**

| Código | Descripción |
|:------:|-------------|
| `402` | Saldo insuficiente |
| `409` | Torneo lleno o ya inscrito |

---

### 4. Ver Bracket (Cuadro)

**Descripción**: Devuelve la estructura del cuadro del torneo (partidas, rondas, ganadores).

- **URL**: `/api/v1/tournaments/{id}/bracket`
- **Método**: `GET`
- **Autenticación**: Pública

#### 📤 Response

**✅ Success (200 OK)**

```json
{
  "tournament_id": 101,
  "rounds": [
    {
      "round_number": 1,
      "matches": [
        {
          "match_id": 501,
          "player1": "Team A",
          "player2": "Team B",
          "winner": null,
          "score": "0-0"
        },
        // ...
      ]
    },
    // ... más rondas
  ]
}
```

---

