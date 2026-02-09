# 🛍️ Shop API Contract

**Base URL**: `/api/v1/shop`  
**Versión**: 1.0  
**Estado**: 🚧 Borrador

---

## 📋 Índice de Endpoints

### Productos
| Método | Endpoint | Descripción | Auth |
|:------:|----------|-------------|:----:|
| `GET` | `/products` | Listar productos (filtros) | 🔓 |
| `GET` | `/products/{slug}` | Detalle producto | 🔓 |
| `GET` | `/categories` | Árbol de categorías | 🔓 |

### Carrito y Pedidos
| Método | Endpoint | Descripción | Auth |
|:------:|----------|-------------|:----:|
| `POST` | `/cart/add` | Añadir al carrito | 🔓 |
| `GET` | `/cart` | Ver carrito | 🔓 |
| `POST` | `/orders` | Crear pedido (Checkout) | 🔒 |
| `GET` | `/orders` | Historial de pedidos | 🔒 |
| `GET` | `/orders/{id}` | Tracking de pedido | 🔒 |

---

## 📝 Definición de Endpoints

### 1. Listar Productos

**Descripción**: Catálogo de productos con filtros avanzados.

- **URL**: `/api/v1/shop/products`
- **Método**: `GET`
- **Autenticación**: Pública

#### 📩 Request

**Query Parameters**

| Param | Tipo | Descripción | Ejemplo |
|-------|------|-------------|---------|
| `category` | Slug | Filtrar por categoría | `camisetas` |
| `min_price` | Decimal | Precio mínimo | `10.00` |
| `sort` | String | `price_asc`, `newest` | `newest` |

#### 📤 Response

**✅ Success (200 OK)**

```json
{
  "data": [
    {
      "id": 501,
      "nombre": "Camiseta TierOne Pro",
      "slug": "camiseta-tierone-pro",
      "precio": 29.99,
      "imagen_principal": "https://...",
      "rating": 4.8
    }
  ],
  "meta": { "total": 45, "page": 1 }
}
```

---

### 2. Crear Pedido (Checkout)

**Descripción**: Procesa la compra de los items en el carrito.

- **URL**: `/api/v1/shop/orders`
- **Método**: `POST`
- **Autenticación**: `Bearer Token` ✅

#### 📩 Request

**Body Parameters**

| Campo | Tipo | Requerido | Descripción |
|-------|------|:---------:|-------------|
| `address_id` | Int | ✅ | ID dirección envío |
| `payment_method`| String | ✅ | `stripe`, `balance`, `paypal` |
| `items` | Array | ❌ | Items (si no usa carrito sesión) |

**Ejemplo Body**
```json
{
  "address_id": 12,
  "payment_method": "stripe",
  "coupon_code": "TIERONE20"
}
```

#### 📤 Response

**✅ Success (201 Created)**

```json
{
  "success": true,
  "order_id": "ORD-2026-8888",
  "total": 55.50,
  "status": "paid",
  "tracking_url": null
}
```

---

### 3. Ver Historial Pedidos

**Descripción**: Lista los pedidos pasados del usuario.

- **URL**: `/api/v1/shop/orders`
- **Método**: `GET`
- **Autenticación**: `Bearer Token` ✅

#### 📤 Response

**✅ Success (200 OK)**

```json
{
  "data": [
    {
      "id": "ORD-2026-8888",
      "fecha": "2026-01-15",
      "total": 55.50,
      "estado": "enviado",
      "items_count": 2
    }
  ]
}
```

---
