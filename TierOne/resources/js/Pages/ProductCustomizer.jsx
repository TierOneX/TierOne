import { Head, router, Link } from "@inertiajs/react";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useCart } from "@/Contexts/CartContext";
import MainLayout from "@/Layouts/MainLayout";
import DesignCanvas from "@/Components/Customizer/DesignCanvas";
import TextTool from "@/Components/Customizer/TextTool";
import ImageTool from "@/Components/Customizer/ImageTool";
import LayerPanel from "@/Components/Customizer/LayerPanel";
import ZoneSelector from "@/Components/Customizer/ZoneSelector";
import PriceSummary from "@/Components/Customizer/PriceSummary";
import { ShoppingBag, ChevronLeft, Cpu } from "lucide-react";
import ConfirmationModal from "@/Components/Customizer/ConfirmationModal";

import { imgUrl } from "@/Utils/imageUtils";

export default function ProductCustomizer({ producto, zonas, precios }) {
    const { addToCart } = useCart();

    // ──────────────────────────────────────────────────
    // Agrupar zonas por imagen base → Vistas
    // ──────────────────────────────────────────────────
    const views = useMemo(() => {
        const seen = new Map();
        zonas.forEach((z) => {
            const key = imgUrl(z.imagen_base);
            if (!seen.has(key)) {
                seen.set(key, {
                    image: z.imagen_base,
                    nombre: z.nombre || "Vista",
                    zonas: [],
                });
            }
            seen.get(key).zonas.push(z);
        });
        return Array.from(seen.values());
    }, [zonas]);

    // ──────────────────────────────────────────────────
    // Estado
    // ──────────────────────────────────────────────────
    const [activeViewIndex, setActiveViewIndex] = useState(0);
    const [activeZoneId, setActiveZoneId] = useState(null);
    const [zonesData, setZonesData] = useState({}); // { [zoneId]: { layers, userObjects } }
    const [allZonesLayers, setAllZonesLayers] = useState({}); // { [zoneId]: layers[] } para precio
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const canvasRef = useRef(null);

    const activeView =
        views && views.length > 0 ? views[activeViewIndex] : null;
    const activeZone =
        activeView && activeZoneId
            ? activeView.zonas.find((z) => z.id === activeZoneId)
            : null;

    // Inicializar zona activa al cargar o cambiar de vista
    useEffect(() => {
        if (!activeView) return;
        const firstPrintable = activeView.zonas.find(
            (z) => z.tipo === "impresion",
        );
        setActiveZoneId(firstPrintable?.id || activeView.zonas[0]?.id);
    }, [activeViewIndex, activeView]);

    // ──────────────────────────────────────────────────
    // Cálculo de precios
    // ──────────────────────────────────────────────────
    const totalElements = useMemo(() => {
        return Object.values(allZonesLayers).reduce(
            (acc, layers) => {
                const ls = layers || [];
                return {
                    textos:
                        acc.textos +
                        ls.filter((l) => l.tipo === "texto").length,
                    imagenes:
                        acc.imagenes +
                        ls.filter((l) => l.tipo === "imagen").length,
                };
            },
            { textos: 0, imagenes: 0 },
        );
    }, [allZonesLayers]);

    const recargo =
        totalElements.textos * precios.texto +
        totalElements.imagenes * precios.imagen;

    // Zonas con contenido (para badges en el selector)
    const zonesWithContent = useMemo(() => {
        const map = {};
        Object.entries(allZonesLayers).forEach(([zoneId, layers]) => {
            map[zoneId] = layers && layers.length > 0;
        });
        return map;
    }, [allZonesLayers]);

    // ──────────────────────────────────────────────────
    // Handlers
    // ──────────────────────────────────────────────────
    const handleAddText = (textConfig) => {
        canvasRef.current?.addText(textConfig);
    };

    const handleAddImage = async (file) => {
        try {
            const formData = new FormData();
            formData.append("imagen", file);
            
            const { data } = await window.axios.post(route("customization.upload"), formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (data.url) {
                canvasRef.current?.addImage(data.url);
            } else {
                throw new Error("No se recibió la URL de la imagen");
            }
        } catch (error) {
            console.error("handleAddImage error:", error);
            const msg = error.response?.data?.message || error.message || "Hubo un problema al subir tu logo. Revisa el formato y tamaño.";
            alert(msg);
        }
    };

    const handleLayersUpdate = useCallback((zoneId, layers) => {
        setAllZonesLayers((prev) => ({ ...prev, [zoneId]: layers }));
    }, []);

    const handleViewChange = (index) => {
        // Guardar todo el estado del canvas actual antes de cambiar de vista
        if (canvasRef.current) {
            const allData = canvasRef.current.exportAllData();
            setZonesData((prev) => ({ ...prev, ...allData }));
        }
        setActiveViewIndex(index);
    };

    const handleZoneChange = (zoneId) => {
        setActiveZoneId(zoneId);
    };

    const handleAddToCart = () => {
        setIsConfirmModalOpen(true);
    };

    const confirmAddToCart = async () => {
        setIsConfirmModalOpen(false);

        // Guardar estado actual
        if (canvasRef.current) {
            const allData = canvasRef.current.exportAllData();
            setZonesData((prev) => ({ ...prev, ...allData }));
        }

        // Exportar PNG de la vista actual
        const currentRender = canvasRef.current?.exportViewPNG();

        // Construir personalizacion_data (estructura compatible con CartContext)
        const personalizacionData = {
            producto_id: producto.id,
            producto_nombre: producto.nombre,
            zonas: zonas
                .map((z) => ({
                    zona_id: z.id,
                    zona_nombre: z.nombre,
                    imagen_base: z.imagen_base,
                    area_impresion: {
                        x: z.area_x,
                        y: z.area_y,
                        width: z.area_width,
                        height: z.area_height,
                    },
                    capas: allZonesLayers[z.id] || [],
                }))
                .filter((z) => z.capas.length > 0),
            precio_elementos: {
                textos: totalElements.textos,
                imagenes: totalElements.imagenes,
                precio_texto: precios.texto,
                precio_imagen: precios.imagen,
                total_recargo: recargo,
            },
            render_principal: currentRender,
        };

        addToCart(producto, null, 1, personalizacionData);
        router.visit(route("cart"));
    };

    return (
        <MainLayout>
            <Head title={`Personalizar ${producto.nombre} - TierOne`} />

            <section className="bg-[#050505] min-h-screen pt-6 pb-20 px-4 relative overflow-hidden">
                {/* Fondo decorativo */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-[500px] bg-red-600/5 blur-[120px] rounded-full pointer-events-none" />
                
                <div className="max-w-7xl mx-auto relative z-10">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
                        <div className="flex items-center gap-4">
                            <Link
                                href={route("product.show", producto.slug)}
                                className="p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 transition-all group"
                            >
                                <ChevronLeft className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" strokeWidth={2.5} />
                            </Link>
                            <div>
                                <h1 className="text-white font-black text-2xl uppercase tracking-[0.1em] font-outfit italic leading-tight">
                                    Configurador de <span className="text-red-600">Hardware</span>
                                </h1>
                                <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em] flex items-center gap-2 mt-1">
                                    Personalizando <span className="text-white">{producto.nombre}</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Vista + Zona Selector */}
                    <div className="mb-10">
                        <ZoneSelector
                            views={views}
                            activeViewIndex={activeViewIndex}
                            onViewChange={handleViewChange}
                            activeZoneId={activeZoneId}
                            onZoneChange={handleZoneChange}
                            zonesWithContent={zonesWithContent}
                        />
                    </div>

                    {/* Main Grid: Tools | Canvas | Price */}
                    <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr_300px] gap-8 mt-4">
                        {/* Left: Tools */}
                        <div className="space-y-6 order-2 lg:order-1">
                            <TextTool onAddText={handleAddText} />
                            <ImageTool onAddImage={handleAddImage} />
                            <LayerPanel
                                layers={allZonesLayers[activeZoneId] || []}
                                onSelectLayer={(i) =>
                                    canvasRef.current?.selectLayer(i)
                                }
                                onDeleteLayer={(i) =>
                                    canvasRef.current?.deleteLayer(i)
                                }
                            />
                        </div>

                        {/* Center: Canvas */}
                        <div className="flex flex-col items-center order-1 lg:order-2">
                            <div className="relative group w-full flex justify-center">
                                {/* Decoración de bordes del canvas */}
                                <div className="absolute -inset-4 bg-red-600/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                                
                                {activeView && activeZone && (
                                    <DesignCanvas
                                        ref={canvasRef}
                                        viewImage={activeView.image}
                                        activeZone={activeZone}
                                        allViewZones={activeView.zonas}
                                        initialZonesData={zonesData}
                                        onLayersUpdate={handleLayersUpdate}
                                        onZoneActivate={handleZoneChange}
                                    />
                                )}
                            </div>
                            
                            <div className="mt-6 flex items-center gap-6 opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-700">
                                <div className="h-px w-20 bg-gradient-to-r from-transparent to-white/20" />
                                <p className="text-[8px] text-gray-400 font-black uppercase tracking-[0.5em]">Lienzo de Precisión</p>
                                <div className="h-px w-20 bg-gradient-to-l from-transparent to-white/20" />
                            </div>
                        </div>

                        {/* Right: Price + Add to Cart */}
                        <div className="space-y-6 order-3">
                            <PriceSummary
                                precioBase={Number(producto.precio_venta)}
                                elementos={totalElements}
                                precios={precios}
                                recargo={recargo}
                            />
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-red-600 blur opacity-25 group-hover:opacity-60 transition-opacity rounded-2xl" />
                                <button
                                    onClick={handleAddToCart}
                                    className="relative w-full py-5 rounded-2xl font-black text-[12px] uppercase tracking-[0.2em] flex items-center justify-center gap-4 transition-all bg-gradient-to-r from-red-600 to-red-800 text-white shadow-xl italic font-outfit active:scale-95 border border-red-500/50 hover:border-white/20"
                                >
                                    <ShoppingBag className="w-5 h-5 shadow-lg" strokeWidth={2.5} />
                                    COMPLETAR DISEÑO
                                </button>
                            </div>
                            
                            <div className="p-4 bg-white/3 border border-white/5 rounded-2xl">
                                <h4 className="text-[9px] text-white font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <div className="w-1 h-1 bg-red-600 rounded-full" /> Nota técnica
                                </h4>
                                <p className="text-[9px] text-gray-500 italic leading-relaxed">
                                    Al completar el diseño, se generará un render de alta fidelidad para que nuestro equipo lo valide técnicamente.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            <ConfirmationModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={confirmAddToCart}
            />
        </MainLayout>
    );
}
