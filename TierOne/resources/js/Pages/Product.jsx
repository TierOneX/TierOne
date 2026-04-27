import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import { Trophy, Zap, Gamepad2 } from 'lucide-react';

/** Normaliza rutas de imagen relativas a absolutas */
const imgUrl = (src) => {
    if (!src) return null;
    return src.startsWith('/') || src.startsWith('http') ? src : `/${src}`;
};
import MainLayout from '@/Layouts/MainLayout';
import ProductGallery from '@/Components/Product/ProductGallery';
import ProductInfo from '@/Components/Product/ProductInfo';
import VariantSelector from '@/Components/Product/VariantSelector';
import AddToCartBar from '@/Components/Product/AddToCartBar';
import ProductAccordion from '@/Components/Product/ProductAccordion';
import RelatedProducts from '@/Components/Product/RelatedProducts';

export default function Product({ producto, relacionados = [] }) {
    const [selectedVariant, setSelectedVariant] = useState(null);

    return (
        <MainLayout>
            <Head title={`${producto.nombre} - TierOne`} />
            <Head>
                <meta name="description" content={producto.descripcion || `Compra ${producto.nombre} en TierOne Gaming. Calidad premium y envío rápido.`} />
            </Head>

            {/* Sección principal del producto */}
            <section className="bg-[#0a0a0a] pt-6 pb-12 px-4 sm:px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">

                        {/* Columna izquierda: Galería */}
                        <ProductGallery
                            imagenes={producto.imagenes}
                            imagenPrincipal={producto.imagen_principal}
                            nombre={producto.nombre}
                        />

                        {/* Columna derecha: Info del producto */}
                        <div className="flex flex-col">
                            <ProductInfo producto={producto} />

                            {/* Selector de variantes */}
                            <VariantSelector
                                variantes={producto.variantes}
                                selectedVariant={selectedVariant}
                                onSelect={setSelectedVariant}
                            />

                            {/* Botones de compra (desktop) */}
                            <AddToCartBar
                                producto={producto}
                                selectedVariant={selectedVariant}
                                variantes={producto.variantes}
                            />

                            {producto.personalizable && (
                                <Link
                                    href={route('product.customize', producto.slug)}
                                    className="flex w-full py-4 rounded-lg font-black text-sm uppercase tracking-widest items-center justify-center gap-3 transition-all bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 active:scale-[0.98] mb-4"
                                >
                                    <span>✨</span> PERSONALIZAR ESTE PRODUCTO
                                </Link>
                            )}

                            {/* Acordeón de info */}
                            <ProductAccordion producto={producto} />
                        </div>
                    </div>
                </div>
            </section>

            {/* Sección de descripción detallada (como en el mockup) */}
            {producto.descripcion && (
                <section className="bg-[#111114] py-16 px-4 sm:px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-2xl md:text-4xl font-black italic uppercase text-white leading-tight mb-6">
                                    DISEÑADO PARA LA <span className="text-[#e31837]">COMPETICIÓN</span>
                                </h2>
                                <p className="text-gray-400 text-base leading-relaxed mb-8">
                                    {producto.descripcion}
                                </p>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <Trophy className="w-5 h-5 text-[#e31837]" />
                                        <span className="text-white text-sm font-semibold">Calidad gaming profesional</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Zap className="w-5 h-5 text-[#e31837]" />
                                        <span className="text-white text-sm font-semibold">Rendimiento optimizado</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Gamepad2 className="w-5 h-5 text-[#e31837]" />
                                        <span className="text-white text-sm font-semibold">Diseño ergonómico</span>
                                    </div>
                                </div>
                            </div>
                            <div className="aspect-square rounded-2xl overflow-hidden" style={{ background: '#1C1C20' }}>
                                {producto.imagen_principal ? (
                                    <img
                                        src={imgUrl(producto.imagen_principal)}
                                        alt={producto.nombre}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <svg className="w-20 h-20 text-white/10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a1.5 1.5 0 001.5-1.5V5.25a1.5 1.5 0 00-1.5-1.5H3.75a1.5 1.5 0 00-1.5 1.5v14.25a1.5 1.5 0 001.5 1.5z" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Productos relacionados */}
            <div className="bg-[#0a0a0a]">
                <RelatedProducts productos={relacionados} />
            </div>

        </MainLayout>
    );
}
