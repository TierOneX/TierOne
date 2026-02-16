# 🔍 Análisis y Correcciones - Base de Datos TierOne

## ✅ Aspectos Positivos del Diseño

1. **Estructura bien organizada** en módulos lógicos
2. **Nomenclatura consistente** en español
3. **Campos de auditoría** (fechas de creación, actualización)
4. **Relaciones bien definidas** entre entidades
5. **Soporte para funcionalidades complejas** (torneos, dropshipping, API sync)

---

## ⚠️ Correcciones Críticas Necesarias

### 1. 🔴 **USERS - Falta Balance/Wallet**

**Problema**: No hay campo para gestionar el balance del usuario.

**Solución**: Agregar campos financieros a `USERS`:

```sql
USERS {
    -- ... campos existentes ...
    decimal balance_disponible "default: 0.00"
    decimal balance_bloqueado "en partidas activas"
    decimal balance_total "disponible + bloqueado"
    datetime ultima_transaccion
}
```

**Justificación**: Necesario para:
- Gestionar buy-ins de partidas
- Premios de torneos
- Compras en la tienda
- Retiros

---

### 2. 🟡 **PARTIDAS - Falta Relación con Creador**

**Problema**: `id_creador` no tiene relación explícita con `USERS`.

**Solución**: Agregar relación:

```mermaid
USERS ||--o{ PARTIDAS : "crea"
```

**Corrección en tabla**:
```sql
PARTIDAS {
    -- ... campos existentes ...
    int id_creador FK "referencia a USERS"
}
```

---

### 3. 🟡 **TORNEOS - Falta Relación con Organizador**

**Problema**: Similar al anterior, `id_organizador` sin relación explícita.

**Solución**: Ya existe la relación `USERS ||--o{ TORNEOS : "organiza"` ✅

---

### 4. 🔴 **EQUIPOS - Tabla Faltante**

**Problema**: Se menciona `id_equipo` en:
- `PARTICIPANTES_PARTIDA.id_equipo`
- `INSCRIPCIONES_TORNEO.id_equipo`

Pero **no existe la tabla `EQUIPOS`**.

**Solución**: Crear tabla `EQUIPOS`:

```sql
EQUIPOS {
    int id PK
    string nombre "unique"
    string tag "unique - ej: [TRN]"
    string logo_url
    int id_capitan FK "referencia a USERS"
    datetime fecha_creacion
    boolean activo
}

EQUIPOS_MIEMBROS {
    int id PK
    int id_equipo FK
    int id_usuario FK
    enum rol "capitan,jugador,suplente"
    datetime fecha_union
    boolean activo
}
```

**Relaciones necesarias**:
```mermaid
EQUIPOS ||--o{ EQUIPOS_MIEMBROS : "tiene"
USERS ||--o{ EQUIPOS_MIEMBROS : "pertenece"
EQUIPOS ||--o{ PARTICIPANTES_PARTIDA : "participa"
EQUIPOS ||--o{ INSCRIPCIONES_TORNEO : "se inscribe"
```

---

### 5. 🟡 **RESULTADOS_PARTIDA - Falta Relación con Verificador**

**Problema**: `id_verificado_por` no tiene relación explícita.

**Solución**: Agregar relación:

```mermaid
USERS ||--o{ RESULTADOS_PARTIDA : "verifica"
```

---

### 6. 🟡 **PREMIOS_TORNEO - Falta Relación con Ganador**

**Problema**: `id_ganador` sin relación explícita.

**Solución**: Agregar relación:

```mermaid
USERS ||--o{ PREMIOS_TORNEO : "gana"
```

---

### 7. 🔴 **TRANSACCIONES - Campo `id_referencia` Ambiguo**

**Problema**: `id_referencia` puede apuntar a diferentes tablas (orden, partida, torneo) pero no hay forma de saber cuál.

**Solución**: Agregar campo de tipo:

```sql
TRANSACCIONES {
    -- ... campos existentes ...
    int id_referencia "ID genérico"
    enum tipo_referencia "orden,partida,torneo,retiro,deposito,manual"
    -- ... resto de campos ...
}
```

**Alternativa mejor**: Usar campos específicos:

```sql
TRANSACCIONES {
    int id PK
    int id_usuario FK
    int id_orden FK "nullable"
    int id_partida FK "nullable"
    int id_torneo FK "nullable"
    int id_retiro FK "nullable"
    enum tipo "deposito,retiro,premio,compra,reembolso,comision"
    decimal monto
    decimal balance_anterior
    decimal balance_nuevo
    string descripcion
    datetime fecha_transaccion
}
```

---

### 8. 🟡 **RETIROS - Falta Relación con Procesador**

**Problema**: `id_procesado_por` sin relación explícita.

**Solución**: Agregar relación:

```mermaid
USERS ||--o{ RETIROS : "procesa"
```

---

### 9. 🟡 **DIRECCIONES_ENVIO - Falta Campo `direccion_linea2`**

**Problema**: Muchas direcciones necesitan línea 2 (apartamento, piso, etc.).

**Solución**:

```sql
DIRECCIONES_ENVIO {
    -- ... campos existentes ...
    string direccion_linea1
    string direccion_linea2 "nullable - apartamento, piso, etc"
    -- ... resto de campos ...
}
```

---

### 10. 🔴 **PRODUCTOS - Campo `margen` Calculado**

**Problema**: `margen` es un campo calculado, no debería almacenarse (viola normalización).

**Solución**: Eliminar campo `margen` y calcularlo en queries:

```sql
SELECT 
    id,
    nombre,
    precio_venta,
    precio_proveedor,
    (precio_venta - precio_proveedor) AS margen,
    ((precio_venta - precio_proveedor) / precio_proveedor * 100) AS margen_porcentaje
FROM PRODUCTOS;
```

**Excepción**: Si necesitas hacer queries frecuentes por margen, considera un índice calculado o vista materializada.

---

### 11. 🟡 **REVIEWS - Falta Moderación**

**Problema**: No hay forma de moderar reviews inapropiadas.

**Solución**: Agregar campos de moderación:

```sql
REVIEWS {
    -- ... campos existentes ...
    boolean aprobado "default: true"
    boolean reportado "default: false"
    int id_moderado_por FK "nullable - referencia a USERS"
    datetime fecha_moderacion "nullable"
    string razon_rechazo "nullable"
}
```

---

### 12. 🟡 **ORDENES - Falta Información de Cancelación**

**Problema**: Si una orden se cancela, no hay información de quién/cuándo/por qué.

**Solución**:

```sql
ORDENES {
    -- ... campos existentes ...
    int id_cancelado_por FK "nullable - referencia a USERS"
    datetime fecha_cancelacion "nullable"
    string razon_cancelacion "nullable"
}
```

---

### 13. 🔴 **COMUNICACIONES_PROVEEDOR - Mejor como Tabla de Auditoría**

**Problema**: Esta tabla mezcla emails con tracking. Mejor separar.

**Solución**: Renombrar y simplificar:

```sql
HISTORIAL_ORDENES {
    int id PK
    int id_orden FK
    enum tipo "pedido_enviado,tracking_actualizado,entrega_confirmada,incidencia"
    string descripcion
    string datos_json "información adicional"
    int id_usuario FK "nullable - quien registró el evento"
    datetime fecha_evento
}
```

---

### 14. 🟡 **INTEGRACIONES_API - Falta Manejo de Errores**

**Problema**: No hay registro de errores de sincronización.

**Solución**: Agregar campos:

```sql
INTEGRACIONES_API {
    -- ... campos existentes ...
    int intentos_fallidos "contador de errores consecutivos"
    datetime ultima_falla
    string ultimo_error "mensaje de error"
    boolean pausado_por_errores "auto-pausar tras X fallos"
}
```

---

### 15. 🟡 **PARTIDAS - Falta Gestión de Disputas**

**Problema**: `RESULTADOS_PARTIDA.disputado` existe, pero no hay tabla para gestionar disputas.

**Solución**: Crear tabla `DISPUTAS`:

```sql
DISPUTAS {
    int id PK
    int id_partida FK
    int id_usuario_reporta FK
    string descripcion
    string evidencia_url "screenshots, videos"
    enum estado "pendiente,en_revision,resuelta,rechazada"
    int id_resuelto_por FK "nullable - admin"
    string resolucion
    datetime fecha_reporte
    datetime fecha_resolucion
}
```

---

## 🎯 Mejoras Recomendadas (No Críticas)

### 16. 💡 **Soft Deletes**

Agregar `deleted_at` a tablas importantes para no perder datos:

```sql
-- Agregar a: USERS, PRODUCTOS, TORNEOS, PARTIDAS
datetime deleted_at "nullable - soft delete"
```

---

### 17. 💡 **Timestamps Automáticos**

Estandarizar campos de auditoría en todas las tablas:

```sql
datetime created_at "default: CURRENT_TIMESTAMP"
datetime updated_at "default: CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
```

---

### 18. 💡 **Índices Recomendados**

```sql
-- USERS
INDEX idx_users_email (email)
INDEX idx_users_username (username)

-- PARTIDAS
INDEX idx_partidas_estado (estado)
INDEX idx_partidas_fecha_inicio (fecha_inicio)
INDEX idx_partidas_juego (id_juego)

-- PRODUCTOS
INDEX idx_productos_categoria (id_categoria)
INDEX idx_productos_activo (activo)
INDEX idx_productos_slug (slug)

-- ORDENES
INDEX idx_ordenes_usuario (id_usuario)
INDEX idx_ordenes_estado (estado)
INDEX idx_ordenes_fecha (fecha_orden)

-- TRANSACCIONES
INDEX idx_transacciones_usuario (id_usuario)
INDEX idx_transacciones_tipo (tipo)
INDEX idx_transacciones_fecha (fecha_transaccion)
```

---

### 19. 💡 **Tabla de Notificaciones**

Para notificar a usuarios sobre eventos importantes:

```sql
NOTIFICACIONES {
    int id PK
    int id_usuario FK
    enum tipo "partida,torneo,orden,transaccion,sistema"
    string titulo
    string mensaje
    string url "nullable - link al evento"
    boolean leido "default: false"
    datetime fecha_creacion
    datetime fecha_leido "nullable"
}
```

---

### 20. 💡 **Tabla de Configuración**

Para settings globales de la plataforma:

```sql
CONFIGURACION {
    int id PK
    string clave "unique - ej: comision_plataforma"
    string valor
    enum tipo "numero,texto,boolean,json"
    string descripcion
    datetime fecha_modificacion
    int id_modificado_por FK
}
```

---

## 📊 Resumen de Correcciones

| Prioridad | Cantidad | Descripción |
|-----------|----------|-------------|
| 🔴 Crítica | 5 | Requieren atención inmediata |
| 🟡 Alta | 10 | Importantes para funcionalidad completa |
| 💡 Mejora | 5 | Opcionales pero recomendadas |
| **TOTAL** | **20** | **Correcciones identificadas** |

---

## 🚀 Plan de Acción Recomendado

### Fase 1: Correcciones Críticas (Prioridad 🔴)
1. Agregar balance a `USERS`
2. Crear tabla `EQUIPOS` y `EQUIPOS_MIEMBROS`
3. Corregir `TRANSACCIONES` (campos específicos en lugar de `id_referencia`)
4. Eliminar campo calculado `margen` de `PRODUCTOS`
5. Refactorizar `COMUNICACIONES_PROVEEDOR` → `HISTORIAL_ORDENES`

### Fase 2: Correcciones Importantes (Prioridad 🟡)
6-15. Implementar todas las correcciones marcadas como 🟡

### Fase 3: Mejoras Opcionales (Prioridad 💡)
16-20. Implementar según necesidades del proyecto

---

**Última actualización**: 2026-01-19  
**Versión**: 1.0  
**Estado**: Pendiente de revisión
