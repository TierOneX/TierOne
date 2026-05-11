import { forwardRef, useImperativeHandle, useRef, useEffect, useState, useCallback } from 'react';
import * as fabric from 'fabric';
import { calculateScale } from '@/Utils/coordinateUtils';
import { imgUrl } from '@/Utils/imageUtils';

/**
 * DesignCanvas — Editor Fabric.js para personalización de producto (cliente).
 * Versión Blindada: Usa imagen de fondo real + canvas transparente (Estilo Admin).
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
    const imgRef = useRef(null);
    
    const scaleRef    = useRef(1);
    const imgDimsRef  = useRef({ w: 0, h: 0 });
    const prevZoneIdRef = useRef(null);
    const zoneObjectsRef = useRef({});
    const initDataLoadedRef = useRef({});
    
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

    // ── Escala por zona con máxima precisión ────────────────────────
    const getZoneScale = useCallback((zone) => {
        const canvas = fabricRef.current;
        if (!canvas || !zone) return scaleRef.current;
        const refW = zone.canvas_width || imgDimsRef.current.w || 1000;
        const s = canvas.width / refW;
        return s;
    }, []);

    const serializeUserObjects = useCallback(() => {
        const canvas = fabricRef.current;
        const zone = activeZoneRef.current;
        if (!canvas || !zone) return { layers: [], userObjects: [] };
        
        const userObjs = canvas.getObjects().filter(o => o._isUserObject);
        const s = getZoneScale(zone);

        const serializedLayers = userObjs.map(o => ({
            tipo: o._customType || 'texto',
            contenido: o._customType === 'texto' ? o.text : o._customSrc,
            x: Math.round(o.left / s),
            y: Math.round(o.top / s),
            width: Math.round((o.width * o.scaleX) / s),
            height: Math.round((o.height * o.scaleY) / s),
            rotation: Math.round(o.angle || 0),
            fontSize: o.fontSize,
            fontFamily: o.fontFamily,
            color: o.fill,
        }));
        
        const serializedObjects = userObjs.map(o =>
            o.toObject(['_customType', '_customSrc', '_isUserObject'])
        );
        
        return { layers: serializedLayers, userObjects: serializedObjects };
    }, [getZoneScale]);

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
        const zones = allViewZonesRef.current;
        if (!canvas || !zones) return;

        canvas.getObjects().filter(o => o._isOverlay).forEach(o => canvas.remove(o));

        zones.forEach(z => {
            const isActive = z.id === activeZoneId;
            const isBaja = z.tipo === 'baja_visibilidad';
            const s = getZoneScale(z);

            const rect = new fabric.Rect({
                left: z.area_x * s,
                top: z.area_y * s,
                width: z.area_width * s,
                height: z.area_height * s,
                fill: isBaja ? 'rgba(245,158,11,0.05)' : 'transparent',
                stroke: isActive ? 'rgba(168,85,247,0.8)' : 'rgba(168,85,247,0.2)',
                strokeDashArray: [8, 4],
                strokeWidth: isActive ? 2 : 1,
                strokeUniform: true,
                selectable: false,
                evented: !isActive,
                hoverCursor: !isActive ? 'pointer' : 'default',
                originX: 'left',
                originY: 'top'
            });
            rect._isOverlay = true;
            rect._zoneId = z.id;
            canvas.add(rect);

            if (isActive || isBaja) {
                const label = new fabric.IText(z.nombre.toUpperCase(), {
                    left: z.area_x * s + 5,
                    top: z.area_y * s + 5,
                    fontSize: Math.max(9, Math.round(10 * s)),
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: '900',
                    fill: isBaja ? '#f59e0b' : '#a855f7',
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    selectable: false,
                    evented: false,
                    originX: 'left',
                    originY: 'top'
                });
                label._isOverlay = true;
                canvas.add(label);
            }
        });
        canvas.renderAll();
    }, [getZoneScale]);

    const loadZoneObjects = useCallback(async (zoneId) => {
        const canvas = fabricRef.current;
        if (!canvas || !zoneId) return;

        let data = zoneObjectsRef.current[zoneId];
        if (!data && initialZonesDataRef.current?.[zoneId] && !initDataLoadedRef.current[zoneId]) {
            data = initialZonesDataRef.current[zoneId];
            initDataLoadedRef.current[zoneId] = true;
        }
        
        if (!data?.userObjects?.length) return;

        try {
            const zones = allViewZonesRef.current;
            const zone = zones?.find(z => z.id === zoneId);
            const s = getZoneScale(zone);

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
                
                if (obj && zone) {
                    obj._isUserObject = true;
                    obj._customType = objData._customType;
                    obj._customSrc = objData._customSrc;

                    // ─── FIX: fromObject() already restores left/top/scaleX/scaleY
                    // in display (scaled) pixels. Do NOT re-multiply by s.
                    // We only re-attach the clipPath using the same display coords.
                    obj.clipPath = new fabric.Rect({
                        left: zone.area_x * s,
                        top: zone.area_y * s,
                        width: zone.area_width * s,
                        height: zone.area_height * s,
                        strokeWidth: 0,
                        originX: 'left',
                        originY: 'top',
                        absolutePositioned: true,
                    });

                    // Apply TierOne red palette to controls
                    obj.set({
                        cornerColor: '#e31837',
                        cornerStyle: 'circle',
                        cornerSize: 10,
                        transparentCorners: false,
                        borderColor: '#e31837',
                        borderDashArray: [4, 4],
                        padding: 5,
                    });

                    canvas.add(obj);
                }
            }
            canvas.renderAll();
        } catch (err) {
            console.error('Error loading zone objects:', err);
        }
    }, [getZoneScale]);


    // ── Init Effect ──────────────────────────────────
    useEffect(() => {
        if (!normalizedSrc || !canvasElRef.current) return;

        let isMounted = true;
        const img = new Image();
        img.crossOrigin = 'anonymous';

        img.onload = () => {
            if (!isMounted) return;
            try {
                const containerWidth = containerRef.current?.offsetWidth || 700;
                const maxWidth = Math.min(containerWidth, 700);
                const maxHeight = 550;

                const { scale, displayWidth, displayHeight } = calculateScale(
                    img.width, img.height, maxWidth, maxHeight
                );

                scaleRef.current = scale;
                imgDimsRef.current = { w: img.width, h: img.height };
                setDisplaySize({ w: displayWidth, h: displayHeight });

                if (fabricRef.current) {
                    fabricRef.current.dispose();
                }

                const canvas = new fabric.Canvas(canvasElRef.current, {
                    width: displayWidth,
                    height: displayHeight,
                    backgroundColor: 'transparent', 
                    selection: true,
                    preserveObjectStacking: true,
                });
                fabricRef.current = canvas;

                // Cargar imagen de fondo para exportación futura
                fabric.FabricImage.fromURL(normalizedSrc, { crossOrigin: 'anonymous' }).then(img => {
                    img.set({
                        scaleX: scale,
                        scaleY: scale,
                        originX: 'left',
                        originY: 'top',
                        selectable: false,
                        evented: false
                    });
                    imgDimsRef.current.bgObj = img;
                });

                if (imgRef.current) {
                    imgRef.current.style.width = `${displayWidth}px`;
                    imgRef.current.style.height = `${displayHeight}px`;
                    imgRef.current.style.display = 'block';
                }
                
                setCanvasReady(true);

                const updateLayers = () => {
                    const c = fabricRef.current;
                    const z = activeZoneRef.current;
                    if (!c || !z) return;
                    const data = serializeUserObjects();
                    if (prevZoneIdRef.current) {
                        onLayersUpdateRef.current?.(prevZoneIdRef.current, data.layers);
                    }
                };
                
                canvas.on('object:modified', updateLayers);
                canvas.on('object:added', () => {
                    setTimeout(() => { if (fabricRef.current) updateLayers(); }, 50);
                });
                canvas.on('object:removed', updateLayers);
            } catch (err) {
                console.error('DesignCanvas: Error during initialization', err);
            }
        };
        img.src = normalizedSrc;

        return () => {
            isMounted = false;
            if (fabricRef.current) {
                fabricRef.current.dispose();
                fabricRef.current = null;
                setCanvasReady(false);
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
            if (!canvas || !zone) return;
            
            const s = getZoneScale(zone);
            const text = new fabric.IText(content || 'Tu texto', {
                left: zone.area_x * s + 20,
                top: zone.area_y * s + 20,
                fontSize: (fontSize || 28) * s,
                fontFamily: fontFamily || 'Outfit',
                fill: color || '#ffffff',
                editable: true,
                originX: 'left',
                originY: 'top',
                clipPath: new fabric.Rect({
                    left: zone.area_x * s,
                    top: zone.area_y * s,
                    width: zone.area_width * s,
                    height: zone.area_height * s,
                    strokeWidth: 0,
                    originX: 'left',
                    originY: 'top',
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
            if (!canvas || !zone) {
                console.warn('DesignCanvas: No hay zona activa para añadir imagen');
                return;
            }
            
            const s = getZoneScale(zone);
            const fullUrl = imgUrl(url);

            fabric.FabricImage.fromURL(fullUrl, { crossOrigin: 'anonymous' })
                .then((img) => {
                    if (!img) {
                        console.error('DesignCanvas: Error al crear objeto de imagen');
                        return;
                    }

                    // 1. Cálculo de escala óptima para que quepa en el 80% de la zona
                    const padding = 0.8;
                    const targetW = zone.area_width * s * padding;
                    const targetH = zone.area_height * s * padding;
                    
                    const scaleX = targetW / img.width;
                    const scaleY = targetH / img.height;
                    const finalScale = Math.min(scaleX, scaleY, 1); // No agrandar si ya cabe

                    // 2. Cálculo de centro de la zona para posicionar
                    const centerX = (zone.area_x * s) + (zone.area_width * s) / 2;
                    const centerY = (zone.area_y * s) + (zone.area_height * s) / 2;

                    img.set({
                        left: centerX,
                        top: centerY,
                        scaleX: finalScale,
                        scaleY: finalScale,
                        originX: 'center',
                        originY: 'center',
                        
                        // Estética Premium para los controles
                        cornerColor: '#a855f7',
                        cornerStyle: 'circle',
                        cornerSize: 10,
                        transparentCorners: false,
                        borderColor: '#a855f7',
                        borderDashArray: [4, 4],
                        padding: 5,

                        clipPath: new fabric.Rect({
                            left: zone.area_x * s,
                            top: zone.area_y * s,
                            width: zone.area_width * s,
                            height: zone.area_height * s,
                            strokeWidth: 0,
                            originX: 'left',
                            originY: 'top',
                            absolutePositioned: true,
                        }),
                    });

                    img._isUserObject = true;
                    img._customType = 'imagen';
                    img._customSrc = url;

                    canvas.add(img);
                    canvas.setActiveObject(img);
                    canvas.renderAll();
                })
                .catch(err => {
                    console.error('DesignCanvas: Error cargando imagen en Fabric.js', err);
                    alert("Error visual al cargar la imagen. Inténtalo de nuevo.");
                });
        },
        exportAllData: () => { saveCurrentZone(); return { ...zoneObjectsRef.current }; },
        exportViewPNG: () => {
            const canvas = fabricRef.current;
            if (!canvas || !imgDimsRef.current.bgObj) return null;
            
            // Metemos el fondo temporalmente para la foto
            canvas.backgroundImage = imgDimsRef.current.bgObj;
            const data = canvas.toDataURL({ 
                format: 'png', 
                multiplier: 1 / scaleRef.current 
            });
            canvas.backgroundImage = null;
            canvas.renderAll();
            
            return data;
        },
        selectLayer: (index) => {
            const canvas = fabricRef.current;
            if (!canvas) return;
            const userObjs = canvas.getObjects().filter(o => o._isUserObject);
            const target = userObjs[index];
            if (target) {
                canvas.setActiveObject(target);
                canvas.renderAll();
            }
        },
        deleteLayer: (index) => {
            const canvas = fabricRef.current;
            if (!canvas) return;
            const userObjs = canvas.getObjects().filter(o => o._isUserObject);
            const target = userObjs[index];
            if (target) {
                canvas.remove(target);
                canvas.renderAll();
            }
        }
    }));

    const hasValidSize = displaySize.w > 0 && displaySize.h > 0;

    return (
        <div ref={containerRef} className="w-full flex justify-center">
            <div
                className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-[#111]"
                style={hasValidSize ? { width: displaySize.w, height: displaySize.h } : { width: '100%', minHeight: 400 }}
            >
                <img 
                    ref={imgRef}
                    src={normalizedSrc} 
                    alt="Background"
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        display: 'none',
                        objectFit: 'fill',
                        pointerEvents: 'none'
                    }}
                />
                <canvas ref={canvasElRef} className="absolute inset-0" />
                {!canvasReady && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    </div>
                )}
            </div>
        </div>
    );
});

DesignCanvas.displayName = 'DesignCanvas';
export default DesignCanvas;
