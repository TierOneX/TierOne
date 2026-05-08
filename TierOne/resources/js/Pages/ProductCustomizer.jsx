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
import { ShoppingCart, ArrowLeft } from "lucide-react";
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
            
            const response = await fetch(route("customization.upload"), {
                method: "POST",
                body: formData,
                headers: {
                    "X-CSRF-TOKEN": document.querySelector(
                        'meta[name="csrf-token"]',
                    )?.content,
                    "Accept": "application/json",
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error al subir la imagen");
            }

            const data = await response.json();
            if (data.url) {
                canvasRef.current?.addImage(data.url);
            } else {
                throw new Error("No se recibió la URL de la imagen");
            }
        } catch (error) {
            console.error("handleAddImage error:", error);
            alert(error.message || "Hubo un problema al subir tu logo. Revisa el formato y tamaño.");
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

            <section className="bg-[#0a0a0a] min-h-screen pt-4 pb-12 px-4">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <Link
                                href={route("product.show", producto.slug)}
                                className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5 text-white" />
                            </Link>
                            <h1 className="text-white font-black text-lg uppercase tracking-tight">
                                Personalizar:{" "}
                                <span className="text-[#e31837]">
                                    {producto.nombre}
                                </span>
                            </h1>
                        </div>
                    </div>

                    {/* Vista + Zona Selector */}
                    <ZoneSelector
                        views={views}
                        activeViewIndex={activeViewIndex}
                        onViewChange={handleViewChange}
                        activeZoneId={activeZoneId}
                        onZoneChange={handleZoneChange}
                        zonesWithContent={zonesWithContent}
                    />

                    {/* Main Grid: Tools | Canvas | Price */}
                    <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr_260px] gap-4 mt-4">
                        {/* Left: Tools */}
                        <div className="space-y-3 order-2 lg:order-1">
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

                        {/* Right: Price + Add to Cart */}
                        <div className="space-y-3 order-3">
                            <PriceSummary
                                precioBase={Number(producto.precio_venta)}
                                elementos={totalElements}
                                precios={precios}
                                recargo={recargo}
                            />
                            <button
                                onClick={handleAddToCart}
                                className="w-full py-4 rounded-xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all bg-[#e31837] text-white hover:bg-red-700 active:scale-[0.98] shadow-lg shadow-red-500/20"
                            >
                                <ShoppingCart className="w-5 h-5" />
                                AÑADIR AL CARRITO
                            </button>
                            {recargo === 0 && (
                                <p className="text-[9px] text-gray-500 text-center italic">
                                    Puedes añadir el producto tal cual o
                                    personalizarlo primero.
                                </p>
                            )}
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
