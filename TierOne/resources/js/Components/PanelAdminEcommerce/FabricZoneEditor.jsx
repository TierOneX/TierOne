import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as fabric from 'fabric';
import { calculateScale, toAbsCoords } from '@/Utils/coordinateUtils';
import { imgUrl } from '@/Utils/imageUtils';
import {
    Trash2, MousePointer2, Square,
    Lock, AlertTriangle, Type,
} from 'lucide-react';

const ZONE_COLORS = {
    impresion:        { fill: 'rgba(168, 85, 247, 0.2)',  stroke: '#a855f7', label: 'Impresión' },
    bloqueada:        { fill: 'rgba(239, 68, 68, 0.2)',   stroke: '#ef4444', label: 'Bloqueada' },
    baja_visibilidad: { fill: 'rgba(245, 158, 11, 0.2)',  stroke: '#f59e0b', label: 'Advertencia' },
};

export default function FabricZoneEditor({ imageSrc, zones = [], onZonesChange }) {
    const outerRef    = useRef(null);
    const stageRef    = useRef(null);
    const imgRef      = useRef(null);
    const canvasRef   = useRef(null);
    const fabricRef   = useRef(null);
    const scaleRef    = useRef(1);
    const imgDimsRef  = useRef({ w: 0, h: 0 });
    const onChangeRef = useRef(onZonesChange);

    const [selectedId,  setSelectedId]  = useState(null);
    const [imgNatural,  setImgNatural]  = useState({ w: 0, h: 0 });
    const [stageSize,   setStageSize]   = useState({ w: 0, h: 0 });

    useEffect(() => { onChangeRef.current = onZonesChange; }, [onZonesChange]);

    const imageUrl = imgUrl(imageSrc);

    // ── BUG 1 FIX: syncData ──────────────────────────────────────────────────
    const syncData = useCallback(() => {
        const canvas = fabricRef.current;
        if (!canvas) return;
        const scale = scaleRef.current;
        const dims  = imgDimsRef.current;

        const updatedZones = canvas.getObjects()
            .filter(o => o._id)
            .map(o => {
                const abs = toAbsCoords({
                    x:      o.left,
                    y:      o.top,
                    width:  o.width * o.scaleX,
                    height: o.height * o.scaleY,
                }, scale);
                return {
                    id:            (typeof o._id === 'string' && o._id.startsWith('temp_')) ? null : o._id,
                    temp_id:       o._id,
                    nombre:        o._nombre || 'Nueva Zona',
                    tipo:          o._tipo   || 'impresion',
                    area_x:        abs.x,
                    area_y:        abs.y,
                    area_width:    abs.width,
                    area_height:   abs.height,
                    canvas_width:  dims.w,
                    canvas_height: dims.h,
                };
            });

        onChangeRef.current(updatedZones);
    }, []);

    // ── BUG 2 FIX: useEffect depende de imageUrl Y de zones ─────────────────
    const zonesRef = useRef(zones);
    useEffect(() => { zonesRef.current = zones; }, [zones]);

    // Clave que fuerza reinit solo cuando cambia imageUrl o las dims del canvas
    const canvasDimsKey = zones.length > 0 && zones[0].canvas_width
        ? `${zones[0].canvas_width}x${zones[0].canvas_height}`
        : 'natural';

    useEffect(() => {
        if (!imageUrl || !canvasRef.current || !outerRef.current) return;

        const containerWidth = outerRef.current.offsetWidth || 800;
        const maxWidth  = Math.min(containerWidth, 900);
        const maxHeight = 600;

        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            const currentZones = zonesRef.current;

            const canvasDims = currentZones.length > 0 && currentZones[0].canvas_width && currentZones[0].canvas_height
                ? { w: currentZones[0].canvas_width, h: currentZones[0].canvas_height }
                : { w: img.width, h: img.height };

            const { scale, displayWidth, displayHeight } = calculateScale(
                canvasDims.w, canvasDims.h, maxWidth, maxHeight
            );

            scaleRef.current   = scale;
            imgDimsRef.current = canvasDims;
            setImgNatural({ w: canvasDims.w, h: canvasDims.h });
            setStageSize({ w: displayWidth, h: displayHeight });

            if (imgRef.current) {
                imgRef.current.style.width  = `${displayWidth}px`;
                imgRef.current.style.height = `${displayHeight}px`;
                imgRef.current.style.display = 'block';
            }

            if (fabricRef.current) {
                fabricRef.current.dispose();
                fabricRef.current = null;
            }

            const canvas = new fabric.Canvas(canvasRef.current, {
                backgroundColor:        'transparent',
                selection:               true,
                preserveObjectStacking:  true,
                width:                   displayWidth,
                height:                  displayHeight,
            });
            fabricRef.current = canvas;

            const wrapper = canvas.wrapperEl || canvas.lowerCanvasEl?.parentElement;
            if (wrapper && stageRef.current) {
                wrapper.style.position = 'absolute';
                wrapper.style.top      = '0';
                wrapper.style.left     = '0';
                wrapper.style.width    = `${displayWidth}px`;
                wrapper.style.height   = `${displayHeight}px`;
            }

            canvas.on('object:modified', syncData);
            canvas.on('object:removed',  syncData);
            canvas.on('selection:created', e => setSelectedId(e.selected[0]?._id));
            canvas.on('selection:updated', e => setSelectedId(e.selected[0]?._id));
            canvas.on('selection:cleared',  () => setSelectedId(null));

            // Cargar zonas existentes
            currentZones.forEach(z => {
                const cfg = ZONE_COLORS[z.tipo] || ZONE_COLORS.impresion;
                const zoneScale = (z.canvas_width && z.canvas_height)
                    ? calculateScale(z.canvas_width, z.canvas_height, maxWidth, maxHeight).scale
                    : scale;

                canvas.add(new fabric.Rect({
                    left:   z.area_x      * zoneScale,
                    top:    z.area_y      * zoneScale,
                    width:  z.area_width  * zoneScale,
                    height: z.area_height * zoneScale,
                    scaleX: 1,
                    scaleY: 1,
                    fill:              cfg.fill,
                    stroke:            cfg.stroke,
                    strokeWidth:       2,
                    strokeUniform:     true,
                    strokeAlign:       'inside',
                    originX:           'left',
                    originY:           'top',
                    cornerColor:       '#fff',
                    cornerStrokeColor: cfg.stroke,
                    cornerSize:        8,
                    transparentCorners: false,
                    _id:     z.id || `temp_${Math.random().toString(36).substr(2, 9)}`,
                    _tipo:   z.tipo,
                    _nombre: z.nombre,
                }));
            });
            canvas.renderAll();

            requestAnimationFrame(() => {
                if (fabricRef.current) fabricRef.current.calcOffset();
            });
        };
        img.src = imageUrl;

        return () => {
            if (fabricRef.current) {
                fabricRef.current.dispose();
                fabricRef.current = null;
            }
        };
    }, [imageUrl]);

    const addZone = (type) => {
        const canvas = fabricRef.current;
        if (!canvas) return;
        const cfg = ZONE_COLORS[type];
        const rect = new fabric.Rect({
            left:   50, top: 50,
            width:  150, height: 150,
            scaleX: 1,
            scaleY: 1,
            fill:             cfg.fill,
            stroke:           cfg.stroke,
            strokeWidth:      2,
            strokeUniform:    true,
            strokeAlign:      'inside',
            originX:          'left',
            originY:          'top',
            cornerColor:      '#fff',
            cornerSize:        8,
            transparentCorners: false,
            _id:     `temp_${Date.now()}`,
            _tipo:   type,
            _nombre: `Zona ${cfg.label}`,
        });
        canvas.add(rect);
        canvas.setActiveObject(rect);
        syncData();
    };

    const deleteSelected = () => {
        const canvas = fabricRef.current;
        const active = canvas?.getActiveObject();
        if (active) {
            canvas.remove(active);
            canvas.discardActiveObject();
            canvas.renderAll();
            syncData();
        }
    };

    const changeType = (newType) => {
        const canvas = fabricRef.current;
        const active = canvas?.getActiveObject();
        if (active) {
            const cfg = ZONE_COLORS[newType];
            active.set({ fill: cfg.fill, stroke: cfg.stroke, _tipo: newType, _nombre: `Zona ${cfg.label}` });
            canvas.renderAll();
            syncData();
        }
    };

    return (
        <div className="flex flex-col gap-6" ref={outerRef}>
            <div className="flex flex-wrap gap-2 p-3 bg-gray-800 rounded-xl border border-gray-700 shadow-xl">
                <button onClick={() => addZone('impresion')}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600/20 text-purple-400 border border-purple-500/30 rounded-lg hover:bg-purple-600/30 transition-all text-[10px] font-black uppercase tracking-widest">
                    <Type size={14} /> + Área Impresión
                </button>
                <button onClick={() => addZone('bloqueada')}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-600/30 transition-all text-[10px] font-black uppercase tracking-widest">
                    <Lock size={14} /> + Área Bloqueada
                </button>
                <button onClick={() => addZone('baja_visibilidad')}
                    className="flex items-center gap-2 px-4 py-2 bg-amber-600/20 text-amber-400 border border-amber-500/30 rounded-lg hover:bg-amber-600/30 transition-all text-[10px] font-black uppercase tracking-widest">
                    <AlertTriangle size={14} /> + Advertencia
                </button>
                <div className="w-px h-8 bg-gray-700 mx-2 self-center" />
                <button onClick={deleteSelected} disabled={!selectedId}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-[10px] font-black uppercase tracking-widest
                        ${selectedId ? 'bg-gray-700 text-white hover:bg-red-600/50' : 'bg-gray-800 text-gray-600 cursor-not-allowed'}`}>
                    <Trash2 size={14} /> Eliminar Seleccionada
                </button>
            </div>

            <div className="w-full flex justify-center bg-[#0a0a0a] p-4 rounded-2xl border border-gray-800">
                <div
                    className="relative rounded-2xl overflow-hidden shadow-2xl bg-[#111]"
                    ref={stageRef}
                    style={stageSize.w > 0 ? {
                        width: stageSize.w,
                        height: stageSize.h,
                    } : {
                        width: '100%',
                        minHeight: 500
                    }}
                >
                    {imageUrl && (
                        <img
                            ref={imgRef}
                            src={imageUrl}
                            alt="Base"
                            style={{
                                display:        'block',
                                position:       'absolute',
                                top:            0,
                                left:           0,
                                width:          stageSize.w,
                                height:         stageSize.h,
                                objectFit:      'fill',
                                pointerEvents:  'none',
                                userSelect:     'none',
                            }}
                        />
                    )}

                    <canvas ref={canvasRef} />

                    {selectedId && (
                        <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 20 }}
                            className="animate-in slide-in-from-right duration-200">
                            <div className="bg-gray-900/90 backdrop-blur-md p-3 rounded-xl border border-gray-700 shadow-2xl flex flex-col gap-2">
                                <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Convertir a:</p>
                                <button onClick={() => changeType('impresion')}        className="w-8 h-8 rounded-lg bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center hover:bg-purple-600 transition-colors" title="Impresión"><Type size={14}/></button>
                                <button onClick={() => changeType('bloqueada')}        className="w-8 h-8 rounded-lg bg-red-600/20    text-red-400    border border-red-500/30    flex items-center justify-center hover:bg-red-600    transition-colors" title="Bloqueada"><Lock size={14}/></button>
                                <button onClick={() => changeType('baja_visibilidad')} className="w-8 h-8 rounded-lg bg-amber-600/20 text-amber-400 border border-amber-500/30 flex items-center justify-center hover:bg-amber-600 transition-colors" title="Advertencia"><AlertTriangle size={14}/></button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex justify-between items-center text-[10px] text-gray-500 font-bold uppercase tracking-widest px-2">
                <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1"><MousePointer2 size={12}/> Click para seleccionar</span>
                    <span className="flex items-center gap-1"><Square size={12}/> Arrastra para mover/redimensionar</span>
                </div>
                <span>Resolución Original: {imgNatural.w}x{imgNatural.h}px</span>
            </div>
        </div>
    );
}
