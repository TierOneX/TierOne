# 🔄 Flujos de Negocio y Secuencia

Este documento visualiza los procesos más complejos del sistema mediante diagramas de secuencia.

---

## 💳 Flujo de Compra de Productos (Stripe)

Este flujo garantiza que un pedido solo se marque como pagado si Stripe confirma la transacción exitosa.

```mermaid
sequenceDiagram
    participant U as Usuario (React)
    participant C as StripeController
    participant S as Stripe API
    participant DB as Base de Datos
    participant W as Webhook Handler

    U->>C: POST /api/stripe/create-intent (items, direccion)
    Note over C: Calcula totales en backend
    C->>DB: Crear Orden (estado: 'pendiente')
    C->>S: Crear PaymentIntent (metadata: {order_id})
    S-->>C: client_secret
    C-->>U: client_secret + order_id
    
    U->>S: Confirmar Pago (Stripe Elements)
    S-->>U: Pago Exitoso
    
    Note over S: Evento asíncrono
    S->>W: POST /api/stripe/webhook (payment_intent.succeeded)
    W->>DB: Marcar Orden como 'pagada'
    W->>DB: Incrementar ventas_totales de productos
    W->>DB: Limpiar Carrito del Usuario
```

---

## 🏆 Flujo de Inscripción a Torneo

A diferencia de la tienda, la inscripción crea la relación de participación inmediatamente tras el pago.

```mermaid
sequenceDiagram
    participant U as Usuario (React)
    participant C as StripeController
    participant DB as Base de Datos
    
    U->>C: POST /api/stripe/create-intent-torneo (id_torneo)
    C->>DB: Crear Orden 'TRN-...' (pendiente)
    C->>C: Inyectar metadata: {type: 'tournament_registration'}
    C-->>U: client_secret
    
    U->>C: Confirmar Pago en Frontend
    C->>DB: Actualizar InscripcionTorneo (estado: 'confirmada')
    C->>DB: Generar registro de Pago y Factura
```

---

## 💎 Flujo de Compra Hydra Coins

El balance de tokens del usuario es un recurso crítico que se actualiza atómicamente.

```mermaid
sequenceDiagram
    participant U as Usuario
    participant C as StripeController
    participant DB as Base de Datos

    U->>C: Comprar Pack (X coins)
    C->>DB: Crear Orden 'HYD-...'
    Note over C: Proceso de pago Stripe...
    C->>DB: Orden marcada como 'pagada'
    DB->>DB: User->increment('balance_tokens', X)
    Note right of DB: Transacción Atómica
```

---

## 🎨 Flujo de Personalización de Productos

```mermaid
graph TD
    A[Usuario elige Producto] --> B[Entra al Customizer]
    B --> C[Sube imagen / Elige Zonas]
    C --> D[Canvas React genera Render]
    D --> E[POST /api/stripe/create-intent]
    E --> F[CustomizationService guarda Imagen Renderizada]
    F --> G[ItemOrden vincula URL de Imagen Personalizada]
    G --> H[Factura PDF incluye miniatura del diseño]
```

---
[🔙 Volver al Hub](../00_HUB.md) | *Arquitectura de Procesos - TierOne*
