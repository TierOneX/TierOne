# 🔄 Procedimiento de Control de Cambios

Con el objetivo de prevenir el descontrol de alcance ("scope creep"), todo nuevo requerimiento o modificación sustancial no contemplada en el diseño arquitectónico inicial debe procesarse mediante un Request for Change (RFC) formal.

## 1. Flujo del Control de Cambios
1. **Solicitud Formal:** El cliente, analista o Product Owner emite un RFC justificando la necesidad técnica o de negocio.
2. **Análisis de Impacto Técnico:** El equipo desarrollador evalúa a fondo cómo afecta la petición al esquema de base de datos actual, la refactorización de código necesaria, las dependencias y la seguridad. Se calculan desviaciones en tiempo y presupuesto.
3. **Comité de Aprobación:** La dirección técnica y de negocio sopesan el valor aportado frente al riesgo técnico. Se aprueba o rechaza.
4. **Implementación Controlada:** Si es aceptado, el cambio pasa a formar parte estructurada del backlog general del proyecto para un próximo sprint.

---

## 📝 Registro Histórico de Solicitudes de Cambio (Log)

| ID Cambio | Fecha Solicitud | Origen | Descripción Breve del Cambio Solicitado | Análisis de Impacto (Técnico/Riesgo) | Estado | Decisión |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| RFC-001 | 05/04/2026 | Negocio | Implementar autenticación directa vía Twitch API | **Alto:** Obliga a refactorizar la estructura de la tabla `users` e implementar OAuth en `TwitchAuthService`. | ✅ Aprobado | Incremento de retención. |
| RFC-002 | 20/04/2026 | Marketing | Incorporar "Hydra Coins" como método de pago virtual integral | **Crítico:** Modifica la lógica fundamental de `OrderService` y la facturación, inyectando un riesgo contable considerable en los cálculos de IVA. | ✅ Aprobado | Eje central del modelo de negocio. |
| RFC-003 | 01/05/2026 | UI/UX | Migrar visor 2D de camisetas a un entorno de renderizado 3D web | **Extremo:** Invalida el código actual de React, añade excesiva carga y requiere librerías externas de 3D. +4 semanas estimadas. | ❌ Rechazado | Riesgo inasumible en fase MVP. |

---

## Plantilla RFC (Para Nuevas Peticiones)
Para solicitar un nuevo cambio formal en la arquitectura de TierOne:

- **Título del Cambio Propuesto:** 
- **Justificación (Motivo de Negocio o Técnico):** 
- **Módulos / Componentes Afectados:** 
- **Estimación de Esfuerzo (Nivel Dev):** 
- **Riesgos Técnicos y Bloqueos Potenciales:** 

---
[🔙 Volver al Hub](../00_HUB.md) | *Gestión de Proyecto - TierOne*
