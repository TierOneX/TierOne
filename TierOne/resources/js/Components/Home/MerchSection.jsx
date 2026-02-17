import { useState } from 'react';
import { Link } from '@inertiajs/react';

/**
 * Datos del modelo Producto (BD):
 * - id, nombre, slug, descripcion, imagen_principal, precio_venta,
 *   destacado, activo, ventas_totales, rating_promedio
 * - categoria (relación): nombre
 */
export default function MerchSection({ products }) {
    if (!products || products.length === 0) return null;

    return (
        <section id="merch-section" className="py-14 lg:py-20" style={{ background: '#111114' }}>
            <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
                    <div>
                        <p className="text-[#e31837] text-xs font-bold uppercase tracking-[0.25em] mb-2 flex items-center gap-2">
                            <span className="w-5 h-[2px] bg-[#e31837] rounded-full" />
                            TIENDA OFICIAL
                        </p>
                        <h2 className="text-2xl lg:text-4xl font-black italic uppercase text-white">
                            MERCHANDISING <span className="text-[#e31837]">EXCLUSIVO</span>
                        </h2>
                    </div>
                    <Link href="/shop"
                        className="text-sm font-bold uppercase tracking-wider text-gray-500 hover:text-[#e31837] transition-colors flex items-center gap-2 group">
                        Ver todo
                        <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>

                {/* Grid de productos */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
                    {products.map((producto) => (
                        <ProductCard key={producto.id} producto={producto} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function ProductCard({ producto }) {
    const [imgError, setImgError] = useState(false);

    return (
        <Link
            href={`/shop/${producto.slug}`}
            className="group relative rounded-xl overflow-hidden border border-white/5 hover:border-[#e31837]/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-red-900/10"
            style={{ background: '#1a1a1e' }}
        >
            {/* Badge destacado */}
            {producto.destacado && (
                <span className="absolute top-3 left-3 z-10 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded text-white bg-[#e31837]">
                    DESTACADO
                </span>
            )}

            {/* Imagen del producto o placeholder */}
            <div className="relative aspect-square overflow-hidden" style={{ background: '#1C1C20' }}>
                {producto.imagen_principal && !imgError ? (
                    <img
                        src={producto.imagen_principal}
                        alt={producto.nombre}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={() => setImgError(true)}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg, #1C1C20 0%, #252528 100%)' }}>
                        <svg className="w-12 h-12 text-white/10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a1.5 1.5 0 001.5-1.5V5.25a1.5 1.5 0 00-1.5-1.5H3.75a1.5 1.5 0 00-1.5 1.5v14.25a1.5 1.5 0 001.5 1.5z" />
                        </svg>
                    </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                    <span className="text-white text-xs font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 bg-[#e31837] px-5 py-2.5 rounded">
                        Ver producto
                    </span>
                </div>
            </div>

            {/* Info — siempre visible */}
            <div className="p-4">
                {producto.categoria && (
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-1.5">
                        {producto.categoria.nombre}
                    </p>
                )}
                <h3 className="text-white text-sm font-bold leading-tight mb-3 line-clamp-2 group-hover:text-gray-200 transition-colors min-h-[2.5rem]">
                    {producto.nombre}
                </h3>
                <div className="flex items-center gap-2">
                    <span className="text-white font-black text-lg">{producto.precio_venta}€</span>
                </div>

                {parseFloat(producto.rating_promedio) > 0 && (
                    <div className="flex items-center gap-1 mt-2">
                        <span className="text-yellow-500 text-xs">★</span>
                        <span className="text-gray-500 text-xs">{producto.rating_promedio}</span>
                        {producto.ventas_totales > 0 && (
                            <span className="text-gray-600 text-xs ml-1">({producto.ventas_totales} vendidos)</span>
                        )}
                    </div>
                )}
            </div>
        </Link>
    );
}
