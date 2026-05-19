# 🚨 Gestión de Incidencias y Problemas

El ciclo de vida de los bugs y errores detectados en Producción o en entornos de pruebas de aceptación (UAT) se rige de manera obligatoria por la siguiente metodología formal.

## 1. Matriz de Clasificación y Prioridad
- **Crítica (P1):** El sistema está caído, bloqueos totales en pagos o pérdida de datos. (SLA Resolución: < 4 horas).
- **Alta (P2):** Funcionalidad principal rota pero con posible solución alternativa temporal o "workaround" (SLA Resolución: < 24 horas).
- **Media (P3):** Errores visuales moderados, bugs en flujos no críticos (SLA Resolución: Próximo Sprint).
- **Baja (P4):** Mejoras estéticas menores o correcciones ortográficas.

## 2. Flujo de Trabajo (Workflow)
1. **Detección y Registro:** El QA o usuario levanta el ticket adjuntando evidencias (Logs, Capturas) y pasos para reproducir.
2. **Triaje y Asignación:** El Project Manager valida la incidencia, establece prioridad y asigna al desarrollador adecuado.
3. **Resolución (Fixing):** El desarrollador aísla la corrección en una rama `hotfix/` o `bugfix/` según urgencia.
4. **Validación (QA):** Se prueba la corrección en un entorno aislado de Staging.
5. **Post-Mortem Técnico:** (Obligatorio para P1 y P2) Documentación formal de la causa raíz y medidas preventivas adoptadas.

---

## 📋 Log de Incidencias Históricas y Lecciones Aprendidas

| ID | Fecha | Componente | Descripción de la Incidencia | Prioridad | Estado | Lección Aprendida (Post-Mortem) / Causa Raíz |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| INC-001 | 10/05/2026 | Editor Visual | Desplazamiento (drift) de coordenadas entre Admin y Cliente al recuperar el diseño | Media | ✅ Resuelto | Estandarizar la resolución del lienzo (`canvas_width`) guardando una constante en Base de Datos para asegurar cálculos proporcionales exactos en cualquier pantalla. |
| INC-002 | 12/05/2026 | Carrito | Exportación a PNG devuelve imagen en blanco en móviles de gama baja | Alta | ✅ Resuelto | Uso de imagen nativa HTML `<img>` detrás del elemento Canvas para evitar los excesos de consumo de memoria de renderizado de Fabric.js con texturas masivas. |
| INC-003 | 18/05/2026 | Pasarela | Modal de Stripe no renderiza (pantalla en blanco) si falla de backend | Crítica | ⏳ En Progreso | Asegurar manejo de excepciones robusto del `PaymentIntent` antes de inicializar React, mostrando un fallback UI amigable al cliente. |

---
[🔙 Volver al Hub](../00_HUB.md) | *Gestión de Proyecto - TierOne*
