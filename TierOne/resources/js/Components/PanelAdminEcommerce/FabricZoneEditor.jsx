import React, { useEffect, useRef, useState } from 'react';
import * as fabric from 'fabric';
import { 
    Trash2, MousePointer2, Square, 
    Lock, AlertTriangle, Type,
    ChevronUp, ChevronDown
} from 'lucide-react';

const ZONE_COLORS = {
    impresion:        { fill: 'rgba(168, 85, 247, 0.2)',  stroke: '#a855f7', label: 'Impresión' },
    bloqueada:        { fill: 'rgba(239, 68, 68, 0.2)',   stroke: '#ef4444', label: 'Bloqueada' },
    baja_visibilidad: { fill: 'rgba(245, 158, 11, 0.2)',  stroke: '#f59e0b', label: 'Advertencia' },
};

export default function FabricZoneEditor({ imageSrc, zones = [], onZonesChange }) {
    const containerRef = useRef(null);
    const canvasRef = useRef(null);
    const fabricCanvasRef = useRef(null);
    const [selectedId, setSelectedId] = useState(null);
    const [imgDimensions, setImgDimensions] = useState({ w: 0, h: 0 });
    const [canvasScale, setCanvasScale] = useState(1);

    // Normalizador de URL (mejorado)
    const normalizedUrl = (src) => {
        if (!src) return null;
        if (src.startsWith('data:')) return src;
        let path = src.startsWith('http') || src.startsWith('/') ? src : `/${src}`;
        path = path.replace(/\/+/g, '/').replace(':/', '://');
        if (!path.startsWith('http') && !path.startsWith('/storage') && !path.startsWith('/assets')) {
            path = '/storage' + (path.startsWith('/') ? '' : '/') + path;
        }
        return path;
    };

    const imageUrl = normalizedUrl(imageSrc);

    // 1. Inicializar Canvas
    useEffect(() => {
        const canvas = new fabric.Canvas(canvasRef.current, {
            backgroundColor: 'transparent',
            selection: true,
            preserveObjectStacking: true
        });
        fabricCanvasRef.current = canvas;

        // Manejo de eventos
        const syncData = () => {
            const objs = canvas.getObjects().filter(o => o._id);
            const updatedZones = objs.map(o => ({
                id: o._id.startsWith('temp_') ? null : o._id,
                temp_id: o._id,
                nombre: o._nombre || 'Nueva Zona',
                tipo: o._tipo || 'impresion',
                area_x: Math.round(o.left / canvasScale),
                area_y: Math.round(o.top / canvasScale),
                area_width: Math.round(o.width * o.scaleX / canvasScale),
                area_height: Math.round(o.height * o.scaleY / canvasScale),
                canvas_width: imgDimensions.w,
                canvas_height: imgDimensions.h
            }));
            onZonesChange(updatedZones);
        };

        canvas.on('object:modified', syncData);
        canvas.on('object:added', syncData);
        canvas.on('object:removed', syncData);
        canvas.on('selection:created', (e) => setSelectedId(e.selected[0]?._id));
        canvas.on('selection:updated', (e) => setSelectedId(e.selected[0]?._id));
        canvas.on('selection:cleared', () => setSelectedId(null));

        return () => {
            canvas.dispose();
        };
    }, [imgDimensions, canvasScale]);

    // 2. Cargar Imagen Base y Ajustar Canvas
    useEffect(() => {
        if (!imageUrl) return;
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            const containerWidth = containerRef.current?.offsetWidth || 800;
            const maxWidth = Math.min(containerWidth, 1000);
            const maxHeight = 600;
            
            const scale = Math.min(maxWidth / img.width, maxHeight / img.height, 1);
            setImgDimensions({ w: img.width, h: img.height });
            setCanvasScale(scale);
            
            if (fabricCanvasRef.current) {
                fabricCanvasRef.current.setDimensions({
                    width: img.width * scale,
                    height: img.height * scale
                });
                
                // Cargar zonas iniciales una vez tenemos la escala
                loadZones(zones, scale, img.width, img.height);
            }
        };
        img.src = imageUrl;
    }, [imageUrl]);

    const loadZones = (initialZones, scale, canvasW, canvasH) => {
        const canvas = fabricCanvasRef.current;
        if (!canvas) return;
        
        canvas.getObjects().forEach(obj => canvas.remove(obj));
        
        initialZones.forEach(z => {
            const config = ZONE_COLORS[z.tipo] || ZONE_COLORS.impresion;
            const rect = new fabric.Rect({
                left: z.area_x * scale,
                top: z.area_y * scale,
                width: z.area_width * scale,
                height: z.area_height * scale,
                fill: config.fill,
                stroke: config.stroke,
                strokeWidth: 2,
                cornerColor: '#fff',
                cornerStrokeColor: config.stroke,
                cornerSize: 8,
                transparentCorners: false,
                _id: z.id || `temp_${Math.random().toString(36).substr(2, 9)}`,
                _tipo: z.tipo,
                _nombre: z.nombre
            });
            canvas.add(rect);
        });
        canvas.renderAll();
    };

    const addZone = (type) => {
        const canvas = fabricCanvasRef.current;
        if (!canvas) return;
        
        const config = ZONE_COLORS[type];
        const rect = new fabric.Rect({
            left: 50,
            top: 50,
            width: 150,
            height: 150,
            fill: config.fill,
            stroke: config.stroke,
            strokeWidth: 2,
            cornerColor: '#fff',
            cornerSize: 8,
            transparentCorners: false,
            _id: `temp_${Date.now()}`,
            _tipo: type,
            _nombre: `Zona ${config.label}`
        });
        
        canvas.add(rect);
        canvas.setActiveObject(rect);
    };

    const deleteSelected = () => {
        const canvas = fabricCanvasRef.current;
        const active = canvas?.getActiveObject();
        if (active) {
            canvas.remove(active);
            canvas.discardActiveObject();
            canvas.renderAll();
        }
    };

    const changeType = (newType) => {
        const canvas = fabricCanvasRef.current;
        const active = canvas?.getActiveObject();
        if (active) {
            const config = ZONE_COLORS[newType];
            active.set({
                fill: config.fill,
                stroke: config.stroke,
                _tipo: newType,
                _nombre: `Zona ${config.label}`
            });
            canvas.renderAll();
            // Disparar sincronización manual
            canvas.fire('object:modified');
        }
    };

    return (
        <div className="flex flex-col gap-6" ref={containerRef}>
            {/* Barra de Herramientas Superior */}
            <div className="flex flex-wrap gap-2 p-3 bg-gray-800 rounded-xl border border-gray-700 shadow-xl">
                <button 
                    onClick={() => addZone('impresion')}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600/20 text-purple-400 border border-purple-500/30 rounded-lg hover:bg-purple-600/30 transition-all text-[10px] font-black uppercase tracking-widest"
                >
                    <Type size={14} /> + Área Impresión
                </button>
                <button 
                    onClick={() => addZone('bloqueada')}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-600/30 transition-all text-[10px] font-black uppercase tracking-widest"
                >
                    <Lock size={14} /> + Área Bloqueada
                </button>
                <button 
                    onClick={() => addZone('baja_visibilidad')}
                    className="flex items-center gap-2 px-4 py-2 bg-amber-600/20 text-amber-400 border border-amber-500/30 rounded-lg hover:bg-amber-600/30 transition-all text-[10px] font-black uppercase tracking-widest"
                >
                    <AlertTriangle size={14} /> + Advertencia
                </button>

                <div className="w-px h-8 bg-gray-700 mx-2 self-center" />

                <button 
                    onClick={deleteSelected}
                    disabled={!selectedId}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-[10px] font-black uppercase tracking-widest ${selectedId ? 'bg-gray-700 text-white hover:bg-red-600/50' : 'bg-gray-800 text-gray-600 cursor-not-allowed'}`}
                >
                    <Trash2 size={14} /> Eliminar Seleccionada
                </button>
            </div>

            {/* Contenedor del Editor */}
            <div className="relative flex justify-center bg-gray-950 rounded-2xl border border-gray-800 overflow-hidden shadow-inner min-h-[500px]">
                {/* Imagen Base (Capa Inferior) */}
                {imageUrl && (
                    <img 
                        src={imageUrl} 
                        className="absolute pointer-events-none select-none" 
                        style={{ 
                            width: imgDimensions.w * canvasScale, 
                            height: imgDimensions.h * canvasScale,
                            top: 0,
                            left: '50%',
                            transform: 'translateX(-50%)'
                        }}
                        alt="Base"
                    />
                )}
                
                {/* Canvas Fabric (Capa Superior) */}
                <div className="relative z-10" style={{ width: imgDimensions.w * canvasScale, height: imgDimensions.h * canvasScale }}>
                    <canvas ref={canvasRef} />
                </div>

                {/* Acciones Rápidas Flotantes (Solo si hay selección) */}
                {selectedId && (
                    <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 animate-in slide-in-from-right duration-200">
                        <div className="bg-gray-900/90 backdrop-blur-md p-3 rounded-xl border border-gray-700 shadow-2xl flex flex-col gap-2">
                            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Convertir a:</p>
                            <button onClick={() => changeType('impresion')} className="w-8 h-8 rounded-lg bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center hover:bg-purple-600 transition-colors" title="Impresión"><Type size={14}/></button>
                            <button onClick={() => changeType('bloqueada')} className="w-8 h-8 rounded-lg bg-red-600/20 text-red-400 border border-red-500/30 flex items-center justify-center hover:bg-red-600 transition-colors" title="Bloqueada"><Lock size={14}/></button>
                            <button onClick={() => changeType('baja_visibilidad')} className="w-8 h-8 rounded-lg bg-amber-600/20 text-amber-400 border border-amber-500/30 flex items-center justify-center hover:bg-amber-600 transition-colors" title="Advertencia"><AlertTriangle size={14}/></button>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex justify-between items-center text-[10px] text-gray-500 font-bold uppercase tracking-widest px-2">
                <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1"><MousePointer2 size={12}/> Click para seleccionar</span>
                    <span className="flex items-center gap-1"><Square size={12}/> Arrastra para mover/redimensionar</span>
                </div>
                <span>Resolución Original: {imgDimensions.w}x{imgDimensions.h}px</span>
            </div>
        </div>
    );
}
