# 💎 Definición Exhaustiva de Modelos (Eloquent)

Este documento detalla la lógica interna, propiedades y comportamientos de los modelos de TierOne.

---

## 🛡️ Modelos de Identidad

### `User.php`
- **Traits**: `HasApiTokens`, `HasFactory`, `Notifiable`.
- **Propiedades Críticas**:
  - `balance_tokens`: Entero que rastrea Hydra Coins. Se actualiza mediante `increment()` / `decrement()`.
  - `rol`: Controla el acceso vía Gates/Policies.
- **Relaciones**:
  - `direcciones()`: HasMany `DireccionEnvio`.
  - `ordenes()`: HasMany `Orden`.

---

## 🛒 Modelos de Negocio

### `Producto.php`
- **Casts**: `es_personalizable` -> boolean.
- **Lógica**:
  - `getPrecioConIvaAttribute()`: Accesor que calcula el precio dinámicamente si no está en la base de datos.
- **Relaciones**:
  - `categoria()`: BelongsTo `Categoria`.
  - `imagenes()`: HasMany `ImagenProducto`.
  - `variantes()`: HasMany `VarianteProducto`.

### `Orden.php`
- **Casts**: `total` -> decimal:2, `fecha_orden` -> datetime.
- **Lógica**:
  - Generación automática de `numero_orden` en el evento `creating` si no se provee.
- **Relaciones**:
  - `items()`: HasMany `ItemOrden`.
  - `pagos()`: HasMany `Pago`.

---

## 🏆 Modelos de Competición

### `Torneo.php`
- **Propiedades**: `max_participantes`, `cuota_inscripcion`, `premio_total`.
- **Casts**: `fecha_inicio` y `fecha_fin` a objetos `Carbon`.
- **Relaciones**:
  - `juego()`: BelongsTo `Juego`.
  - `inscripciones()`: HasMany `InscripcionTorneo`.
  - `partidas()`: HasMany `PartidaTorneo`.

### `Partida.php`
- **Lógica**: Gestiona el estado de un encuentro (Pendiente, En Juego, Finalizada).
- **Relaciones**:
  - `participantes()`: BelongsToMany `User` a través de `ParticipantePartida`.

---
[🔙 Volver al Hub](../00_HUB.md) | *Referencia de Modelos - TierOne*
