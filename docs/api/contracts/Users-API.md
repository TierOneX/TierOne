# 👥 Users API - TierOne

Gestión de usuarios, perfiles y administración.

---

## Base URL
`/api/v1`

---

## 🔐 Autenticación
Endpoints de gestión requieren autenticación y rol de **admin**.

```http
Authorization: Bearer {token}
```

---

## 📌 Endpoints

### 1. Listar Usuarios (Admin)

**GET** `/users`

**Query Params:**
- `search`: búsqueda por username/email
- `rol`: filtrar por rol (player|admin|streamer)
- `per_page`: items por página (default: 15)

**Response 200:**
```json
{
  "data": [
    {
      "id": 1,
      "username": "gamer123",
      "email": "gamer@example.com",
      "nombre": "Juan",
      "apellido": "Pérez",
      "rol": "player",
      "balance": 250.50,
      "verificado": true,
      "activo": true,
      "fecha_registro": "2026-01-15T10:30:00Z"
    }
  ],
  "meta": {
    "current_page": 1,
    "total": 150
  }
}
```

---

### 2. Ver Perfil Propio

**GET** `/user`

**Response 200:**
```json
{
  "id": 123,
  "username": "gamer123",
  "email": "gamer@example.com",
  "nombre": "Juan",
  "apellido": "Pérez",
  "pais": "España",
  "rol": "player",
  "balance": 250.50,
  "verificado": true,
  "activo": true,
  "fecha_registro": "2026-01-15T10:30:00Z",
  "ultima_conexion": "2026-02-16T11:45:00Z"
}
```

---

### 3. Ver Usuario Específico (Admin)

**GET** `/users/{id}`

**Response 200:**
```json
{
  "id": 123,
  "username": "gamer123",
  "email": "gamer@example.com",
  "nombre": "Juan",
  "apellido": "Pérez",
  "pais": "España",
  "rol": "player",
  "balance": 250.50,
  "verificado": true,
  "activo": true,
  "estadisticas": {
    "torneos_participados": 12,
    "partidas_jugadas": 45,
    "compras_totales": 3
  }
}
```

---

### 4. Actualizar Perfil Propio

**PUT** `/user`

**Request:**
```json
{
  "nombre": "Juan Carlos",
  "apellido": "Pérez",
  "pais": "España"
}
```

**Validation:**
- `nombre`: optional, string, max:100
- `apellido`: optional, string, max:100
- `pais`: optional, string, max:100

**Response 200:**
```json
{
  "message": "Perfil actualizado",
  "user": { ... }
}
```

---

### 5. Actualizar Usuario (Admin)

**PUT** `/users/{id}`

**Request:**
```json
{
  "rol": "streamer",
  "activo": false,
  "verificado": true
}
```

**Validation:**
- `rol`: optional, in:player,admin,streamer
- `activo`: optional, boolean
- `verificado`: optional, boolean

**Response 200:**
```json
{
  "message": "Usuario actualizado",
  "user": { ... }
}
```

---

### 6. Eliminar Usuario (Admin)

**DELETE** `/users/{id}`

⚠️ **IMPORTANTE**: Soft delete para preservar histórico de transacciones.

**Response 200:**
```json
{
  "message": "Usuario desactivado"
}
```

---

## 💡 Notas de Implementación

- Los campos sensibles (password_hash) nunca se exponen en el API
- El balance solo puede modificarse mediante transacciones
- Solo admins pueden cambiar roles
- La eliminación es soft delete para mantener integridad referencial

---

## 📚 Navegación

- **[← Volver al Índice de API](../README.md)**
- **[← Volver al Hub de Documentación](../../README.md)**
- **[📖 Ver otros contratos API](../README.md#contratos-por-módulo)**

**Contratos relacionados:**
- [🔐 Auth API](Auth-API.md) - Autenticación y autorización
- [🏆 Tournaments API](Tournaments-API.md) - Gestión de torneos
- [⭐ Reviews API](Reviews-API.md) - Reseñas de usuarios

---

**Estado**: ✅ Implementado  
**Última actualización**: Febrero 2026
