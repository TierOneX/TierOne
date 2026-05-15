# 🎮 Definición Exhaustiva de Controladores y Métodos

Este documento es el catálogo completo de la lógica de control del backend de TierOne.

---

## 📂 Pagos y Finanzas

### `StripeController` (`app/Http/Controllers/StripeController.php`)
| Método | Entrada | Salida | Descripción |
| :--- | :--- | :--- | :--- |
| `crearPaymentIntent` | `items[]`, `direccion_id` | JSON (client_secret) | Valida precios en el servidor y crea la orden pendiente. |
| `webhook` | Stripe Payload | HTTP 200/400 | Procesa eventos asíncronos de éxito/fallo de pago. |
| `confirmarPago` | `payment_intent_id` | JSON (status) | Sincronización manual de seguridad. |
| `crearPaymentIntentTorneo` | `id_torneo` | JSON (client_secret) | Flujo específico para inscripciones competitivas. |

---

## 📂 Tienda y Usuarios

### `Api\ProductController` (`app/Http/Controllers/Api/ProductController.php`)
| Método | Entrada | Salida | Descripción |
| :--- | :--- | :--- | :--- |
| `index` | `category`, `search` | JSON (paginated) | Buscador de catálogo optimizado. |
| `show` | `id` | JSON (Product detail) | Retorna relaciones de variantes e imágenes. |

### `Api\AuthController` (`app/Http/Controllers/Api/AuthController.php`)
| Método | Entrada | Salida | Descripción |
| :--- | :--- | :--- | :--- |
| `login` | `email`, `password` | JSON (token) | Autenticación Sanctum. |
| `logout` | - | JSON (success) | Revocación de tokens actuales. |

---

## 📂 Administración y Gestión

### `TorneoController` (`app/Http/Controllers/TorneoController.php`)
| Método | Entrada | Salida | Descripción |
| :--- | :--- | :--- | :--- |
| `store` | `form_data` | Redirect/JSON | Crea un torneo y define premios/reglas. |
| `getParticipantes` | `torneo_id` | JSON | Lista de usuarios inscritos y su estado de pago. |

### `FinanzaController` (`app/Http/Controllers/FinanzaController.php`)
- **`getMetrics`**: Retorna datos agregados para gráficos de ingresos.
- **`processWithdrawal`**: Lógica para que los usuarios retiren fondos (Hydra Coins a EUR).

---
[🔙 Volver al Hub](../00_HUB.md) | *Referencia de Controladores - TierOne*
