# 👥 Índice de Resultados UAT — TierOne

**Período de Pruebas:** 10 – 14 de mayo de 2026
**Módulos Evaluados:** Editor Visual, E-commerce, Torneos, Autenticación Twitch, Hydra Coins, Panel Admin.
**Resultado Global:** ✅ **APROBADO — Plataforma validada para paso a Producción**

---

## 📋 Resumen Ejecutivo

Las Pruebas de Aceptación de Usuario (UAT) se realizaron con **5 evaluadores externos** seleccionados como representantes del público objetivo de la plataforma (managers de equipos esports, streamers y jugadores habituales de torneos). Cada evaluador ejecutó un protocolo de tareas real sobre un entorno de Staging configurado de forma idéntica al sistema de Producción.

El resultado global de la ronda de pruebas es **ampliamente positivo**. Los 5 evaluadores completaron todas las tareas asignadas sin incidencias técnicas graves y emitieron valoraciones de **Sobresaliente** en los criterios de Diseño Visual y Rendimiento.

---

## 👤 Participantes y Resultados Individuales

| # | Evaluador/a | Fecha | Módulos Principales Evaluados | Valoración Global | Informe Completo |
| :---: | :--- | :--- | :--- | :---: | :---: |
| 1 | **María Luisa Montes Belloso** | 10/05/2026 | Catálogo, Editor Visual, Proceso de Compra | ⭐ Sobresaliente | [📄 Ver UAT](./UAT_01_Maria_Luisa_Montes.md) |
| 2 | **Cristina Cabrera López** | 11/05/2026 | Registro, Auth Twitch, Tienda, Carrito, Facturación | ⭐ Sobresaliente | [📄 Ver UAT](./UAT_02_Cristina_Cabrera.md) |
| 3 | **Soraya Galisteo González** | 12/05/2026 | Editor Visual, Panel de Cuenta, Torneos | ⭐ Sobresaliente | [📄 Ver UAT](./UAT_03_Soraya_Galisteo.md) |
| 4 | **Luis Talavera González** | 13/05/2026 | Hydra Coins, Panel Admin (Staff) | ⭐ Notable | [📄 Ver UAT](./UAT_04_Luis_Talavera.md) |
| 5 | **Francisco Javier Herrera Moreno** | 14/05/2026 | Registro, Torneos, Experiencia Global | ⭐ Sobresaliente | [📄 Ver UAT](./UAT_05_Francisco_Javier_Herrera.md) |

---

## 📊 Estadísticas Agregadas de Valoración

| Criterio Evaluado | Sobresaliente | Notable | Aprobado | Insuficiente |
| :--- | :---: | :---: | :---: | :---: |
| Identidad Visual y Diseño | 5/5 | 0/5 | 0/5 | 0/5 |
| Rendimiento y Fluidez | 4/5 | 1/5 | 0/5 | 0/5 |
| Funcionalidad y UX | 5/5 | 0/5 | 0/5 | 0/5 |
| Adaptabilidad Mobile | 4/5 | 1/5 | 0/5 | 0/5 |
| Sistema de Torneos | 5/5 | 0/5 | 0/5 | 0/5 |
| Ausencia de Errores Técnicos | 5/5 | 0/5 | 0/5 | 0/5 |

---

## 🗂️ Incidencias y Mejoras Detectadas en UAT

| ID | Evaluador | Módulo | Observación | Prioridad | Acción |
| :--- | :--- | :--- | :--- | :---: | :--- |
| UAT-01 | Luis Talavera González | Panel Admin | Las tablas de pedidos requieren scroll horizontal en pantallas de tablet (10") | P4 | Mejora futura: Aplicar diseño responsive de columnas colapsables en tablas de admin. |

> [!NOTE]
> No se registraron incidencias de prioridad P1, P2 o P3. El único punto de mejora detectado (UAT-01) es de carácter cosmético y **no es bloqueante** para el despliegue a Producción.

---

## ✍️ Acta Formal de Aceptación

> Mediante la firma implícita de sus respectivos informes de prueba, los cinco evaluadores designados — **María Luisa Montes Belloso, Cristina Cabrera López, Soraya Galisteo González, Luis Talavera González y Francisco Javier Herrera Moreno** — certifican que la plataforma **TierOne** en su versión Release Candidate evaluada entre el 10 y el 14 de mayo de 2026 cumple con los objetivos funcionales, de usabilidad y de rendimiento establecidos en el pliego de condiciones del proyecto.
>
> La plataforma **queda aprobada para su despliegue en el entorno de Producción**, condicionado a la resolución opcional de la mejora de baja prioridad UAT-01 en una iteración futura planificada.

---
[🔙 Volver al Hub](../../00_HUB.md) | *Gestión de Proyecto - TierOne UAT*
