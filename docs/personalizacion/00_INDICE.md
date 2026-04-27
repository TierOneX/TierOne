# 🎨 Sistema de Personalización de Productos — TierOne

## Índice de Módulos

Este documento es el **índice maestro** del sistema de personalización de productos para el e-commerce TierOne. La implementación está dividida en **7 módulos independientes** que pueden ejecutarse en orden secuencial.

### Módulos

| # | Módulo | Archivo | Dependencias |
|---|--------|---------|-------------|
| 0 | [Contexto del Proyecto](./01_CONTEXTO_PROYECTO.md) | `01_CONTEXTO_PROYECTO.md` | Ninguna — LEER PRIMERO |
| 1 | [Base de Datos y Modelos](./02_BASE_DATOS_MODELOS.md) | `02_BASE_DATOS_MODELOS.md` | Módulo 0 |
| 2 | [Backend: Servicios y Controladores](./03_BACKEND_SERVICIOS_CONTROLADORES.md) | `03_BACKEND_SERVICIOS_CONTROLADORES.md` | Módulos 0, 1 |
| 3 | [Admin: Configuración de Zonas y Precios](./04_ADMIN_ZONAS_PRECIOS.md) | `04_ADMIN_ZONAS_PRECIOS.md` | Módulos 0, 1, 2 |
| 4 | [Frontend: Editor Fabric.js](./05_EDITOR_FABRICJS.md) | `05_EDITOR_FABRICJS.md` | Módulos 0, 1, 2 |
| 5 | [Integración Carrito y Checkout](./06_INTEGRACION_CARRITO.md) | `06_INTEGRACION_CARRITO.md` | Módulos 0, 1, 2, 4 |
| 6 | [Admin: Visualización Pedidos Personalizados](./07_ADMIN_PEDIDOS_PERSONALIZADOS.md) | `07_ADMIN_PEDIDOS_PERSONALIZADOS.md` | Módulos 0, 1, 2, 5 |

### Reglas para los Agentes

1. **Lee SIEMPRE el Módulo 0 primero** — contiene el contexto técnico del proyecto (stack, estructura de archivos, convenciones).
2. **Cada módulo es autocontenido** — incluye todo el código necesario, rutas de archivo exactas, y contratos de entrada/salida.
3. **No modifiques código fuera del alcance del módulo** — si un módulo dice "modificar X", solo modifica X.
4. **Verifica al final de cada módulo** — cada módulo incluye una sección de verificación con comandos exactos.
5. **Si algo falla, vuelve al checkpoint del módulo anterior** — los módulos son puntos de respawn.

### Orden de Ejecución Recomendado

```
Módulo 0 (leer) → Módulo 1 → Módulo 2 → Módulo 3 (admin zonas)
                                        → Módulo 4 (editor) ← pueden ser paralelos
                              → Módulo 5 (carrito) → Módulo 6 (admin pedidos)
```
