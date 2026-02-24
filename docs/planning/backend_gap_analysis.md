# 📋 Tabla de Faltantes y Partes del Backend

Aquí tienes el resumen tabular de lo que falta para completar el backend de TierOne:

### 🔴 Funcionalidad Crítica (El "Core")

| Componente | Estado | Lo que FALTA (Detalle) | Prioridad |
| :--- | :--- | :--- | :--- |
| **🔐 Middleware** | ⚠️ Crítico | • `CheckRole` (Admin/Staff/Player)<br>• `CheckTorneoOwner`<br>• `CheckOrdenOwner`<br>• `ThrottleApi` (Rate Limiting) | **Alta 🔴** |
| **📝 Form Requests** | ❌ Incompleto (33%) | • `StoreProductoRequest` / `Update...`<br>• `StoreTorneoRequest` / `Update...`<br>• `StoreOrdenRequest` / `Update...`<br>• `StorePartidaRequest` / `Update...`<br>• `StoreReviewRequest` / `Update...`<br>• (Y 15+ más para otros modelos) | **Alta 🔴** |
| **🛣️ Rutas API** | ✅ Funcional (90%) | • Aplicar middleware de Roles a rutas existentes<br>• Verificar rutas públicas vs privadas | **Alta 🔴** |

---

### 🟡 Calidad y Mantenimiento

| Componente | Estado | Lo que FALTA (Detalle) | Prioridad |
| :--- | :--- | :--- | :--- |
| **🏭 Factories** | ❌ Mínimo (8%) | • `ProductoFactory`<br>• `CategoriaFactory`<br>• `TorneoFactory`<br>• `OrdenFactory`<br>• `CarritoFactory`<br>• (Y 20+ más para otros modelos) | **Media 🟡** |
| **🧪 Tests** | ❓ Pendiente | • Feature Tests para flujos principales<br>• Unit Tests para modelos/traits | **Media 🟡** |
| **✨ Accessors/Mutators** | ❌ Ninguno (0%) | • **User**: `password` (hash automático), `nombreCompleto`<br>• **Producto**: `precioFormateado`, `enStock`<br>• **Torneo**: `estaActivo`<br>• **Orden**: `totalFormateado`<br>• **Review**: `esReciente` | **Baja 🟢** |

---

### 🟣 Nivel Senior (Escalabilidad y Proceso en 2º Plano)

**Esto es lo que diferencia un CRUD básico de una plataforma profesional.** Actualmente **NO EXISTE** nada de esto en el proyecto.

| Componente | Estado | Para qué sirve | Prioridad |
| :--- | :--- | :--- | :--- |
| **✉️ Mailables** | ❌ Inexistente | • Enviar emails de bienvenida<br>• Confirmación de compra<br>• Notificación de torneo<br>• Reset de password | **Media 🟡** |
| **⚡ Events & Listeners** | ❌ Inexistente | • Desacoplar lógica (ej: `OrderPlaced` dispara `SendEmail` y `ReduceStock`)<br>• Mantener controladores limpios | **Media 🟡** |
| **⏳ Jobs & Queues** | ❌ Inexistente | • Procesar tareas pesadas en segundo plano (ej: generar reportes PDF, procesar pagos lentos)<br>• No bloquear al usuario | **Baja 🟢** |
| **⏰ Scheduling** | ❌ Inexistente | • Tareas automáticas (ej: cerrar torneos vencidos cada noche, limpiar carritos abandonados) | **Baja 🟢** |

---

## 📅 Hoja de Ruta Sugerida

1.  **Seguridad (Hoy)**: Implementar Middleware de Roles.
2.  **Validación**: Crear Form Requests para productos y torneos.
3.  **Testing**: Crear Factories para productos y usuarios.
4.  **Funcionalidad Senior**: Implementar sistema de Emails y Eventos básicos.
