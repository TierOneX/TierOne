# Módulo 4 — Frontend: Editor Fabric.js

> **PREREQUISITO**: Módulos 1 y 2 completados. `npm install fabric` ejecutado.
> **RESULTADO**: Editor visual funcional donde el usuario personaliza el producto.
> **CHECKPOINT**: El editor carga, permite añadir textos e imágenes, y exporta JSON + PNG.

---

## 4.1 Instalar Fabric.js

```bash
cd TierOne/TierOne
npm install fabric
```

---

## 4.2 Página Principal del Editor

**Archivo**: `TierOne/TierOne/resources/js/Pages/ProductCustomizer.jsx`

Esta página recibe del backend (vía Inertia): `producto`, `zonas` (array de ZonaPersonalizacion **filtradas**: solo `impresion` y `baja_visibilidad`, las `bloqueada` se excluyen en el backend), `precios` (`{texto: float, imagen: float}`).

**Layout del editor**:
- **Izquierda**: Panel de herramientas (añadir texto, subir imagen) + panel de capas
- **Centro**: Canvas Fabric.js mostrando la imagen base del producto con el área imprimible delimitada
- **Derecha/Inferior**: Selector de zonas (tabs: Frontal, Espalda...) + resumen de precio + botón "Añadir al carrito"

**Funcionalidades clave**:
1. El canvas muestra la imagen base de la zona seleccionada como fondo (no seleccionable)
2. El área imprimible se muestra con un rectángulo de borde punteado (clipPath de Fabric.js para que los elementos no salgan del área)
3. Al añadir texto: se crea un `fabric.IText` dentro del área imprimible, editable en doble clic
4. Al añadir imagen: se abre un file picker, se sube al backend vía POST `/customization/upload-image`, y se crea un `fabric.Image` en el canvas
5. Los elementos son arrastrables, redimensionables y rotables dentro del área (usar clipPath para restringir)
6. Al cambiar de zona (tab), se guarda el estado del canvas actual y se carga el de la nueva zona
7. El precio se calcula en tiempo real: cuenta textos + imágenes × precio unitario

**Manejo de tipos de zona en el editor del cliente**:
- Las zonas de tipo `bloqueada` **no llegan al frontend** — se filtran en `CustomizationService.getProductCustomizationData()` antes de enviarlas
- Las zonas de tipo `baja_visibilidad` se muestran con un overlay ámbar semi-transparente y un icono de warning, pero el cliente puede añadir elementos
- Las zonas de tipo `impresion` funcionan normalmente

**Estructura del componente**:

```jsx
import { Head, router } from '@inertiajs/react';
import { useState, useRef, useEffect, useCallback } from 'react';
import { useCart } from '@/Contexts/CartContext';
import MainLayout from '@/Layouts/MainLayout';
import DesignCanvas from '@/Components/Customizer/DesignCanvas';
import TextTool from '@/Components/Customizer/TextTool';
import ImageTool from '@/Components/Customizer/ImageTool';
import LayerPanel from '@/Components/Customizer/LayerPanel';
import ZoneSelector from '@/Components/Customizer/ZoneSelector';
import PriceSummary from '@/Components/Customizer/PriceSummary';
import { Type, ImagePlus, Layers, ShoppingCart, ArrowLeft } from 'lucide-react';

export default function ProductCustomizer({ producto, zonas, precios }) {
    const { addToCart } = useCart();
    const [activeZoneIndex, setActiveZoneIndex] = useState(0);
    const [activeTool, setActiveTool] = useState(null); // 'text' | 'image' | null
    const [zonesData, setZonesData] = useState({}); // { zonaId: { layers: [], fabricJSON: {} } }
    const canvasRef = useRef(null); // Referencia al componente DesignCanvas

    const activeZone = zonas[activeZoneIndex];

    // Contar elementos para precio
    const totalElements = Object.values(zonesData).reduce((acc, zd) => {
        const layers = zd.layers || [];
        return {
            textos: acc.textos + layers.filter(l => l.tipo === 'texto').length,
            imagenes: acc.imagenes + layers.filter(l => l.tipo === 'imagen').length,
        };
    }, { textos: 0, imagenes: 0 });

    const recargo = (totalElements.textos * precios.texto) + (totalElements.imagenes * precios.imagen);

    const handleAddText = (textConfig) => {
        // textConfig: { content, fontSize, fontFamily, color }
        canvasRef.current?.addText(textConfig);
    };

    const handleAddImage = async (file) => {
        // 1. Subir imagen al backend
        const formData = new FormData();
        formData.append('imagen', file);
        const response = await fetch(route('customization.upload'), {
            method: 'POST',
            body: formData,
            headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content }
        });
        const data = await response.json();
        // 2. Añadir al canvas
        canvasRef.current?.addImage(data.url);
    };

    const handleLayersUpdate = (layers) => {
        setZonesData(prev => ({
            ...prev,
            [activeZone.id]: { ...prev[activeZone.id], layers }
        }));
    };

    const handleZoneChange = (index) => {
        // Guardar estado actual del canvas
        if (canvasRef.current) {
            const currentData = canvasRef.current.exportData();
            setZonesData(prev => ({
                ...prev,
                [activeZone.id]: currentData
            }));
        }
        setActiveZoneIndex(index);
    };

    const handleAddToCart = async () => {
        // 1. Exportar PNG de cada zona
        const renders = {};
        for (const zona of zonas) {
            if (zonesData[zona.id]?.layers?.length > 0) {
                // Cambiar a esa zona, renderizar, y capturar PNG
                renders[zona.id] = canvasRef.current?.exportPNG();
            }
        }

        // 2. Construir personalizacion_data
        const personalizacionData = {
            producto_id: producto.id,
            producto_nombre: producto.nombre,
            zonas: zonas.map(z => ({
                zona_id: z.id,
                zona_nombre: z.nombre,
                imagen_base: z.imagen_base,
                area_impresion: { x: z.area_x, y: z.area_y, width: z.area_width, height: z.area_height },
                capas: zonesData[z.id]?.layers || [],
            })).filter(z => z.capas.length > 0),
            precio_elementos: {
                textos: totalElements.textos,
                imagenes: totalElements.imagenes,
                precio_texto: precios.texto,
                precio_imagen: precios.imagen,
                total_recargo: recargo,
            },
            renders, // PNGs en base64 por zona
        };

        // 3. Añadir al carrito con datos de personalización
        addToCart(producto, null, 1, personalizacionData);

        // 4. Redirigir al carrito
        router.visit(route('cart'));
    };

    return (
        <MainLayout>
            <Head title={`Personalizar ${producto.nombre} - TierOne`} />

            <section className="bg-[#0a0a0a] min-h-screen pt-4 pb-12 px-4">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <a href={`/shop/${producto.slug}`}
                                className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
                                <ArrowLeft className="w-5 h-5 text-white" />
                            </a>
                            <h1 className="text-white font-black text-lg uppercase tracking-tight">
                                Personalizar: <span className="text-[#e31837]">{producto.nombre}</span>
                            </h1>
                        </div>
                    </div>

                    {/* Zone Selector */}
                    <ZoneSelector
                        zonas={zonas}
                        activeIndex={activeZoneIndex}
                        onChange={handleZoneChange}
                    />

                    {/* Main Grid: Tools | Canvas | Price */}
                    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_280px] gap-6 mt-6">
                        {/* Left: Tools */}
                        <div className="space-y-4">
                            <TextTool onAddText={handleAddText} />
                            <ImageTool onAddImage={handleAddImage} />
                            <LayerPanel
                                layers={zonesData[activeZone?.id]?.layers || []}
                                onSelectLayer={(i) => canvasRef.current?.selectLayer(i)}
                                onDeleteLayer={(i) => canvasRef.current?.deleteLayer(i)}
                            />
                        </div>

                        {/* Center: Canvas */}
                        <DesignCanvas
                            ref={canvasRef}
                            zona={activeZone}
                            savedData={zonesData[activeZone?.id]}
                            onLayersUpdate={handleLayersUpdate}
                        />

                        {/* Right: Price + Add to Cart */}
                        <div className="space-y-4">
                            <PriceSummary
                                precioBase={Number(producto.precio_venta)}
                                elementos={totalElements}
                                precios={precios}
                                recargo={recargo}
                            />
                            <button
                                onClick={handleAddToCart}
                                disabled={recargo === 0}
                                className={`w-full py-4 rounded-xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${
                                    recargo === 0
                                        ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                                        : 'bg-[#e31837] text-white hover:bg-red-700 active:scale-[0.98]'
                                }`}
                            >
                                <ShoppingCart className="w-5 h-5" />
                                AÑADIR AL CARRITO
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </MainLayout>
    );
}
```

---

## 4.3 Componente: `DesignCanvas.jsx`

**Archivo**: `TierOne/TierOne/resources/js/Components/Customizer/DesignCanvas.jsx`

Este es el componente más complejo. Usa Fabric.js para:
- Mostrar imagen base del producto como fondo (no seleccionable)
- Delimitar el área imprimible con un clipPath (los elementos no pueden salir)
- Gestionar capas (textos e imágenes del usuario)
- Exponer métodos vía `forwardRef` + `useImperativeHandle`: `addText`, `addImage`, `deleteLayer`, `selectLayer`, `exportData`, `exportPNG`

**Implementación clave**:

```jsx
import { forwardRef, useImperativeHandle, useRef, useEffect, useState } from 'react';
import * as fabric from 'fabric';

const DesignCanvas = forwardRef(({ zona, savedData, onLayersUpdate }, ref) => {
    const canvasElRef = useRef(null);
    const fabricRef = useRef(null);
    const [layers, setLayers] = useState([]);

    // Inicializar Fabric.js canvas
    useEffect(() => {
        if (!zona || !canvasElRef.current) return;

        const canvas = new fabric.Canvas(canvasElRef.current, {
            width: zona.canvas_width,
            height: zona.canvas_height,
            backgroundColor: '#1a1a1a',
            selection: true,
        });
        fabricRef.current = canvas;

        // Cargar imagen base como fondo
        fabric.FabricImage.fromURL(zona.imagen_base).then((img) => {
            img.scaleToWidth(zona.canvas_width);
            img.set({ selectable: false, evented: false });
            canvas.setBackgroundImage(img);
            canvas.renderAll();
        });

        // ClipPath: restringir objetos al área imprimible
        const clipRect = new fabric.Rect({
            left: zona.area_x,
            top: zona.area_y,
            width: zona.area_width,
            height: zona.area_height,
            absolutePositioned: true,
        });

        // Dibujar borde del área imprimible (visual, no funcional)
        const areaBorder = new fabric.Rect({
            left: zona.area_x,
            top: zona.area_y,
            width: zona.area_width,
            height: zona.area_height,
            fill: 'transparent',
            stroke: 'rgba(168, 85, 247, 0.4)',
            strokeDashArray: [8, 4],
            strokeWidth: 2,
            selectable: false,
            evented: false,
        });
        canvas.add(areaBorder);

        // Restaurar datos guardados si existen
        if (savedData?.fabricJSON) {
            canvas.loadFromJSON(savedData.fabricJSON).then(() => {
                canvas.renderAll();
            });
        }

        // Listener: al modificar objetos, actualizar layers
        const updateLayers = () => {
            const objs = canvas.getObjects().filter(o => o.selectable);
            const newLayers = objs.map(o => ({
                tipo: o._customType || 'texto',
                contenido: o._customType === 'texto' ? o.text : o._customSrc,
                x: Math.round(o.left),
                y: Math.round(o.top),
                width: Math.round(o.getScaledWidth()),
                height: Math.round(o.getScaledHeight()),
                rotation: Math.round(o.angle || 0),
                fontSize: o.fontSize,
                fontFamily: o.fontFamily,
                color: o.fill,
            }));
            setLayers(newLayers);
            onLayersUpdate(newLayers);
        };

        canvas.on('object:modified', updateLayers);
        canvas.on('object:added', updateLayers);
        canvas.on('object:removed', updateLayers);

        // Restricción: no dejar salir objetos del área
        canvas.on('object:moving', (e) => {
            const obj = e.target;
            if (!obj.selectable) return;
            const bound = obj.getBoundingRect();
            const areaRight = zona.area_x + zona.area_width;
            const areaBottom = zona.area_y + zona.area_height;

            if (bound.left < zona.area_x) obj.left = zona.area_x + (obj.left - bound.left);
            if (bound.top < zona.area_y) obj.top = zona.area_y + (obj.top - bound.top);
            if (bound.left + bound.width > areaRight) obj.left = areaRight - bound.width + (obj.left - bound.left);
            if (bound.top + bound.height > areaBottom) obj.top = areaBottom - bound.height + (obj.top - bound.top);
        });

        return () => { canvas.dispose(); };
    }, [zona?.id]);

    // Métodos expuestos al padre
    useImperativeHandle(ref, () => ({
        addText: ({ content, fontSize, fontFamily, color }) => {
            const canvas = fabricRef.current;
            if (!canvas || !zona) return;
            const text = new fabric.IText(content || 'Tu texto', {
                left: zona.area_x + 20,
                top: zona.area_y + 20,
                fontSize: fontSize || 28,
                fontFamily: fontFamily || 'Arial',
                fill: color || '#ffffff',
                editable: true,
            });
            text._customType = 'texto';
            canvas.add(text);
            canvas.setActiveObject(text);
            canvas.renderAll();
        },

        addImage: (url) => {
            const canvas = fabricRef.current;
            if (!canvas || !zona) return;
            fabric.FabricImage.fromURL(url, { crossOrigin: 'anonymous' }).then((img) => {
                // Escalar para que quepa en el área
                const maxW = zona.area_width * 0.6;
                const maxH = zona.area_height * 0.6;
                const scale = Math.min(maxW / img.width, maxH / img.height, 1);
                img.set({
                    left: zona.area_x + 20,
                    top: zona.area_y + 20,
                    scaleX: scale,
                    scaleY: scale,
                });
                img._customType = 'imagen';
                img._customSrc = url;
                canvas.add(img);
                canvas.setActiveObject(img);
                canvas.renderAll();
            });
        },

        deleteLayer: (index) => {
            const canvas = fabricRef.current;
            const objs = canvas.getObjects().filter(o => o.selectable);
            if (objs[index]) {
                canvas.remove(objs[index]);
                canvas.renderAll();
            }
        },

        selectLayer: (index) => {
            const canvas = fabricRef.current;
            const objs = canvas.getObjects().filter(o => o.selectable);
            if (objs[index]) {
                canvas.setActiveObject(objs[index]);
                canvas.renderAll();
            }
        },

        exportData: () => ({
            layers,
            fabricJSON: fabricRef.current?.toJSON(),
        }),

        exportPNG: () => fabricRef.current?.toDataURL({ format: 'png', multiplier: 2 }),
    }));

    return (
        <div className="flex justify-center">
            <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-purple-500/5">
                <canvas ref={canvasElRef} />
            </div>
        </div>
    );
});

DesignCanvas.displayName = 'DesignCanvas';
export default DesignCanvas;
```

---

## 4.4 Componentes de Herramientas

### `TextTool.jsx`
**Archivo**: `TierOne/TierOne/resources/js/Components/Customizer/TextTool.jsx`

Panel con inputs para: texto, selector de fuente (Google Fonts libre), tamaño, color. Botón "Añadir Texto" que llama a `onAddText(config)`.

Debe incluir un `<select>` de fuentes con al menos estas opciones iniciales: Arial, Helvetica, Georgia, Times New Roman, Courier New, Verdana, Impact, Comic Sans MS. El usuario puede escribir cualquier nombre de fuente.

### `ImageTool.jsx`
**Archivo**: `TierOne/TierOne/resources/js/Components/Customizer/ImageTool.jsx`

Zona de drop + botón de file picker. Acepta imágenes hasta 10MB. Al seleccionar archivo, llama a `onAddImage(file)`. Muestra preview temporal mientras sube.

### `LayerPanel.jsx`
**Archivo**: `TierOne/TierOne/resources/js/Components/Customizer/LayerPanel.jsx`

Lista de capas activas. Cada ítem muestra: icono (Type para texto, Image para imagen), nombre/contenido truncado, botón eliminar. Clic en la capa llama a `onSelectLayer(index)`.

### `ZoneSelector.jsx`
**Archivo**: `TierOne/TierOne/resources/js/Components/Customizer/ZoneSelector.jsx`

Tabs horizontales con las zonas disponibles. Zona activa resaltada en púrpura. Si hay una sola zona, no mostrar el selector.

### `PriceSummary.jsx`
**Archivo**: `TierOne/TierOne/resources/js/Components/Customizer/PriceSummary.jsx`

Tarjeta con desglose del precio:
```
Precio base:          €29.99
+ 2 textos × €2.00:  €4.00
+ 1 imagen × €3.00:  €3.00
─────────────────────────
TOTAL:                €36.99
```

---

## 4.5 Modificar `Product.jsx` — Botón Personalizar

**Archivo**: `TierOne/TierOne/resources/js/Pages/Product.jsx`

Añadir debajo del componente `AddToCartBar`, condicionalmente:

```jsx
{producto.personalizable && (
    <a
        href={`/shop/${producto.slug}/personalizar`}
        className="flex w-full py-4 rounded-lg font-black text-sm uppercase tracking-widest items-center justify-center gap-3 transition-all bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 active:scale-[0.98] mb-4"
    >
        <span>✨</span> PERSONALIZAR ESTE PRODUCTO
    </a>
)}
```

---

## Verificación del Módulo 4

1. `npm run dev` compila sin errores
2. Navegar a `/shop/{slug-producto}/personalizar` con un producto que tenga zonas configuradas
3. El canvas muestra la imagen base con el área imprimible delimitada
4. Se puede añadir texto → aparece en el canvas, es arrastrable, no sale del área
5. Se puede subir imagen → se sube al backend, aparece en el canvas
6. El precio se actualiza en tiempo real
7. Los tabs de zonas funcionan si hay más de una zona
8. **Zonas bloqueadas**: verificar que NO aparecen en el editor del cliente
9. **Zonas baja visibilidad**: verificar que aparecen con overlay ámbar y warning
10. **Superposición**: si hay una zona bloqueada dentro de una de impresión, solo se ve la de impresión en el cliente
