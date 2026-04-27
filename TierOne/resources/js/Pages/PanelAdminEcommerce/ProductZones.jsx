import React, { useState, useRef, useCallback, useEffect } from "react";
import PanelLayout from "@/Components/PanelAdminEcommerce/PanelLayout";
import AdminModal from "@/Components/PanelAdminEcommerce/AdminModal";
import { Head, useForm, router, Link } from "@inertiajs/react";
import {
    Plus, Trash2, Edit2, Eye, EyeOff, ArrowLeft,
    Move, Save, DollarSign, Image as ImageIcon
} from "lucide-react";

/**
 * Componente para dibujar un rectángulo arrastrando sobre una imagen.
 * El usuario sube una imagen del producto, y arrastra para definir el área imprimible.
 */
function ZoneDrawer({ imageSrc, initialArea, canvasWidth, canvasHeight, onAreaChange }) {
    const containerRef = useRef(null);
    const [drawing, setDrawing] = useState(false);
    const [startPoint, setStartPoint] = useState(null);
    const [area, setArea] = useState(initialArea || { x: 0, y: 0, width: 200, height: 250 });
    const [dragging, setDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    // Refs para evitar state stale en los event handlers
    const areaRef = useRef(area);
    const drawingRef = useRef(false);
    const draggingRef = useRef(false);
    const updateArea = (newArea) => { areaRef.current = newArea; setArea(newArea); };

    // Escala de la imagen mostrada vs el canvas real
    const [displayScale, setDisplayScale] = useState(1);

    useEffect(() => {
        const updateScale = () => {
            if (containerRef.current && canvasWidth && containerRef.current.offsetWidth > 0) {
                const containerWidth = containerRef.current.offsetWidth;
                setDisplayScale(containerWidth / canvasWidth);
            }
        };

        // Actualizar escala al montar, cuando cambia el canvasWidth o cuando carga la imagen
        updateScale();
        
        // También observar cambios de tamaño del contenedor (por si el modal tarda en abrirse)
        const observer = new ResizeObserver(updateScale);
        if (containerRef.current) observer.observe(containerRef.current);
        
        return () => observer.disconnect();
    }, [canvasWidth, imageSrc]);

    const getRelativePos = (e) => {
        const rect = containerRef.current.getBoundingClientRect();
        return {
            x: Math.round((e.clientX - rect.left) / displayScale),
            y: Math.round((e.clientY - rect.top) / displayScale),
        };
    };

    const handleMouseDown = (e) => {
        // closest() funciona aunque el click sea sobre un hijo con pointer-events-none
        if (e.target.closest?.('.zone-handle')) {
            draggingRef.current = true;
            setDragging(true);
            const pos = getRelativePos(e);
            setDragOffset({ x: pos.x - areaRef.current.x, y: pos.y - areaRef.current.y });
        } else {
            drawingRef.current = true;
            setDrawing(true);
            setStartPoint(getRelativePos(e));
        }
    };

    const handleMouseMove = (e) => {
        if (drawingRef.current && startPoint) {
            const pos = getRelativePos(e);
            updateArea({
                x: Math.min(startPoint.x, pos.x),
                y: Math.min(startPoint.y, pos.y),
                width: Math.abs(pos.x - startPoint.x),
                height: Math.abs(pos.y - startPoint.y),
            });
        } else if (draggingRef.current) {
            const pos = getRelativePos(e);
            updateArea({
                ...areaRef.current,
                x: Math.max(0, Math.min(canvasWidth - areaRef.current.width, pos.x - dragOffset.x)),
                y: Math.max(0, Math.min(canvasHeight - areaRef.current.height, pos.y - dragOffset.y)),
            });
        }
    };

    const handleMouseUp = () => {
        if (drawingRef.current || draggingRef.current) {
            drawingRef.current = false;
            draggingRef.current = false;
            setDrawing(false);
            setDragging(false);
            setStartPoint(null);
            onAreaChange(areaRef.current); // usar ref, no state stale
        }
    };

    const scaledArea = {
        left: area.x * displayScale,
        top: area.y * displayScale,
        width: area.width * displayScale,
        height: area.height * displayScale,
    };

    return (
        <div className="relative">
            <div
                ref={containerRef}
                className="relative select-none overflow-hidden rounded-xl border-2 border-gray-200 bg-gray-100 max-h-[450px]"
                style={{ aspectRatio: `${canvasWidth} / ${canvasHeight}`, cursor: dragging ? 'grabbing' : 'crosshair' }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            >
                {imageSrc && (
                    <img
                        src={imageSrc}
                        alt="Producto"
                        className="w-full h-full object-contain pointer-events-none"
                        draggable={false}
                    />
                )}

                {/* Overlay oscuro mejorado (4 áreas para crear el hueco central) */}
                <div className="absolute inset-0 pointer-events-none">
                    {/* Top */}
                    <div className="absolute top-0 left-0 right-0 bg-black/40" style={{ height: scaledArea.top }} />
                    {/* Bottom */}
                    <div className="absolute bottom-0 left-0 right-0 bg-black/40" style={{ top: scaledArea.top + scaledArea.height }} />
                    {/* Left */}
                    <div className="absolute top-0 bottom-0 bg-black/40" style={{ left: 0, width: scaledArea.left, top: scaledArea.top, height: scaledArea.height }} />
                    {/* Right */}
                    <div className="absolute top-0 bottom-0 bg-black/40" style={{ left: scaledArea.left + scaledArea.width, right: 0, top: scaledArea.top, height: scaledArea.height }} />
                </div>

                {/* Rectángulo del área imprimible */}
                <div
                    className="zone-handle absolute border-2 border-dashed border-purple-400 bg-purple-500/15 cursor-grab active:cursor-grabbing"
                    style={{
                        left: scaledArea.left,
                        top: scaledArea.top,
                        width: Math.max(scaledArea.width, 0),
                        height: Math.max(scaledArea.height, 0),
                    }}
                >
                    <div className="absolute -top-6 left-0 bg-purple-600 text-white text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider pointer-events-none whitespace-nowrap">
                        Zona de impresión
                    </div>
                    <div className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] px-1.5 py-0.5 rounded font-mono pointer-events-none">
                        {area.width}×{area.height}px
                    </div>
                </div>
            </div>
            <p className="text-[10px] text-gray-400 mt-2 text-center">
                Arrastra para dibujar el área imprimible · Arrastra el rectángulo para moverlo
            </p>
        </div>
    );
}

export default function ProductZones({
    producto, zonas = [],
    precioTexto, precioImagen,
    precioTextoGlobal, precioImagenGlobal
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("create");
    const [selectedZone, setSelectedZone] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [zoneArea, setZoneArea] = useState({ x: 100, y: 80, width: 300, height: 350 });

    const { data: formData, setData, post, put, processing, errors, reset } = useForm({
        nombre: '',
        imagen_base: null,
        area_x: 100,
        area_y: 80,
        area_width: 300,
        area_height: 350,
        canvas_width: 600,
        canvas_height: 700,
    });

    const { data: preciosData, setData: setPreciosData, put: putPrecios, processing: processingPrecios } = useForm({
        precio_texto: precioTexto,
        precio_imagen: precioImagen,
        usar_global: false,
    });

    const openCreateModal = () => {
        setModalMode("create");
        setSelectedZone(null);
        setImagePreview(null);
        setZoneArea({ x: 100, y: 80, width: 300, height: 350 });
        reset();
        setIsModalOpen(true);
    };

    const openEditModal = (zona) => {
        setModalMode("edit");
        setSelectedZone(zona);
        setImagePreview(zona.imagen_base);
        setZoneArea({
            x: zona.area_x, y: zona.area_y,
            width: zona.area_width, height: zona.area_height,
        });
        setData({
            nombre: zona.nombre,
            imagen_base: null,
            area_x: zona.area_x,
            area_y: zona.area_y,
            area_width: zona.area_width,
            area_height: zona.area_height,
            canvas_width: zona.canvas_width,
            canvas_height: zona.canvas_height,
        });
        setIsModalOpen(true);
    };

    const handleAreaChange = (area) => {
        setZoneArea(area);
        setData(prev => ({
            ...prev,
            area_x: area.x,
            area_y: area.y,
            area_width: area.width,
            area_height: area.height,
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('imagen_base', file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmitZone = (e) => {
        e.preventDefault();
        if (modalMode === "create") {
            post(route('panel.ecommerce.products.zonas.store', producto.id), {
                forceFormData: true,
                onSuccess: () => { setIsModalOpen(false); reset(); setImagePreview(null); },
            });
        } else {
            // Usar router.post con _method para enviar archivos correctamente
            const fd = new FormData();
            Object.entries(formData).forEach(([k, v]) => {
                if (v !== null && v !== undefined) fd.append(k, v);
            });
            fd.append('_method', 'put');
            router.post(route('panel.ecommerce.zonas.update', selectedZone.id), fd, {
                onSuccess: () => { setIsModalOpen(false); reset(); setImagePreview(null); },
                onError: (errs) => console.error('Errores zona:', errs),
            });
        }
    };

    const handleDeleteZone = (zonaId) => {
        if (confirm("¿Eliminar esta zona de personalización?")) {
            router.delete(route('panel.ecommerce.zonas.destroy', zonaId));
        }
    };

    const handleSavePrecios = (e) => {
        e.preventDefault();
        putPrecios(route('panel.ecommerce.products.precios', producto.id));
    };

    return (
        <PanelLayout title={`Zonas — ${producto.nombre}`} activeItem="Productos">
            <Head title={`Zonas de Personalización - ${producto.nombre}`} />

            {/* Header con botón volver */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                    <Link
                        href={route('panel.ecommerce.products')}
                        className="p-2 bg-gray-800 text-gray-400 hover:text-white rounded-lg border border-gray-700 transition-colors"
                    >
                        <ArrowLeft size={16} />
                    </Link>
                    <div>
                        <h2 className="text-lg font-bold text-white uppercase tracking-tight">
                            Zonas de Personalización
                        </h2>
                        <p className="text-xs text-gray-500">{producto.nombre}</p>
                    </div>
                </div>
                <button
                    onClick={openCreateModal}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg font-bold text-xs uppercase hover:bg-purple-700 transition-colors flex items-center gap-2 tracking-widest shadow-md"
                >
                    <Plus size={14} /> Nueva Zona
                </button>
            </div>

            {/* Grid de zonas existentes */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {zonas.map((zona) => (
                    <div key={zona.id} className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden group">
                        <div className="aspect-[6/7] relative bg-gray-950">
                            <img src={zona.imagen_base} alt={zona.nombre} className="w-full h-full object-contain" />
                            {/* Overlay con las dimensiones del área */}
                            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[9px] px-2 py-1 rounded font-mono">
                                {zona.area_width}×{zona.area_height}px
                            </div>
                        </div>
                        <div className="p-4 flex justify-between items-center">
                            <div>
                                <h3 className="text-white font-black text-sm uppercase">{zona.nombre}</h3>
                                <span className={`text-[9px] px-1.5 py-0.5 rounded font-black border ${zona.activa ? 'bg-green-900/50 text-green-400 border-green-800' : 'bg-red-900/50 text-red-400 border-red-800'}`}>
                                    {zona.activa ? "ACTIVA" : "INACTIVA"}
                                </span>
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => openEditModal(zona)} className="p-2 text-gray-400 hover:text-purple-400 transition-colors">
                                    <Edit2 size={14} />
                                </button>
                                <button onClick={() => handleDeleteZone(zona.id)} className="p-2 text-gray-400 hover:text-red-400 transition-colors">
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {zonas.length === 0 && (
                    <div className="col-span-full text-center py-12 text-gray-500">
                        <ImageIcon size={48} className="mx-auto mb-4 opacity-30" />
                        <p className="font-bold">No hay zonas configuradas</p>
                        <p className="text-sm mt-1">Crea la primera zona de personalización</p>
                    </div>
                )}
            </div>

            {/* Sección de Precios */}
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
                <h3 className="text-white font-black text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
                    <DollarSign size={16} className="text-green-400" />
                    Precios por Elemento
                </h3>
                <p className="text-gray-500 text-xs mb-4">
                    Precio global actual: Texto={precioTextoGlobal}€ · Imagen={precioImagenGlobal}€.
                    Puedes definir precios específicos para este producto.
                </p>
                <form onSubmit={handleSavePrecios} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                            Precio por Texto (€)
                        </label>
                        <input
                            type="number" step="0.01" min="0"
                            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-white font-bold text-sm outline-none focus:ring-2 focus:ring-purple-500"
                            value={preciosData.precio_texto}
                            onChange={(e) => setPreciosData('precio_texto', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                            Precio por Imagen (€)
                        </label>
                        <input
                            type="number" step="0.01" min="0"
                            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-white font-bold text-sm outline-none focus:ring-2 focus:ring-purple-500"
                            value={preciosData.precio_imagen}
                            onChange={(e) => setPreciosData('precio_imagen', e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        <button
                            type="submit"
                            disabled={processingPrecios}
                            className="px-6 py-3 bg-green-600 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-green-700 transition-colors flex items-center gap-2"
                        >
                            <Save size={14} /> Guardar
                        </button>
                    </div>
                </form>
            </div>

            {/* Modal para crear/editar zona */}
            <AdminModal
                show={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={modalMode === "create" ? "Nueva Zona de Personalización" : "Editar Zona"}
                maxWidth="max-w-3xl"
            >
                <form onSubmit={handleSubmitZone} className="max-h-[80vh] overflow-y-auto pr-2 custom-scrollbar space-y-4">
                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                            Nombre de la Zona
                        </label>
                        <input
                            type="text"
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 text-black font-bold"
                            value={formData.nombre}
                            onChange={(e) => setData('nombre', e.target.value)}
                            placeholder='Ej: "Frontal", "Espalda", "Manga Derecha"'
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                            Imagen Base del Producto (esta vista)
                        </label>
                        
                        {/* Selector de imágenes existentes del producto */}
                        {producto.imagenes?.length > 0 && (
                            <div className="mb-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                <span className="text-[9px] text-gray-400 font-black uppercase block mb-2 tracking-widest">
                                    Seleccionar de la galería del producto:
                                </span>
                                <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                                    {/* Incluir también la imagen principal si no está en la colección */}
                                    {[
                                        ...(producto.imagen_principal ? [{ id: 'main', url: producto.imagen_principal }] : []),
                                        ...producto.imagenes
                                    ].map((img, idx) => (
                                        <button
                                            key={img.id || idx}
                                            type="button"
                                            onClick={() => {
                                                setData('imagen_base', img.url);
                                                setImagePreview(img.url);
                                            }}
                                            className={`flex-shrink-0 w-16 h-16 rounded-lg border-2 overflow-hidden transition-all ${imagePreview === img.url ? 'border-purple-600 ring-2 ring-purple-100' : 'border-gray-200 opacity-60 hover:opacity-100'}`}
                                        >
                                            <img src={img.url} className="w-full h-full object-contain bg-white" alt="Miniatura" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            <span className="text-[9px] text-gray-400 font-black uppercase block tracking-widest">
                                O subir un archivo nuevo:
                            </span>
                            <input
                                type="file" accept="image/*"
                                onChange={handleFileChange}
                                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                                Ancho Canvas (px)
                            </label>
                            <input type="number" min="200"
                                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-black font-bold text-sm"
                                value={formData.canvas_width}
                                onChange={(e) => setData('canvas_width', parseInt(e.target.value))}
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                                Alto Canvas (px)
                            </label>
                            <input type="number" min="200"
                                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-black font-bold text-sm"
                                value={formData.canvas_height}
                                onChange={(e) => setData('canvas_height', parseInt(e.target.value))}
                            />
                        </div>
                    </div>

                    {/* Editor visual: arrastrar rectángulo */}
                    {imagePreview && (
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                                Definir Área Imprimible (arrastra sobre la imagen)
                            </label>
                            <ZoneDrawer
                                key={imagePreview}
                                imageSrc={imagePreview}
                                initialArea={zoneArea}
                                canvasWidth={formData.canvas_width}
                                canvasHeight={formData.canvas_height}
                                onAreaChange={handleAreaChange}
                            />
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                        <button type="button" onClick={() => setIsModalOpen(false)}
                            className="px-5 py-2.5 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:bg-gray-50 rounded-xl"
                        >
                            Cancelar
                        </button>
                        <button type="submit" disabled={processing}
                            className="px-8 py-2.5 bg-purple-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-purple-700 disabled:opacity-50"
                        >
                            {processing ? "Guardando..." : modalMode === "create" ? "Crear Zona" : "Guardar Cambios"}
                        </button>
                    </div>
                </form>
            </AdminModal>
        </PanelLayout>
    );
}
