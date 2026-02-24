# 🛒 Carrito API - TierOne

Gestión del carrito de compras y sus items.

---

## Base URL
`/api/v1`

---

## 🔐 Autenticación
Todos los endpoints requieren autenticación mediante **Laravel Sanctum**.

```http
Authorization: Bearer {token}
```

---

## 📌 Endpoints

### 1. Obtener Carrito Actual

**GET** `/carritos`

Obtiene el carrito activo del usuario autenticado.

**Headers:**
```http
Authorization: Bearer {token}
```

**Response 200:**
```json
{
  "id": 1,
  "id_usuario": 123,
  "subtotal": 149.98,
  "impuestos": 14.00,
  "total": 163.98,
  "items": [
    {
      "id": 1,
      "id_producto": 45,
      "id_variante": 12,
      "cantidad": 2,
      "precio_unitario": 74.99,
      "subtotal": 149.98,
      "producto": {
        "nombre": "Camiseta Gaming",
        "imagen_principal": "/images/shirt.jpg"
      },
      "variante": {
        "nombre": "Talla M - Negro",
        "sku": "SHIRT-M-BLK"
      }
    }
  ]
}
```

---

### 2. Agregar Item al Carrito

**POST** `/carritos/items`

**Request:**
```json
{
  "id_producto": 45,
  "id_variante": 12,
  "cantidad": 2
}
```

**Validation:**
- `id_producto`: required, integer, exists:productos
- `id_variante`: optional, integer, exists:variantes_producto
- `cantidad`: required, integer, min:1

**Response 201:**
```json
{
  "message": "Item agregado al carrito",
  "item": {
    "id": 1,
    "id_carrito": 1,
    "id_producto": 45,
    "id_variante": 12,
    "cantidad": 2,
    "precio_unitario": 74.99,
    "subtotal": 149.98
  },
  "carrito": {
    "id": 1,
    "subtotal": 149.98,
    "total": 163.98
  }
}
```

---

### 3. Actualizar Cantidad de Item

**PUT** `/carritos/items/{id}`

**Request:**
```json
{
  "cantidad": 3
}
```

**Validation:**
- `cantidad`: required, integer, min:1

**Response 200:**
```json
{
  "message": "Cantidad actualizada",
  "item": {
    "id": 1,
    "cantidad": 3,
    "subtotal": 224.97
  }
}
```

---

### 4. Eliminar Item del Carrito

**DELETE** `/carritos/items/{id}`

**Response 200:**
```json
{
  "message": "Item eliminado del carrito"
}
```

---

### 5. Vaciar Carrito

**DELETE** `/carritos`

**Response 200:**
```json
{
  "message": "Carrito vaciado"
}
```

---

## 💡 Notas de Implementación

- El carrito se crea automáticamente al agregar el primer item
- Los precios se actualizan dinámicamente desde la tabla productos
- El subtotal e impuestos se recalculan en cada modificación
- Un usuario solo puede tener 1 carrito activo a la vez

---

## 📚 Navegación

- **[← Volver al Índice de API](../README.md)**
- **[← Volver al Hub de Documentación](../../README.md)**
- **[📖 Ver otros contratos API](../README.md#contratos-por-módulo)**

**Contratos relacionados:**
- [🛍️ Shop API](Shop-API.md) - Gestión de productos y órdenes
- [⭐ Reviews API](Reviews-API.md) - Reseñas de productos
- [👥 Users API](Users-API.md) - Perfil de usuario

---

**Estado**: ✅ Implementado  
**Última actualización**: Febrero 2026
