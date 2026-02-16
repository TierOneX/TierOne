import { Link } from '@inertiajs/react';

/**
 * Props esperadas: products = [{ id, name, price, original_price, image, category, tag, tag_color }]
 * image: ruta de la imagen almacenada en la BD (ej: /storage/products/camiseta.jpg)
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
                    {products.map((product) => (
                        <Link
                            key={product.id}
                            href={`/shop/${product.id}`}
                            className="group relative rounded-xl overflow-hidden border border-white/5 hover:border-[#e31837]/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-red-900/10"
                            style={{ background: '#1a1a1e' }}
                        >
                            {/* Tag */}
                            {product.tag && (
                                <span className="absolute top-3 left-3 z-10 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded text-white"
                                    style={{ background: product.tag_color || '#e31837' }}>
                                    {product.tag}
                                </span>
                            )}

                            {/* Imagen del producto */}
                            <div className="relative aspect-square overflow-hidden" style={{ background: '#1C1C20' }}>
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                                    <span className="text-white text-xs font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 bg-[#e31837] px-5 py-2.5 rounded">
                                        Ver producto
                                    </span>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="p-4">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-1.5">
                                    {product.category}
                                </p>
                                <h3 className="text-white text-sm font-bold leading-tight mb-3 line-clamp-2 group-hover:text-gray-200 transition-colors min-h-[2.5rem]">
                                    {product.name}
                                </h3>
                                <div className="flex items-center gap-2">
                                    <span className="text-white font-black text-lg">{product.price}€</span>
                                    {product.original_price && (
                                        <span className="text-gray-600 text-sm line-through">{product.original_price}€</span>
                                    )}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
