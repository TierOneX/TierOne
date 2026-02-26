# 📝 Lista de Tareas Backend (TierOne)

## ✅ Fase 0: Auditoría y Planificación
- [x] Inventario de estado actual
- [x] Identificar componentes faltantes
- [x] Definir arquitectura (No Inertia, API REST)
- [x] Crear hoja de ruta priorizada

## 🔴 Fase 1: Seguridad y Middleware (Prioridad ALTA)
- [ ] **M1**. Implementar middleware `CheckRole` (Admin, Staff, Player)
- [ ] **M2**. Aplicar middleware de roles a rutas en `api.php`
- [ ] **M3**. Implementar middleware `CheckTorneoOwner`
- [ ] **M4**. Implementar middleware `CheckOrdenOwner`
- [ ] **M5**. Configurar Rate Limiting (`ThrottleApi`)

## 🔴 Fase 2: Validación y Form Requests (Prioridad ALTA)
- [ ] **R1**. Crear `StoreProductoRequest` y `UpdateProductoRequest`
- [ ] **R2**. Crear `StoreTorneoRequest` y `UpdateTorneoRequest`
- [ ] **R3**. Crear `StoreOrdenRequest` y `UpdateOrdenRequest`
- [ ] **R4**. Crear `StorePartidaRequest` y `UpdatePartidaRequest`
- [ ] **R5**. Crear `StoreReviewRequest` y `UpdateReviewRequest`
- [ ] **R6**. Crear `StoreCarritoRequest` y `UpdateCarritoRequest`
- [ ] **R7**. Refactorizar controladores para usar estos Requests

## 🟡 Fase 3: Testing y Factories (Prioridad MEDIA)
- [ ] **F1**. Crear `ProductoFactory`
- [ ] **F2**. Crear `CategoriaFactory`
- [ ] **F3**. Crear `TorneoFactory`
- [ ] **F4**. Crear `OrdenFactory`
- [ ] **F5**. Crear `CarritoFactory`
- [ ] **F6**. Completar Seeders con datos realistas
- [ ] **T1**. Escribir Feature Test para flujo de compra
- [ ] **T2**. Escribir Feature Test para inscripción a torneo

## 🟢 Fase 4: Refactorización y Calidad (Prioridad BAJA)
- [ ] **A1**. Implementar Accessors/Mutators en modelo `User`
- [ ] **A2**. Implementar Accessors en modelo `Producto` (`precioFormateado`)
- [ ] **A3**. Implementar Accessors en modelo `Torneo`
- [ ] **A4**. Implementar Accessors en modelo `Orden`

## 🟣 Fase 5: Funcionalidad Senior (Escalabilidad)
- [ ] **E1**. Configurar sistema de Emails (Mailtrap/SMTP)
- [ ] **E2**. Crear Mailable `BienvenidaUsuario`
- [ ] **E3**. Crear Mailable `ConfirmacionCompra`
- [ ] **J1**. Configurar Colas (Queues) en base de datos
- [ ] **EV1**. Implementar Evento `OrdenCreada`
- [ ] **L1**. Crear Listener `EnviarEmailConfirmacion` (conectado a OrdenCreada)
- [ ] **S1**. Configurar Scheduler para limpieza de tokens/carritos
