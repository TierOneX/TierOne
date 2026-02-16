# ⭐ Reviews API - TierOne

Sistema de reseñas de productos con moderación.

---

## Base URL
`/api/v1`

---

## 🔐 Autenticación
Todos los endpoints requieren autenticación.

```http
Authorization: Bearer {token}
```

---

## 📌 Endpoints

### 1. Listar Reviews de un Producto

**GET** `/reviews?producto_id={id}`

**Query Params:**
- `producto_id`: required, integer
- `per_page`: items por página (default: 10)

**Response 200:**
```json
{
  "data": [
    {
      "id": 1,
      "id_usuario": 123,
      "calificacion": 5,
      "comentario": "Excelente calidad, muy recomendado",
      "fecha_review": "2026-02-10T14:30:00Z",
      "verificado_compra": true,
      "usuario": {
        "username": "gamer123",
        "verificado": true
      }
    }
  ],
  "meta": {
    "rating_promedio": 4.5,
    "total_reviews": 25
  }
}
```

---

### 2. Crear Review

**POST** `/reviews`

**Request:**
```json
{
  "id_producto": 45,
  "calificacion": 5,
  "comentario": "Producto de excelente calidad"
}
```

**Validation:**
- `id_producto`: required, integer, exists:productos
- `calificacion`: required, integer, between:1,5
- `comentario`: required, string, min:10, max:1000

**Response 201:**
```json
{
  "message": "Review creada. Pendiente de moderación",
  "review": {
    "id": 1,
    "id_producto": 45,
    "id_usuario": 123,
    "calificacion": 5,
    "comentario": "Producto de excelente calidad",
    "aprobado": false,
    "fecha_review": "2026-02-16T12:00:00Z"
  }
}
```

---

### 3. Actualizar Review Propia

**PUT** `/reviews/{id}`

Solo el autor puede editar su review.

**Request:**
```json
{
  "calificacion": 4,
  "comentario": "Buen producto, pero el envío tardó"
}
```

**Response 200:**
```json
{
  "message": "Review actualizada. Pendiente de moderación",
  "review": { ... }
}
```

---

### 4. Eliminar Review Propia

**DELETE** `/reviews/{id}`

**Response 200:**
```json
{
  "message": "Review eliminada"
}
```

---

### 5. Moderar Review (Admin)

**PUT** `/reviews/{id}/moderar`

**Request:**
```json
{
  "aprobado": true,
  "razon_rechazo": null
}
```

**Validation:**
- `aprobado`: required, boolean
- `razon_rechazo`: required_if:aprobado,false, string

**Response 200:**
```json
{
  "message": "Review moderada",
  "review": {
    "id": 1,
    "aprobado": true,
    "id_moderado_por": 5,
    "fecha_moderacion": "2026-02-16T12:30:00Z"
  }
}
```

---

### 6. Reportar Review

**POST** `/reviews/{id}/reportar`

**Request:**
```json
{
  "razon": "Contenido inapropiado"
}
```

**Response 200:**
```json
{
  "message": "Review reportada para revisión"
}
```

---

## 💡 Notas de Implementación

- Las reviews requieren moderación antes de ser públicas
- Solo usuarios con compras verificadas pueden calificar
- El rating promedio se actualiza automáticamente
- Los admins pueden aprobar/rechazar reviews

---

## 📚 Navegación

- **[← Volver al Índice de API](../README.md)**
- **[← Volver al Hub de Documentación](../../README.md)**
- **[📖 Ver otros contratos API](../README.md#contratos-por-módulo)**

**Contratos relacionados:**
- [🛍️ Shop API](Shop-API.md) - Gestión de productos
- [🛒 Cart API](Cart-API.md) - Carrito de compras
- [👥 Users API](Users-API.md) - Perfil de usuario

---

**Estado**: ✅ Implementado  
**Última actualización**: Febrero 2026
