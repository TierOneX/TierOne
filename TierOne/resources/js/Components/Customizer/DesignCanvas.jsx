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
        fabric.FabricImage.fromURL(zona.imagen_base, { crossOrigin: 'anonymous' }).then((img) => {
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
        // Guardar referencia para aplicarlo a nuevos objetos
        canvas._clipRect = clipRect;

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
            const bound = obj.getBoundingRect(true);
            const areaLeft = zona.area_x;
            const areaTop = zona.area_y;
            const areaRight = zona.area_x + zona.area_width;
            const areaBottom = zona.area_y + zona.area_height;

            let newLeft = obj.left;
            let newTop = obj.top;
            const dLeft = obj.left - bound.left;
            const dTop = obj.top - bound.top;

            if (bound.left < areaLeft) newLeft = areaLeft + dLeft;
            if (bound.top < areaTop) newTop = areaTop + dTop;
            if (bound.left + bound.width > areaRight) newLeft = areaRight - bound.width + dLeft;
            if (bound.top + bound.height > areaBottom) newTop = areaBottom - bound.height + dTop;

            obj.set({ left: newLeft, top: newTop });
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
                clipPath: canvas._clipRect,
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
                const maxW = zona.area_width * 0.6;
                const maxH = zona.area_height * 0.6;
                const naturalW = img.width || 100;
                const naturalH = img.height || 100;
                const scale = Math.min(maxW / naturalW, maxH / naturalH, 1);
                img.set({
                    left: zona.area_x + 20,
                    top: zona.area_y + 20,
                    scaleX: scale,
                    scaleY: scale,
                    clipPath: canvas._clipRect,
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
