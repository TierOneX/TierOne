# Lecciones Aprendidas: Migración a Fabric.js v7 y Desplazamiento de Coordenadas

Este documento detalla la resolución de un bug crítico de desplazamiento y crecimiento sistemático de las zonas de personalización tras la actualización a **Fabric.js v7**.

## El Problema
Los usuarios (administradores) reportaron que al editar las zonas de un producto, estas se desplazaban hacia la derecha y abajo de forma sistemática. Además, cada vez que se guardaba y se volvía a abrir el editor, las zonas eran ligeramente más grandes que antes.

## Causas Raíz (Cambios en Fabric.js v6/v7)

Tras una investigación en la documentación oficial y pruebas técnicas, se identificaron tres cambios disruptivos en la API de Fabric.js que causaron este comportamiento:

### 1. Cambio en los Orígenes por Defecto
En versiones anteriores (v5), el origen por defecto de cualquier objeto era `left` / `top`. 
*   **En Fabric v7**: El valor por defecto ha cambiado a **`center` / `center`**.
*   **Impacto**: Al cargar una zona con `left: 100`, Fabric posicionaba el **centro** del rectángulo en 100, desplazando visualmente toda la zona media anchura hacia la derecha y media altura hacia abajo.

### 2. `getScaledWidth()` y `getScaledHeight()` incluyen el Borde
*   **En Fabric v5**: Estos métodos devolvían `width * scaleX`.
*   **En Fabric v7**: Estos métodos ahora incluyen el **grosor del borde (`strokeWidth`)**.
*   **Impacto**: Al guardar las dimensiones, se estaba guardando `ancho + borde`. Al recargar, Fabric aplicaba el borde sobre esa nueva medida, haciendo que la zona creciera 2px (o lo que dictara el borde) en cada ciclo de guardado.

### 3. `getBoundingRect()` y el Borde
El método `getBoundingRect()` ahora incluye el borde por defecto y su comportamiento con `strokeUniform` ha cambiado, lo que provocaba que las coordenadas de la caja de colisión no coincidieran con las coordenadas del "camino" (path) del rectángulo.

---

## Solución Implementada

Para "blindar" el sistema contra estos cambios de Fabric v7, se aplicaron las siguientes medidas en `FabricZoneEditor.jsx` y `DesignCanvas.jsx`:

### A. Forzado de Orígenes
Se definieron explícitamente los orígenes al crear o cargar cualquier objeto:
```javascript
originX: 'left',
originY: 'top'
```

### B. Alineación de Borde Interna (`strokeAlign`)
Se utilizó la nueva propiedad `strokeAlign` para asegurar que el borde no afecte a las dimensiones externas:
```javascript
strokeWidth: 2,
strokeUniform: true,
strokeAlign: 'inside' // El borde crece hacia ADENTRO del rectángulo
```
Al usar `inside`, los límites visuales del objeto coinciden exactamente con sus propiedades `left`, `top`, `width` y `height`.

### C. Serialización Limpia
Se modificó la lógica de guardado para ignorar el borde de Fabric:
```javascript
// Correcto para v7
width:  o.width * o.scaleX,
height: o.height * o.scaleY

// Incorrecto en v7 (incluye borde)
width:  o.getScaledWidth()
```

---

## Conclusión y Buenas Prácticas
Para futuros desarrollos con Fabric.js v7 en TierOne:
1.  **Nunca asumir orígenes**: Definir siempre `originX` y `originY`.
2.  **Cuidado con los "Scaled" methods**: Si se requiere la dimensión pura del objeto, calcularla manualmente (`prop * scale`).
3.  **Usar `strokeAlign`**: Para zonas de dibujo o marcos, `inside` es preferible para evitar desplazamientos de coordenadas.
