# 📈 Procedimientos de Evaluación

Este documento define la metodología sistemática para evaluar el estado, la calidad y el avance del proyecto **TierOne**, garantizando la alineación con los objetivos de negocio.

## 1. Ciclos de Evaluación
El proyecto se evalúa mediante iteraciones quincenales (Sprints). Al finalizar cada ciclo, se ejecutan tres tipos de evaluación:
1. **Evaluación de Código (Peer Review):** Todo nuevo Pull Request (PR) debe ser revisado por al menos un desarrollador externo a la tarea.
2. **Evaluación de Calidad (QA):** Ejecución automatizada de la suite de testing (`php artisan test`) garantizando que no existan regresiones.
3. **Retrospectiva de Proyecto:** Reunión del equipo para evaluar bloqueos, velocidad de desarrollo y áreas de mejora metodológica.

## 2. Auditorías de Hitos (Milestones)
Al alcanzar un hito principal del proyecto (ej. Lanzamiento del Módulo E-commerce, Integración de Torneos), se realiza una auditoría formal que verifica:
- Cumplimiento estricto de la **Matriz de Trazabilidad**.
- Verificación de **KPIs Técnicos y de Negocio**.
- Revisión del presupuesto y tiempo invertido frente a lo estimado.

## 3. Herramientas de Evaluación Continuas
- **Testing y Lógica:** PHPUnit (Backend) para aserciones de procesos de negocio críticos.
- **Análisis Estático:** Laravel Pint y ESLint para mantener el estándar de código del proyecto sin fisuras.
- **Rendimiento:** Lighthouse (Frontend) y Laravel Telescope (Backend) para métricas vitales.

---
[🔙 Volver al Hub](../00_HUB.md) | *Gestión de Proyecto - TierOne*
