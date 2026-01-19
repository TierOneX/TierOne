# 📉 Análisis de Base de Datos - V2

**Documento**: V2
**Referencia**: [Diagrama ER v2](ER-Diagram.md)
**Estado**: Revisión de cambios y deuda técnica

Este documento analiza el estado del esquema tras la implementación de las correcciones de la primera iteración. Identifica qué se ha resuelto, qué riesgos persisten (fallas aceptadas) y propone nuevas correcciones necesarias.

---

## ✅ 1. Correcciones Aplicadas (Done)

Se han integrado las siguientes mejoras en el esquema:

| ID | Área | Corrección Implementada |
|----|------|-------------------------|
| #7 | **Finanzas** | Se eliminó `id_referencia` ambiguo en `TRANSACCIONES`. Ahora se usan FKs explícitas (`id_orden`, `id_partida`, etc.). |
| #8 | **Finanzas** | En `RETIROS`, el campo `id_procesado_por` ahora referencia explícitamente a un admin (`USERS`), mejorando la auditoría. |
| #10 | **Tienda** | Eliminado campo calculado `margen` en `PRODUCTOS` para evitar datos redundantes. |
| #11 | **Social** | Añadidos campos de moderación en `REVIEWS` (`aprobado`, `id_moderado_por`, etc.). |
| #12 | **Tienda** | Añadidos detalles de cancelación en `ORDENES` (`razon_cancelacion`, `id_cancelado_por`). |
| #15 | **Soporte** | Creada nueva tabla `REPORTES` para gestionar disputas de partidas de forma centralizada. |

*Nota: La corrección #13 (Comunicaciones) se mantuvo enfocada en emails al proveedor según indicación.*

---

## ⚠️ 2. Fallas que Quedan (Riesgos Pendientes)

Estos son puntos identificados en el análisis V1 que **no se han aplicado** y que representan deuda técnica o riesgos potenciales.

### 🔴 Riesgo Alto: Integridad Referencial de Equipos
- **Falla**: Las tablas `PARTICIPANTES_PARTIDA` e `INSCRIPCIONES_TORNEO` tienen un campo `id_equipo`.
- **Estado**: ❌ **La tabla `EQUIPOS` NO EXISTE**.
- **Impacto**: `id_equipo` es actualmente un entero sin integridad referencial. Si se borra un equipo lógico, no hay cascada. No hay dónde guardar nombre, logo o capitán del equipo.
- **Recomendación**: Si no se va a crear la tabla `EQUIPOS`, eliminar `id_equipo` y gestionar todo solo por usuarios individuales, o aceptar que `id_equipo` es un "dato huérfano" gestionado por código.

### 🟡 Riesgo Medio: Balance de Usuarios
- **Falla**: No hay campo `balance` en la tabla `USERS`.
- **Estado**: Se ha optado por cálculo dinámico o gestión externa.
- **Impacto**: Calcular el saldo sumando todo el historial de transacciones cada vez puede ser lento (`SUM(monto)`) a medida que crece la base de datos.
- **Recomendación**: Considerar una tabla de caché `USER_BALANCES` o usar Redis si el rendimiento decae.

### 🟡 Riesgo Medio: Integridad de Direcciones
- **Falla**: `DIRECCIONES_ENVIO` no tiene campo secundario para piso/puerta (`direccion_linea2`).
- **Impacto**: Usuarios en edificios podrían tener problemas para introducir su dirección completa en un solo campo.

### 🟡 Riesgo Medio: Auditoría de Errores API
- **Falla**: No hay registro de fallos en `INTEGRACIONES_API`.
- **Impacto**: Si la API de Riot/Steam falla silenciosamente, será difícil depurar sin logs de base de datos.

---

## 🚀 3. Correcciones por Añadir (Nuevas Propuestas)

Basado en el estado actual del Diagrama ER v2, se sugieren las siguientes adiciones para robustecer el sistema:

### A. 🟢 Tabla `REPORTES_MENSAJES` (Chat de Disputa)
- **Motivo**: La nueva tabla `REPORTES` permite crear una disputa, pero no hay un canal para que el usuario y el admin conversen sobre ella.
- **Propuesta**:
```sql
REPORTES_MENSAJES {
    int id PK
    int id_reporte FK
    int id_usuario FK
    string mensaje
    datetime fecha_envio
    string adjunto_url "nullable"
}
```

### B. 🟢 Tabla `PRECIOS_HISTORICO` (E-commerce)
- **Motivo**: Al eliminar el margen calculado, dependemos de los precios actuales. Pero si el proveedor cambia el precio mañana, ¿cómo calculamos el margen real de una venta hecha hace un mes? `ITEMS_ORDEN` guarda el precio de venta, pero no el costo del proveedor en ese momento.
- **Propuesta**: Agregar `costo_proveedor_snapshot` en la tabla `ITEMS_ORDEN` para congelar el costo en el momento de la compra.
```sql
ITEMS_ORDEN {
    -- ... campos actuales ...
    decimal costo_proveedor_snapshot "costo en el momento de la compra"
}
```

### C. 🟡 Definición de "Estado de Cuenta"
- **Motivo**: Con el cambio en `TRANSACCIONES`, ahora es la única fuente de la verdad financiera.
- **Propuesta**: Crear una Vista Materializada o un Job nocturno que reconcilie transacciones para detectar discrepancias tempranas.

---

## 📊 Resumen para Acción

1. **URGENTE**: Definir qué hacer con el campo `id_equipo` (Crear tabla o eliminar campo).
2. **IMPORTANTE**: Agregar `costo_proveedor_snapshot` a `ITEMS_ORDEN` para no perder métricas de margen histórico.
3. **RECOMENDADO**: Agregar chat a los reportes.
