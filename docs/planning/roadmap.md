# Auditoría Arquitectónica y Plan Estratégico para TierOne

**Estado General:** Auditoría realizada por el equipo de Arquitectura.
**Fecha:** Abril 2026

## 1. Informe de Estado Profundo (Architectural Review)

### Stack Tecnológico
- **Backend:** Laravel 12.0 (PHP 8.2+) con Sanctum para autenticación.
- **Frontend:** React 18.2 gestionado a través de Inertia.js 2.0 y Vite 7.
- **Base de Datos:** MySQL con migraciones estructuradas bajo Eloquent ORM.

### Evaluación del Código
- **Patrón MVC:** Implementación monolítica robusta.
- **Deuda Técnica de Controladores:** Existen duplicidades de nomenclatura inglés/español (ej: `CategoryController` y `CategoriaController`). Esto viola el principio DRY y causa problemas de escalabilidad. Requerimos refactorización a un estándar único (prioridad backend).
- **Rutas:** Los grupos de `panel-admin-ecommerce` están desplegados, pero requieren refinamiento del backend y RBAC (Role-Based Access Control) robusto.

## 2. Hoja de Ruta de Implementación (Backend Primero)

### Fase 1: Saneamiento y Consolidación del Backend
1. **Unificación de Controladores:** Limpiar la dualidad inglés/español en todo el espacio de nombres `App\Http\Controllers`. 
2. **Revisión de Controladores Duplicados:** 
   - `OrderController` / `OrdenController`
   - `ProductController` / `ProductoController`
   - `CategoryController` / `CategoriaController`
3. **Auditoría de Rutas:** Adaptar `web.php` y `api.php` para apuntar a los controladores correctos unificados. Eliminar endpoints fantasma.
4. **Refactorización de Lógica de Negocio:** Centralizar logica pesada de los controladores en *Services* o *Actions* si es necesario para mantener los controladores ligeros.

### Fase 2: Mejora de Rendimiento y Calidad de Consultas
1. **Optimización N+1:** Implementar Eager Loading (`with()`) correcto en las queries más pesadas, especialmente en el catálogo y torneos.
2. **Caché:** Añadir Cache a endpoints que devuelven data estática (ej: listado de juegos activos o categorías principales).

### Fase 3: Testing y Seguridad
1. **Verificación RBAC:** Asegurar que todos los accesos al panel de administración validen el rol estricto.
2. **Integración Contínua Prep:** Desplegar esqueletos de testing (Pest/PHPUnit) para las funcionalidades core unificadas.

---

> *Este documento es una guía viva que evolucionará durante los próximos Sprints de desarrollo enfocados en la estabilidad del Backend.*
