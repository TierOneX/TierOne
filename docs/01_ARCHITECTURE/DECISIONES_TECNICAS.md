# 🚀 Decisiones Técnicas

Este documento detalla las razones detrás de la arquitectura y las tecnologías seleccionadas para el proyecto **TierOne**.

## 1. Stack Tecnológico

### Backend: Laravel 10
- **Razón**: Proporciona una estructura robusta, herramientas de seguridad integradas (CSRF, XSS, Inyección SQL) y una comunidad extensa.
- **ORM Eloquent**: Facilita la interacción con la base de datos mediante un modelo relacional intuitivo, crucial para la gestión de productos, pedidos y usuarios.

### Frontend: React + Vite
- **Razón**: React permite una interfaz de usuario dinámica y reactiva, esencial para un panel de juegos y tienda. Vite se utiliza por su velocidad superior de desarrollo y compilación en comparación con Webpack.
- **TailwindCSS**: Permite un diseño "Utility-first" que facilita la creación de la estética "Gaming Premium" sin escribir CSS verboso.

## 2. Patrones de Diseño

### Service Pattern (Capa de Servicios)
- **Implementación**: Se ha extraído la lógica de negocio de los Controladores a clases dedicadas en `app/Services`.
- **Beneficio**: Facilita el mantenimiento, las pruebas unitarias y la reutilización de código (por ejemplo, el `InvoiceService` puede ser llamado desde un controlador web o un comando programado).

### Repository Pattern (Opcional/Híbrido)
- Se utiliza Eloquent directamente en los servicios para simplificar el acceso a datos, manteniendo la lógica de persistencia aislada de la lógica de negocio compleja.

## 3. Integraciones de Terceros

### Stripe API
- **Uso**: Procesamiento de pagos para la tienda y suscripciones.
- **Decisión**: Stripe es el estándar de la industria por su seguridad, facilidad de integración y soporte para múltiples métodos de pago.

### Twitch OAuth & API
- **Uso**: Autenticación de usuarios y sincronización de datos de streaming.
- **Decisión**: Al ser una plataforma gaming, Twitch es el proveedor de identidad natural para nuestra base de usuarios.

## 4. Gestión de Base de Datos
- **Migraciones**: Todo el esquema de la base de datos está versionado mediante migraciones de Laravel para garantizar la consistencia en todos los entornos de desarrollo.
- **Relaciones Complejas**: Se han implementado relaciones `hasMany`, `belongsTo` y `belongsToMany` para manejar la complejidad de torneos, inscripciones y pedidos.

---
[🔙 Volver al Hub](../00_HUB.md) | *Documentación de Arquitectura - TierOne*
