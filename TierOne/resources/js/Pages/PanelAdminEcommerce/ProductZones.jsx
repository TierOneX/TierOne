import React, { useState, useRef, useCallback, useEffect } from "react";
import PanelLayout from "@/Components/PanelAdminEcommerce/PanelLayout";
import { Head, useForm, router, Link } from "@inertiajs/react";
import {
    Plus, Trash2, Edit2, Eye, EyeOff, ArrowLeft,
    Move, Save, DollarSign, Image as ImageIcon,
    Layout
} from "lucide-react";
import FabricZoneEditor from "@/Components/PanelAdminEcommerce/FabricZoneEditor";

// Colores por tipo de zona
const ZONE_COLORS = {
    impresion:        { border: 'border-purple-400', bg: 'bg-purple-500/15', label: 'bg-purple-600', text: 'Impresión',        overlay: 'bg-black/40' },
    bloqueada:        { border: 'border-red-400',    bg: 'bg-red-500/15',    label: 'bg-red-600',    text: 'Bloqueada',        overlay: 'bg-red-900/30' },
    baja_visibilidad: { border: 'border-amber-400',  bg: 'bg-amber-500/15',  label: 'bg-amber-600',  text: 'Baja Visibilidad', overlay: 'bg-amber-900/25' },
};

/** Normaliza rutas de imagen relativas a absolutas */
const imgUrl = (src) => {
    if (!src) return null;
    if (src.startsWith('data:')) return src; // Blobs/Base64
    return src.startsWith('/') || src.startsWith('http') ? src : `/${src}`;
};

export default function ProductZones({
    producto, zonas = [],
    precioTexto, precioImagen,
    precioTextoGlobal, precioImagenGlobal
}) {
    const [editingView, setEditingView] = useState(null); // { imgBase: string, zones: [] } | null

    const { data: formData, setData, post, processing, reset } = useForm({
        imagen_base: null,
        zonas: [],
    });

    const { data: preciosData, setData: setPreciosData, put: putPrecios, processing: processingPrecios } = useForm({
        precio_texto: precioTexto,
        precio_imagen: precioImagen,
        usar_global: false,
    });

    const enterStudio = (imgBase, existingZones = []) => {
        setEditingView({ imgBase, zones: existingZones });
        setData({
            imagen_base: imgBase,
            zonas: existingZones
        });
    };

    const exitStudio = () => {
        setEditingView(null);
        reset();
    };

    const handleSubmitSync = (e) => {
        if (e) e.preventDefault();
        post(route('panel.ecommerce.products.zonas.sync', producto.id), {
            onSuccess: () => { 
                exitStudio();
            },
        });
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
                {!editingView && (
                    <button
                        onClick={() => enterStudio(producto.imagen_principal || '')}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg font-bold text-xs uppercase hover:bg-purple-700 transition-colors flex items-center gap-2 tracking-widest shadow-md"
                    >
                        <Plus size={14} /> Nueva Vista / Zona
                    </button>
                )}
            </div>

            {editingView ? (
                /* MODO ESTUDIO: Editor Interactivo Inline */
                <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8 mb-8 animate-in fade-in zoom-in duration-300">
                    <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-800">
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={exitStudio}
                                className="p-2 bg-gray-800 text-gray-400 hover:text-white rounded-lg border border-gray-700 transition-colors"
                            >
                                <ArrowLeft size={16} />
                            </button>
                            <div>
                                <h3 className="text-white font-black text-sm uppercase tracking-widest">
                                    Estudio de Personalización
                                </h3>
                                <p className="text-[10px] text-gray-500 uppercase font-bold">Editando zonas de la vista seleccionada</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={exitStudio}
                                className="px-6 py-2.5 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:bg-gray-800 rounded-xl transition-all"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSubmitSync}
                                disabled={processing}
                                className="px-8 py-2.5 bg-green-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-green-700 transition-all shadow-lg shadow-green-900/20 flex items-center gap-2"
                            >
                                <Save size={14} /> {processing ? "Guardando..." : "Guardar Cambios"}
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-12">
                        {/* Editor Principal */}
                        <div className="space-y-6">
                            <FabricZoneEditor
                                key={editingView.imgBase}
                                imageSrc={editingView.imgBase}
                                zones={editingView.zones}
                                onZonesChange={(updated) => setData('zonas', updated)}
                            />
                        </div>

                        {/* Controles Laterales */}
                        <div className="space-y-8">
                            <section>
                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 border-b border-gray-800 pb-2">
                                    Cambiar Imagen de esta Vista
                                </h4>
                                <div className="grid grid-cols-4 gap-2 mb-4">
                                    {[
                                        ...(producto.imagen_principal ? [{ id: 'main', url: producto.imagen_principal }] : []),
                                        ...producto.imagenes
                                    ].map((img, idx) => (
                                        <button
                                            key={img.id || idx}
                                            type="button"
                                            onClick={() => {
                                                setEditingView(prev => ({ ...prev, imgBase: img.url }));
                                                setData('imagen_base', img.url);
                                            }}
                                            className={`aspect-square rounded-lg border-2 overflow-hidden transition-all ${editingView.imgBase === img.url ? 'border-purple-600 ring-2 ring-purple-500/20' : 'border-gray-800 opacity-50 hover:opacity-100'}`}
                                        >
                                            <img src={imgUrl(img.url)} className="w-full h-full object-contain bg-black" alt="Miniatura" />
                                        </button>
                                    ))}
                                </div>
                                <p className="text-[9px] text-gray-500 font-medium leading-relaxed">
                                    Selecciona una imagen de la galería para esta vista. Todas las zonas que dibujes se asociarán a esta imagen.
                                </p>
                            </section>

                            <section className="bg-gray-800/30 p-6 rounded-2xl border border-gray-800">
                                <h4 className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-4">
                                    Instrucciones de Uso
                                </h4>
                                <ul className="space-y-3">
                                    <li className="flex gap-3 text-[11px] text-gray-400">
                                        <span className="w-5 h-5 rounded-full bg-gray-800 flex items-center justify-center text-[9px] font-bold text-white shrink-0">1</span>
                                        Usa los botones superiores para añadir rectángulos de diferentes tipos.
                                    </li>
                                    <li className="flex gap-3 text-[11px] text-gray-400">
                                        <span className="w-5 h-5 rounded-full bg-gray-800 flex items-center justify-center text-[9px] font-bold text-white shrink-0">2</span>
                                        Haz clic en un rectángulo para redimensionarlo o moverlo sobre la imagen.
                                    </li>
                                    <li className="flex gap-3 text-[11px] text-gray-400">
                                        <span className="w-5 h-5 rounded-full bg-gray-800 flex items-center justify-center text-[9px] font-bold text-white shrink-0">3</span>
                                        Puedes cambiar el tipo de una zona seleccionada usando los iconos de acceso rápido.
                                    </li>
                                </ul>
                            </section>
                        </div>
                    </div>
                </div>
            ) : (
                /* MODO LISTADO: Grid de vistas agrupadas */
                <div className="space-y-8 mb-8">
                    {Object.entries(zonas.reduce((acc, z) => {
                        const normalizedUrl = imgUrl(z.imagen_base);
                        if (!acc[normalizedUrl]) acc[normalizedUrl] = [];
                        acc[normalizedUrl].push(z);
                        return acc;
                    }, {})).map(([imgBase, groupZones], viewIdx) => (
                        <div key={imgBase} className="bg-gray-900/50 rounded-2xl border border-gray-800 p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-white font-black text-sm uppercase tracking-widest flex items-center gap-2">
                                    <ImageIcon size={16} className="text-purple-400" />
                                    Vista {viewIdx + 1}: {groupZones[0].nombre}
                                </h3>
                                <span className="text-[10px] text-gray-500 font-bold uppercase">
                                    {groupZones.length} {groupZones.length === 1 ? 'Zona' : 'Zonas'} en esta imagen
                                </span>
                            </div>
                            
                            <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">
                                {/* Previsualización combinada */}
                                <div className="bg-gray-950 rounded-xl overflow-hidden border border-gray-800 relative aspect-[6/7] max-h-[500px]">
                                    <img src={imgUrl(imgBase)} alt="Vista" className="w-full h-full object-contain" />
                                    
                                    {groupZones.map((z) => {
                                        const tc = ZONE_COLORS[z.tipo] || ZONE_COLORS.impresion;
                                        return (
                                            <div
                                                key={z.id}
                                                className={`absolute border-2 border-dashed ${tc.border} ${tc.bg} group/zone`}
                                                style={{
                                                    left: `${(z.area_x / z.canvas_width) * 100}%`,
                                                    top: `${(z.area_y / z.canvas_height) * 100}%`,
                                                    width: `${(z.area_width / z.canvas_width) * 100}%`,
                                                    height: `${(z.area_height / z.canvas_height) * 100}%`,
                                                }}
                                            >
                                                <div className={`absolute -top-6 left-0 ${tc.label} text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter opacity-80 group-hover/zone:opacity-100 transition-opacity`}>
                                                    {z.nombre}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Lista de zonas para esta vista */}
                                <div className="space-y-3">
                                    {groupZones.map((z) => {
                                        const tc = ZONE_COLORS[z.tipo] || ZONE_COLORS.impresion;
                                        return (
                                            <div key={z.id} className="bg-gray-800/50 rounded-xl border border-gray-700 p-4 flex justify-between items-center group">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h4 className="text-white font-bold text-xs uppercase">{z.nombre}</h4>
                                                        <span className={`text-[8px] px-1.5 py-0.5 rounded font-black ${tc.label} text-white`}>
                                                            {tc.text}
                                                        </span>
                                                    </div>
                                                    <p className="text-[10px] text-gray-500 font-mono">
                                                        {z.area_width}x{z.area_height}px @ {z.area_x},{z.area_y}
                                                    </p>
                                                </div>
                                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => enterStudio(imgBase, groupZones)} className="flex items-center gap-2 px-3 py-1.5 bg-purple-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-purple-700 transition-colors">
                                                        <Edit2 size={12} /> Gestionar Vista
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    ))}

                    {zonas.length === 0 && (
                        <div className="bg-gray-900 rounded-xl border border-gray-800 text-center py-12 text-gray-500">
                            <ImageIcon size={48} className="mx-auto mb-4 opacity-30" />
                            <p className="font-bold">No hay zonas configuradas</p>
                            <p className="text-sm mt-1">Crea la primera zona de personalización</p>
                        </div>
                    )}
                </div>
            )}

            {/* Sección de Precios */}
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 mt-8">
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
        </PanelLayout>
    );
}
