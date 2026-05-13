# 🗄️ Definición Técnica de la Base de Datos (Migraciones)

Este documento detalla el esquema físico de la base de datos de TierOne, basado en las migraciones del sistema.

---

## 📂 Core del Sistema

### `users` (`create_users_table.php`)
| Campo | Tipo | Notas |
| :--- | :--- | :--- |
| `id` | BigInt | Primary Key |
| `nombre` | String | Nombre real |
| `email` | String | Unique |
| `twitch_id` | String | Nullable, para OAuth |
| `rol` | Enum | `user`, `admin` |
| `balance_tokens` | Integer | Balance de Hydra Coins |
| `dni_cif` | String | Para facturación legal |

### `juegos` (`create_juegos_table.php`)
| Campo | Tipo | Notas |
| :--- | :--- | :--- |
| `id` | BigInt | Primary Key |
| `nombre` | String | Ej: League of Legends |
| `igdb_id` | Integer | ID externo para metadatos |
| `imagen_url` | String | URL de la portada |

### `categorias` (`create_categorias_table.php`)
| Campo | Tipo | Notas |
| :--- | :--- | :--- |
| `nombre` | String | Ej: Moda, Hardware |
| `slug` | String | Para URLs amigables |

---

## 📂 E-commerce

### `productos` (`create_productos_table.php`)
| Campo | Tipo | Notas |
| :--- | :--- | :--- |
| `id_categoria` | FK | Relación con `categorias` |
| `nombre` | String | Nombre comercial |
| `precio_venta` | Decimal | PVP con impuestos |
| `stock` | Integer | Cantidad disponible |
| `es_personalizable` | Boolean | Activa el editor 3D/2D |

### `ordenes` (`create_ordenes_table.php`)
| Campo | Tipo | Notas |
| :--- | :--- | :--- |
| `numero_orden` | String | Unique (TIO-..., TRN-...) |
| `total` | Decimal | Total pagado |
| `estado` | Enum | `pendiente`, `pagada`, `enviada`, `cancelada` |
| `stripe_payment_intent_id` | String | Referencia de transacción |

### `items_orden` (`create_items_orden.php`)
| Campo | Tipo | Notas |
| :--- | :--- | :--- |
| `id_orden` | FK | Relación con `ordenes` |
| `id_producto` | FK | Producto comprado |
| `personalizacion_data` | JSON | Configuración del diseño del usuario |

---

## 📂 Gaming y Competición

### `torneos` (`create_torneos_table.php`)
| Campo | Tipo | Notas |
| :--- | :--- | :--- |
| `nombre` | String | Título del torneo |
| `max_participantes` | Integer | Límite de inscripción |
| `cuota_inscripcion` | Decimal | Coste de entrada |
| `premio_total` | Decimal | Bolsa de premios |
| `estado` | Enum | `abierto`, `en_curso`, `finalizado` |

### `inscripciones_torneo` (`create_inscripciones_torneo_table.php`)
| Campo | Tipo | Notas |
| :--- | :--- | :--- |
| `id_usuario` | FK | Jugador inscrito |
| `id_torneo` | FK | Torneo asociado |
| `estado_pago` | Boolean | Confirmación de cuota |

---
*Manual de Base de Datos - TierOne*
