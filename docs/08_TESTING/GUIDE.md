# Guía de Testing - TierOne

Este documento detalla la suite de pruebas unitarias y de característica implementada para asegurar la integridad de la lógica de negocio y las APIs del proyecto.

## 🚀 Cómo ejecutar los tests

Ejecuta todos los tests desde la carpeta `TierOne/`:
```bash
php artisan test
```

Para filtrar por un grupo específico:
```bash
# Solo servicios (Lógica de negocio)
php artisan test --filter=Services

# Solo API (Endpoints)
php artisan test --filter=Api
```

---

## 🏗️ Infraestructura (Factories)
Se han sincronizado los Factories para que coincidan con el esquema real de la base de datos (Español):
- `UserFactory`: Usa `nombre`, `password_hash`, `rol`, etc.
- `ProductoFactory`: Genera productos con relaciones a categorías y proveedores.
- `OrdenFactory` / `ItemOrdenFactory`: Genera pedidos completos para pruebas de e-commerce.
- `ZonaPersonalizacionFactory` / `PrecioPersonalizacionFactory`: Soporte para el editor visual.

---

## 🧪 Tests Unitarios (`tests/Unit/Services`)
Estos tests validan la lógica pura de los servicios sin pasar por las rutas HTTP.

| Clase | Cobertura |
| :--- | :--- |
| `ProductServiceTest` | Creación de productos, generación automática de slugs y filtrado avanzado. |
| `OrderServiceTest` | Integridad transaccional al crear pedidos (Cabecera + Items + Direcciones). |
| `CategoryServiceTest` | Gestión de jerarquías (Padres/Hijos) y slugs de categorías. |
| `CustomizationServiceTest` | Cálculo de recargos por capas de texto e imagen (Globales y por Producto). |
| `InvoiceServiceTest` | Verificación del flujo de generación de facturas PDF (Mocked). |

---

## 🌐 Tests de Característica (`tests/Feature/Api`)
Estos tests validan los endpoints de la API, la seguridad y los permisos de roles.

| Clase | Cobertura |
| :--- | :--- |
| `ProductApiTest` | Listado público, ver detalle y restricción de creación (solo Admin/Staff). |
| `OrderApiTest` | Seguridad: Los usuarios solo ven sus pedidos. Validación de flujo de compra. |
| `TournamentApiTest` | Listado, detalle y creación de torneos con validación de fechas y formatos. |

---

## 🛠️ Mejoras de Código detectadas por los Tests
Durante la implementación se aplicaron los siguientes parches de seguridad y estabilidad:
1. **Seguridad API**: El listado de órdenes ahora filtra por el usuario autenticado.
2. **Robustez DB**: `OrderService` ahora asigna un `descuento` de 0 por defecto si no se recibe, evitando errores SQL.
3. **Flexibilidad de Validación**: Los campos autogenerados (`slug`, `numero_orden`) ahora son opcionales en las peticiones para evitar bloqueos del frontend.

---
> [!TIP]
> Todos los tests utilizan una base de datos **SQLite en memoria** por lo que son extremadamente rápidos y no ensucian tu base de datos de desarrollo (XAMPP).
