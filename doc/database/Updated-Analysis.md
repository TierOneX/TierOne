# 📉 Análisis de Datos y Estado del Esquema (v2)

**Fecha**: 2026-01-19  
**Estado**: ✅ Actualizado  
**Referencia**: [Diagrama ER Actualizado](ER-Diagram.md)

Este documento detalla el estado actual del esquema de base de datos tras aplicar las correcciones solicitadas sobre la versión v1.

---

## ✅ Correcciones Aplicadas

Se han implementado las siguientes mejoras estructurales en el [Diagrama ER](ER-Diagram.md):

### 1. Gestión de Transacciones (Integridad Referencial)
- **Cambio**: Se eliminó el campo ambiguo `id_referencia`.
- **Implementación**: Se añadieron claves foráneas explícitas y nullables:
    - `id_orden` (Referencia a E-commerce)
    - `id_partida` (Referencia a Partidas)
    - `id_torneo` (Referencia a Torneos)
    - `id_retiro` (Referencia a Retiros)
- **Beneficio**: Permite restricciones de clave foránea (FK) reales y garantiza la integridad de los datos financieros.

### 2. Flujo de Retiros (Auditoría)
- **Cambio**: Se aclaró la relación `id_procesado_por`.
- **Implementación**: Relación explícita con `USERS` (rol admin) para trazar quién aprueba cada retiro.
- **Beneficio**: Auditoría y responsabilidad en movimientos de dinero saliente.

### 3. Catálogo de Productos (Normalización)
- **Cambio**: Eliminación del campo `margen`.
- **Implementación**: El margen se calculará dinámicamente (`precio_venta - precio_proveedor`) en la capa de aplicación o vistas de base de datos.
- **Beneficio**: Evita redundancia y riesgo de inconsistencia si los precios cambian.

### 4. Sistema de Reseñas (Moderación)
- **Cambio**: Adición de campos de control.
- **Implementación**:
    - `aprobado` (boolean)
    - `reportado` (boolean)
    - `id_moderado_por` (FK Admin)
    - `razon_rechazo` (text)
- **Beneficio**: Previene spam y contenido inapropiado antes de su publicación.

### 5. Gestión de Órdenes (Cancelaciones)
- **Cambio**: Registro detallado de cancelaciones.
- **Implementación**:
    - `id_cancelado_por` (FK Usuario/Admin)
    - `fecha_cancelacion`
    - `razon_cancelacion`
- **Beneficio**: Claridad en el servicio al cliente y métricas de cancelaciones.

### 6. Sistema de Reportes (Disputas)
- **Cambio**: Creación de tabla dedicada.
- **Nueva Tabla**: `REPORTES`
    - Vincula `PARTIDAS` y `USERS`.
    - Permite adjuntar `evidencia_url`.
    - Gestiona estados de resolución (`pendiente`, `resuelta`).
- **Beneficio**: Flujo centralizado para resolver conflictos en partidas competitivas.

### 7. Comunicaciones Proveedor
- **Estado**: Se mantiene la tabla `COMUNICACIONES_PROVEEDOR` enfocada exclusivamente en el intercambio de emails con proveedores de dropshipping, manteniendo el historial de `email_to` / `email_from`.

---

## 📋 Estado de Otras Propuestas (v1)

Las siguientes propuestas del análisis anterior no se han aplicado en esta iteración, manteniéndose el diseño original para estos puntos (conforme a la evaluación del equipo):

- **Balance en Users**: Se mantiene la gestión de balance a través del cálculo de transacciones o servicios externos (Stripe), sin campo persistente en la tabla `USERS` por el momento.
- **Tabla Equipos**: La gestión de equipos se mantiene simplificada o implícita en la lógica de negocio actual, sin tabla dedicada `EQUIPOS`.
- **Direcciones**: Se mantiene estructura simple sin línea 2 obligatoria.
- **Log de Integraciones**: No se añade tabla de historial de errores API.

---

## 🚀 Próximos Pasos Recomendados

1. **Actualizar Migraciones**: Reflejar estos cambios (especialmente la nueva tabla `REPORTES` y los campos de `TRANSACCIONES`) en los archivos de migración de Laravel.
2. **Lógica de Modelos**: 
    - Crear modelo `Reporte`.
    - Actualizar modelo `Transaccion` para manejar las nuevas relaciones polimórficas (o múltiples FKs).
    - Implementar `Accessors` en modelo `Producto` para el cálculo del margen.
