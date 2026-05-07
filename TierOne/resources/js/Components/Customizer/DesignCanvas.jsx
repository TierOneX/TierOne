import { forwardRef, useImperativeHandle, useRef, useEffect, useState, useCallback } from 'react';
import * as fabric from 'fabric';
import { calculateScale } from '@/Utils/coordinateUtils';
import { imgUrl } from '@/Utils/imageUtils';

/**
 * DesignCanvas — Editor Fabric.js para personalización de producto (cliente).
 */
const DesignCanvas = forwardRef(({
    viewImage,
    activeZone,
    allViewZones,
    initialZonesData,
    onLayersUpdate,
    onZoneActivate,
}, ref) => {
    const containerRef = useRef(null);
    const canvasElRef = useRef(null);
    const fabricRef = useRef(null);
    const scaleRef = useRef(1);
    const prevZoneIdRef = useRef(null);
    const zoneObjectsRef = useRef({});
    const initDataLoadedRef = useRef({});
    
    const [layers, setLayers] = useState([]);
    const [canvasReady, setCanvasReady] = useState(false);
    const [displaySize, setDisplaySize] = useState({ w: 0, h: 0 });

    const onLayersUpdateRef = useRef(onLayersUpdate);
    const onZoneActivateRef = useRef(onZoneActivate);
    const activeZoneRef = useRef(activeZone);
    const allViewZonesRef = useRef(allViewZones);
    const initialZonesDataRef = useRef(initialZonesData);

    useEffect(() => { onLayersUpdateRef.current = onLayersUpdate; }, [onLayersUpdate]);
    useEffect(() => { onZoneActivateRef.current = onZoneActivate; }, [onZoneActivate]);
    useEffect(() => { activeZoneRef.current = activeZone; }, [activeZone]);
    useEffect(() => { allViewZonesRef.current = allViewZones; }, [allViewZones]);
    useEffect(() => { initialZonesDataRef.current = initialZonesData; }, [initialZonesData]);

    const normalizedSrc = imgUrl(viewImage);

    // ── Serialization Helpers ────────────────────────

    const serializeUserObjects = useCallback(() => {
        const canvas = fabricRef.current;
        if (!canvas) return { layers: [], userObjects: [] };
        const userObjs = canvas.getObjects().filter(o => o._isUserObject);
        const s = scaleRef.current;
        const serializedLayers = userObjs.map(o => ({
            tipo: o._customType || 'texto',
            contenido: o._customType === 'texto' ? o.text : o._customSrc,
            x: Math.round(o.left / s),
            y: Math.round(o.top / s),
            width: Math.round(o.getScaledWidth() / s),
            height: Math.round(o.getScaledHeight() / s),
            rotation: Math.round(o.angle || 0),
            fontSize: o.fontSize,
            fontFamily: o.fontFamily,
            color: o.fill,
        }));
        const serializedObjects = userObjs.map(o =>
            o.toObject(['_customType', '_customSrc', '_isUserObject'])
        );
        return { layers: serializedLayers, userObjects: serializedObjects };
    }, []);

    const saveCurrentZone = useCallback(() => {
        const zoneId = prevZoneIdRef.current;
        if (!zoneId || !fabricRef.current) return;
        const data = serializeUserObjects();
        zoneObjectsRef.current[zoneId] = data;
        onLayersUpdateRef.current?.(zoneId, data.layers);
    }, [serializeUserObjects]);

    const clearCanvas = useCallback(() => {
        const canvas = fabricRef.current;
        if (!canvas) return;
        canvas.getObjects().slice().forEach(o => {
            if (!o._isOverlay) canvas.remove(o);
        });
    }, []);

    const drawZoneOverlays = useCallback((activeZoneId) => {
        const canvas = fabricRef.current;
        const scale = scaleRef.current;
        const zones = allViewZonesRef.current;
        if (!canvas || !zones) return;

        // Limpiar overlays previos
        canvas.getObjects().filter(o => o._isOverlay).forEach(o => canvas.remove(o));

        zones.forEach(z => {
            const isActive = z.id === activeZoneId;
            const isBaja = z.tipo === 'baja_visibilidad';

            const rect = new fabric.Rect({
                left: z.area_x * scale,
                top: z.area_y * scale,
                width: z.area_width * scale,
                height: z.area_height * scale,
                fill: isBaja ? 'rgba(245,158,11,0.05)' : 'transparent',
                stroke: isActive ? 'rgba(168,85,247,0.8)' : 'rgba(168,85,247,0.2)',
                strokeDashArray: [8, 4],
                strokeWidth: isActive ? 2 : 1,
                selectable: false,
                evented: !isActive,
                hoverCursor: !isActive ? 'pointer' : 'default',
            });
            rect._isOverlay = true;
            rect._zoneId = z.id;
            canvas.add(rect);

            if (isActive || isBaja) {
                let labelText = z.nombre.toUpperCase();
                if (isBaja) labelText = '⚠️ ' + labelText;

                const label = new fabric.IText(labelText, {
                    left: z.area_x * scale + 5,
                    top: z.area_y * scale + 5,
                    fontSize: Math.max(9, Math.round(10 * scale)),
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: '900',
                    fill: isBaja ? '#f59e0b' : '#a855f7',
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    selectable: false,
                    evented: false,
                });
                label._isOverlay = true;
                canvas.add(label);
            }
        });
        canvas.renderAll();
    }, []);

    const loadZoneObjects = useCallback(async (zoneId) => {
        const canvas = fabricRef.current;
        if (!canvas || !zoneId) return;

        let data = zoneObjectsRef.current[zoneId];
        if (!data && initialZonesDataRef.current?.[zoneId] && !initDataLoadedRef.current[zoneId]) {
            data = initialZonesDataRef.current[zoneId];
            initDataLoadedRef.current[zoneId] = true;
        }
        
        if (!data?.userObjects?.length) {
            setLayers([]);
            onLayersUpdateRef.current?.(zoneId, []);
            return;
        }

        try {
            const zones = allViewZonesRef.current;
            const zone = zones?.find(z => z.id === zoneId);
            for (const objData of data.userObjects) {
                let obj;
                if (objData.type === 'i-text' || objData.type === 'IText') {
                    obj = await fabric.IText.fromObject(objData);
                } else if (objData.type === 'image' || objData.type === 'Image') {
                    obj = await fabric.FabricImage.fromObject(objData);
                } else {
                    const klass = fabric.classRegistry?.getClass(objData.type);
                    if (klass) obj = await klass.fromObject(objData);
                }
                if (obj) {
                    obj._isUserObject = true;
                    obj._customType = objData._customType;
                    obj._customSrc = objData._customSrc;
                    if (zone) {
                        obj.clipPath = new fabric.Rect({
                            left: zone.area_x * scaleRef.current,
                            top: zone.area_y * scaleRef.current,
                            width: zone.area_width * scaleRef.current,
                            height: zone.area_height * scaleRef.current,
                            absolutePositioned: true,
                        });
                    }
                    canvas.add(obj);
                }
            }
            canvas.renderAll();
            setLayers(data.layers || []);
            onLayersUpdateRef.current?.(zoneId, data.layers || []);
        } catch (err) {
            console.error('Error loading zone objects:', err);
        }
    }, []);

    // ── Init Effect ──────────────────────────────────

    useEffect(() => {
        if (!normalizedSrc || !canvasElRef.current) {
            console.log('DesignCanvas: Missing normalizedSrc or canvasElRef', { normalizedSrc, hasRef: !!canvasElRef.current });
            return;
        }

        let isMounted = true;
        console.log('DesignCanvas: Starting initialization for', normalizedSrc);

        const imgEl = new Image();
        imgEl.crossOrigin = 'anonymous';

        imgEl.onload = async () => {
            if (!isMounted) return;
            try {
                console.log('DesignCanvas: Image loaded successfully', { w: imgEl.width, h: imgEl.height });
                const containerWidth = containerRef.current?.offsetWidth || 700;
                const maxW = Math.min(containerWidth, 700);
                const maxH = 550;

                const { scale, displayWidth, displayHeight } = calculateScale(
                    imgEl.width, imgEl.height, maxW, maxH
                );

                if (isNaN(scale) || displayWidth <= 0 || displayHeight <= 0) {
                    console.error('DesignCanvas: Invalid dimensions calculated', { scale, displayWidth, displayHeight });
                    setCanvasReady(true);
                    return;
                }

                scaleRef.current = scale;
                setDisplaySize({ w: displayWidth, h: displayHeight });

                console.log('DesignCanvas: Creating new Fabric canvas', { displayWidth, displayHeight });
                const canvas = new fabric.Canvas(canvasElRef.current, {
                    width: displayWidth,
                    height: displayHeight,
                    backgroundColor: '#111',
                    selection: true,
                    preserveObjectStacking: true,
                });
                fabricRef.current = canvas;

                // Cargar imagen de fondo en Fabric
                const background = await fabric.FabricImage.fromURL(normalizedSrc, { crossOrigin: 'anonymous' });
                background.set({
                    scaleX: scale,
                    scaleY: scale,
                    originX: 'left',
                    originY: 'top',
                    selectable: false,
                    evented: false
                });
                canvas.backgroundImage = background;
                canvas.renderAll();
                
                if (isMounted) setCanvasReady(true);

                // Eventos
                canvas.on('mouse:down', (e) => {
                    if (e.target?._zoneId && onZoneActivateRef.current) {
                        onZoneActivateRef.current(e.target._zoneId);
                    }
                });

                const updateLayers = () => {
                    const c = fabricRef.current;
                    if (!c) return;
                    const userObjs = c.getObjects().filter(o => o._isUserObject);
                    const s = scaleRef.current;
                    const newLayers = userObjs.map(o => ({
                        tipo: o._customType || 'texto',
                        contenido: o._customType === 'texto' ? o.text : o._customSrc,
                        x: Math.round(o.left / s),
                        y: Math.round(o.top / s),
                        width: Math.round(o.getScaledWidth() / s),
                        height: Math.round(o.getScaledHeight() / s),
                        rotation: Math.round(o.angle || 0),
                        fontSize: o.fontSize,
                        fontFamily: o.fontFamily,
                        color: o.fill,
                    }));
                    setLayers(newLayers);
                    if (prevZoneIdRef.current) {
                        onLayersUpdateRef.current?.(prevZoneIdRef.current, newLayers);
                    }
                };
                canvas.on('object:modified', updateLayers);
                canvas.on('object:added', () => {
                    // Evitar bucles durante la carga inicial
                    if (canvasReady) setTimeout(updateLayers, 50);
                });
                canvas.on('object:removed', updateLayers);
            } catch (err) {
                console.error('DesignCanvas: Error during initialization', err);
            }
        };

        imgEl.onerror = (e) => {
            if (!isMounted) return;
            console.error('DesignCanvas: Image failed to load', normalizedSrc, e);
            setCanvasReady(true);
        };

        imgEl.src = normalizedSrc;

        return () => {
            isMounted = false;
            if (fabricRef.current) {
                fabricRef.current.dispose();
                fabricRef.current = null;
            }
        };
    }, [normalizedSrc]);

    // ── Zone Switch Effect ───────────────────────────

    useEffect(() => {
        if (!canvasReady || !activeZone || !fabricRef.current) return;

        if (prevZoneIdRef.current !== activeZone.id) {
            if (prevZoneIdRef.current !== null) {
                saveCurrentZone();
                clearCanvas();
            }
            drawZoneOverlays(activeZone.id);
            loadZoneObjects(activeZone.id);
            prevZoneIdRef.current = activeZone.id;
        }
    }, [canvasReady, activeZone?.id, saveCurrentZone, clearCanvas, drawZoneOverlays, loadZoneObjects]);

    // ── Imperative Handle ────────────────────────────

    useImperativeHandle(ref, () => ({
        addText: ({ content, fontSize, fontFamily, color }) => {
            const canvas = fabricRef.current;
            const zone = activeZoneRef.current;
            const s = scaleRef.current;
            if (!canvas || !zone) return;
            const text = new fabric.IText(content || 'Tu texto', {
                left: zone.area_x * s + 20,
                top: zone.area_y * s + 20,
                fontSize: (fontSize || 28) * s,
                fontFamily: fontFamily || 'Arial',
                fill: color || '#ffffff',
                editable: true,
                clipPath: new fabric.Rect({
                    left: zone.area_x * s,
                    top: zone.area_y * s,
                    width: zone.area_width * s,
                    height: zone.area_height * s,
                    absolutePositioned: true,
                }),
            });
            text._isUserObject = true;
            text._customType = 'texto';
            canvas.add(text);
            canvas.setActiveObject(text);
        },
        addImage: (url) => {
            const canvas = fabricRef.current;
            const zone = activeZoneRef.current;
            const s = scaleRef.current;
            if (!canvas || !zone) return;
            fabric.FabricImage.fromURL(url, { crossOrigin: 'anonymous' }).then((img) => {
                if (!img) {
                    console.error('DesignCanvas: Failed to create FabricImage from URL', url);
                    return;
                }
                const maxW = zone.area_width * s * 0.8;
                const imgScale = maxW / (img.width || 1);
                img.set({
                    left: zone.area_x * s + 10,
                    top: zone.area_y * s + 10,
                    scaleX: imgScale,
                    scaleY: imgScale,
                    clipPath: new fabric.Rect({
                        left: zone.area_x * s,
                        top: zone.area_y * s,
                        width: zone.area_width * s,
                        height: zone.area_height * s,
                        absolutePositioned: true,
                    }),
                });
                img._isUserObject = true;
                img._customType = 'imagen';
                img._customSrc = url;
                canvas.add(img);
                canvas.setActiveObject(img);
            });
        },
        exportAllData: () => { saveCurrentZone(); return { ...zoneObjectsRef.current }; },
        exportViewPNG: () => {
            const canvas = fabricRef.current;
            if (!canvas) return null;
            return canvas.toDataURL({ format: 'png', multiplier: 1 / scaleRef.current });
        }
    }));

    try {
        const hasValidSize = displaySize.w > 0 && displaySize.h > 0;

        return (
            <div ref={containerRef} className="w-full flex justify-center">
                <div
                    className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-[#111]"
                    style={hasValidSize ? { width: displaySize.w, height: displaySize.h } : { width: '100%', minHeight: 400 }}
                >
                    <canvas ref={canvasElRef} className="absolute inset-0" />
                    {!canvasReady && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                        </div>
                    )}
                </div>
            </div>
        );
    } catch (renderError) {
        console.error('DesignCanvas: Fatal Render Error', renderError);
        return <div className="p-4 bg-red-900/20 text-red-500 rounded-xl">Error al cargar el lienzo de diseño</div>;
    }
});

DesignCanvas.displayName = 'DesignCanvas';
export default DesignCanvas;
