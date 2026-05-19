# 🎯 Indicadores de Calidad (KPIs)

Para asegurar la excelencia técnica y funcional de TierOne, se han establecido los siguientes KPIs con umbrales de aceptación estrictos y objetivos.

## 1. KPIs Frontend (Experiencia de Usuario y Rendimiento)
| Indicador | Descripción | Umbral de Aceptación | Herramienta |
| :--- | :--- | :--- | :--- |
| **LCP** (Largest Contentful Paint) | Tiempo de renderizado del elemento visual principal de la pantalla | `< 2.5 s` | Google Lighthouse / Web Vitals |
| **CLS** (Cumulative Layout Shift) | Estabilidad visual (saltos de contenido) durante la carga | `< 0.1` | Google Lighthouse / Web Vitals |
| **Accesibilidad** | Puntuación de buenas prácticas (WCAG) y contraste | `> 90/100` | Google Lighthouse |

## 2. KPIs Backend (Rendimiento, Lógica y Estabilidad)
| Indicador | Descripción | Umbral de Aceptación | Herramienta |
| :--- | :--- | :--- | :--- |
| **Tiempo de Respuesta API** | Latencia media de endpoints críticos (ej. Checkout, Integración Stripe) | `< 250 ms` | Laravel Telescope / Postman |
| **Cobertura de Tests** | Porcentaje de código crítico cubierto por Unit/Feature tests | `> 80%` | PHPUnit Coverage |
| **Tasa de Error SQL** | Consultas fallidas, deadlocks o cuellos de botella severos (N+1) | `0%` tolerado en Prod | Laravel Telescope |

## 3. KPIs de Producto (Negocio y Usuario)
| Indicador | Descripción | Umbral de Aceptación | Herramienta |
| :--- | :--- | :--- | :--- |
| **Uptime del Sistema** | Disponibilidad real de los servidores en Producción | `99.9%` | UptimeRobot |
| **Tasa de Abandono de Carrito**| Usuarios que inician pero no completan el flujo de pago final | `< 40%` | Analítica Interna / Panel |
| **Resolución Crítica** | Tiempo SLA para resolver un bug de prioridad Alta/Crítica (P1/P2) | `< 24 horas` | Sistema de Gestión Interno |

---
[🔙 Volver al Hub](../00_HUB.md) | *Gestión de Proyecto - TierOne*
