# 📡 [Nombre del Módulo] API Contract

**Base URL**: `/api/v1/[recurso]`  
**Versión**: 1.0  
**Estado**: 🚧 Borrador / ✅ Aprobado

---

## 📋 Índice de Endpoints

| Método | Endpoint | Descripción | Auth |
|:------:|----------|-------------|:----:|
| `GET` | `/` | Listar recursos | 🔒 |
| `POST` | `/` | Crear recurso | 🔒 |
| `GET` | `/{id}` | Obtener detalle | 🔓 |

---

## 📝 Definición de Endpoints

### 1. [Nombre del Endpoint]

**Descripción**: Breve descripción de lo que hace este endpoint.

- **URL**: `/api/v1/[recurso]/[path]`
- **Método**: `GET` / `POST` / `PUT` / `DELETE`
- **Autenticación**: `Bearer Token` (Requerido / Opcional)

#### 📩 Request

**Headers**
```http
Content-Type: application/json
Authorization: Bearer <token>
```

**Body Parameters**

| Campo | Tipo | Requerido | Descripción | Reglas |
|-------|------|:---------:|-------------|--------|
| `nombre` | String | ✅ | Nombre del usuario | Min 3 chars |
| `edad` | Integer | ❌ | Edad del usuario | Min 18 |

**Ejemplo Body**
```json
{
  "nombre": "Ejemplo",
  "edad": 25
}
```

#### 📤 Response

**✅ Success (200 OK)**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "nombre": "Ejemplo",
    ...
  },
  "message": "Operación exitosa"
}
```

**❌ Errors**

| Código | Descripción |
|:------:|-------------|
| `400` | Datos de entrada inválidos |
| `401` | No autorizado |
| `404` | Recurso no encontrado |

**Ejemplo Error (422 Unprocessable Entity)**
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "email": [
      "The email has already been taken."
    ]
  }
}
```

---
