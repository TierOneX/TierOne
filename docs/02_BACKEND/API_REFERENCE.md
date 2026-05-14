# 📡 Referencia de API (Stripe & Pagos)

Esta sección documenta los endpoints críticos para la integración del frontend con el sistema de pagos y gestión de órdenes.

---

## 🔐 Autenticación
Todos los endpoints requieren el header `Authorization: Bearer <token>` y `Accept: application/json`.

---

## 💳 Gestión de Pagos

### `POST /api/stripe/create-intent`
Crea una intención de pago para productos físicos de la tienda.

**Request Payload:**
```json
{
  "items": [
    {
      "id": 15,
      "cantidad": 2,
      "id_variante": 5,
      "personalizacion_data": {
        "zonas": ["pecho", "espalda"],
        "render_principal": "data:image/png;base64,..."
      }
    }
  ],
  "id_direccion_envio": 1
}
```

**Response (201 Created):**
```json
{
  "status": "success",
  "data": {
    "client_secret": "pi_3N...",
    "order_id": 124,
    "numero_orden": "TIO-ABC123",
    "total": 55.50
  }
}
```

---

### `POST /api/stripe/create-intent-torneo`
Inicia el pago para la inscripción a un torneo competitivo.

**Request Payload:**
```json
{
  "id_torneo": 8
}
```

---

### `POST /api/stripe/confirm-payment`
Verifica manualmente el estado de un pago (usado como fallback al webhook).

**Request Payload:**
```json
{
  "payment_intent_id": "pi_3N..."
}
```

---

## 📦 Gestión de Órdenes

### `GET /api/orders/{id}`
Obtiene el detalle completo de una orden, sus items y el estado del envío.

**Estructura de Respuesta:**
- `id`: Integer
- `numero_orden`: String (TIO-..., TRN-..., HYD-...)
- `estado`: Enum (pendiente, pagada, enviada, entregada, cancelada)
- `items`: Array de objetos con `producto`, `variante` y `subtotal`.
- `direccion_envio`: Objeto con los datos de entrega.

---

## ⚡ Webhooks (Solo para Stripe)

### `POST /api/stripe/webhook`
Endpoint público (excluido de CSRF) que recibe eventos de Stripe.

**Eventos Manejados:**
- `payment_intent.succeeded`: Activa la lógica de éxito (limpieza de carrito, incremento de ventas).
- `payment_intent.payment_failed`: Registra el motivo del fallo y cancela la orden.
- `checkout.session.completed`: Maneja inscripciones que usan el flujo de Checkout externo.

---
[🔙 Volver al Hub](../00_HUB.md) | *Documentación de Integración - TierOne*
