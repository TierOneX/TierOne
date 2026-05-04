import { Head, router, Link } from '@inertiajs/react';
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

    const imgUrl = (src) => {
        if (!src) return null;
        if (src.startsWith('data:')) return src; // Blobs/Base64
        return src.startsWith('/') || src.startsWith('http') ? src : `/${src}`;
    };

    // Agrupar zonas por imagen base (Vistas)
    const views = Array.from(new Set(zonas.map(z => imgUrl(z.imagen_base)))).map(img => ({
        image: img,
        nombre: zonas.find(z => imgUrl(z.imagen_base) === img && z.tipo === 'impresion')?.nombre || 
                zonas.find(z => imgUrl(z.imagen_base) === img)?.nombre || 'Vista',
        zonas: zonas.filter(z => imgUrl(z.imagen_base) === img)
    }));

    const [activeViewIndex, setActiveViewIndex] = useState(0);
    const activeView = views[activeViewIndex];
    
    // De las zonas de la vista actual, cuál es la activa para añadir capas
    const [activeZoneId, setActiveZoneId] = useState(null);

    useEffect(() => {
        if (activeView) {
            const firstImpresion = activeView.zonas.find(z => z.tipo === 'impresion')?.id;
            setActiveZoneId(firstImpresion || activeView.zonas[0]?.id);
        }
    }, [activeViewIndex]);

    const [zonesData, setZonesData] = useState({}); // { zonaId: { layers: [], fabricJSON: {} } }
    const canvasRef = useRef(null);

    const activeZone = zonas.find(z => z.id === activeZoneId);

    // Inicializar datos de zonas
    useEffect(() => {
        const initialData = {};
        zonas.forEach(z => {
            initialData[z.id] = { layers: [], fabricJSON: null };
        });
        setZonesData(initialData);
    }, [zonas]);

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
        canvasRef.current?.addText(textConfig);
    };

    const handleAddImage = async (file) => {
        const formData = new FormData();
        formData.append('imagen', file);
        const response = await fetch(route('customization.upload'), {
            method: 'POST',
            body: formData,
            headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content }
        });
        const data = await response.json();
        canvasRef.current?.addImage(data.url);
    };

    const handleLayersUpdate = (layers) => {
        if (!activeZoneId) return;
        setZonesData(prev => ({
            ...prev,
            [activeZoneId]: { ...prev[activeZoneId], layers }
        }));
    };

    const handleViewChange = (index) => {
        if (canvasRef.current && activeZoneId) {
            const currentData = canvasRef.current.exportData();
            setZonesData(prev => ({
                ...prev,
                [activeZoneId]: currentData
            }));
        }
        setActiveViewIndex(index);
    };

    const handleAddToCart = async () => {
        const renders = {};
        
        // CONSEJO: En un entorno real, iteraríamos por todas las zonas y renderizaríamos.
        // Aquí, por simplicidad, capturamos al menos la zona activa actual.
        if (canvasRef.current) {
            const currentData = canvasRef.current.exportData();
            const currentRender = canvasRef.current.exportPNG();
            
            const updatedZonesData = {
                ...zonesData,
                [activeZone.id]: currentData
            };
            
            const personalizacionData = {
                producto_id: producto.id,
                producto_nombre: producto.nombre,
                zonas: zonas.map(z => ({
                    zona_id: z.id,
                    zona_nombre: z.nombre,
                    imagen_base: z.imagen_base,
                    area_impresion: { x: z.area_x, y: z.area_y, width: z.area_width, height: z.area_height },
                    capas: updatedZonesData[z.id]?.layers || [],
                })).filter(z => z.capas.length > 0),
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
            router.visit(route('cart'));
        }
    };

    return (
        <MainLayout>
            <Head title={`Personalizar ${producto.nombre} - TierOne`} />

            <section className="bg-[#0a0a0a] min-h-screen pt-4 pb-12 px-4">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <Link href={route('product.show', producto.slug)}
                                className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
                                <ArrowLeft className="w-5 h-5 text-white" />
                            </Link>
                            <h1 className="text-white font-black text-lg uppercase tracking-tight">
                                Personalizar: <span className="text-[#e31837]">{producto.nombre}</span>
                            </h1>
                        </div>
                    </div>

                    {/* Zone Selector (Vistas) */}
                    <ZoneSelector
                        zonas={views}
                        activeIndex={activeViewIndex}
                        onChange={handleViewChange}
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
                        <div className="flex flex-col items-center">
                            {activeView && (
                                <DesignCanvas
                                    ref={canvasRef}
                                    zona={activeZone}
                                    imgUrl={imgUrl}
                                    allViewZones={activeView.zonas}
                                    savedData={zonesData[activeZoneId]}
                                    onLayersUpdate={handleLayersUpdate}
                                    onZoneActivate={(id) => setActiveZoneId(id)}
                                />
                            )}
                        </div>

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
                                        : 'bg-[#e31837] text-white hover:bg-red-700 active:scale-[0.98] shadow-lg shadow-red-500/20'
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
