import { Link } from '@inertiajs/react';

const products = [
    {
        id: 1,
        name: 'Camiseta TierOne Elite',
        price: '39.99€',
        originalPrice: '49.99€',
        tag: 'MÁS VENDIDO',
        tagColor: '#e31837',
        emoji: '👕',
        category: 'Camisetas',
    },
    {
        id: 2,
        name: 'Sudadera Pro Player',
        price: '69.99€',
        originalPrice: null,
        tag: 'NUEVO',
        tagColor: '#4040ff',
        emoji: '🧥',
        category: 'Sudaderas',
    },
    {
        id: 3,
        name: 'Gorra Snapback TierOne',
        price: '24.99€',
        originalPrice: '29.99€',
        tag: '-17%',
        tagColor: '#00c853',
        emoji: '🧢',
        category: 'Accesorios',
    },
    {
        id: 4,
        name: 'Alfombrilla XL Gaming',
        price: '29.99€',
        originalPrice: null,
        tag: null,
        tagColor: null,
        emoji: '🖱️',
        category: 'Accesorios',
    },
    {
        id: 5,
        name: 'Taza Competitiva',
        price: '14.99€',
        originalPrice: '19.99€',
        tag: 'OFERTA',
        tagColor: '#e31837',
        emoji: '☕',
        category: 'Accesorios',
    },
    {
        id: 6,
        name: 'Mochila TierOne Tactical',
        price: '59.99€',
        originalPrice: null,
        tag: 'EXCLUSIVO',
        tagColor: '#C89B3C',
        emoji: '🎒',
        category: 'Accesorios',
    },
];

export default function MerchSection() {
    return (
        <section id="merch-section" className="py-12 lg:py-20" style={{ background: '#111114' }}>
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
                    <Link
                        href="/shop"
                        className="text-sm font-bold uppercase tracking-wider text-gray-500 hover:text-[#e31837] transition-colors duration-200 flex items-center gap-2 group"
                    >
                        Ver todo
                        <svg className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>

                {/* Grid de productos */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-5">
                    {products.map((product) => (
                        <Link
                            key={product.id}
                            href={`/shop/${product.id}`}
                            id={`product-${product.id}`}
                            className="group relative rounded-xl overflow-hidden border border-white/5 hover:border-white/15 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                            style={{ background: '#1a1a1e' }}
                        >
                            {/* Tag */}
                            {product.tag && (
                                <span
                                    className="absolute top-3 left-3 z-10 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md text-white"
                                    style={{ background: product.tagColor }}
                                >
                                    {product.tag}
                                </span>
                            )}

                            {/* Imagen placeholder con emoji */}
                            <div className="relative aspect-square flex items-center justify-center overflow-hidden" style={{ background: 'linear-gradient(135deg, #1C1C20 0%, #252528 100%)' }}>
                                <span className="text-5xl lg:text-6xl transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3">
                                    {product.emoji}
                                </span>
                                {/* Overlay hover */}
                                <div className="absolute inset-0 bg-[#e31837]/0 group-hover:bg-[#e31837]/10 transition-all duration-300 flex items-center justify-center">
                                    <span className="text-white text-xs font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/60 px-4 py-2 rounded-lg backdrop-blur-sm">
                                        Ver producto
                                    </span>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="p-3 lg:p-4">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-1">
                                    {product.category}
                                </p>
                                <h3 className="text-white text-sm font-bold leading-tight mb-2 line-clamp-2 group-hover:text-gray-200 transition-colors">
                                    {product.name}
                                </h3>
                                <div className="flex items-center gap-2">
                                    <span className="text-white font-black text-base">{product.price}</span>
                                    {product.originalPrice && (
                                        <span className="text-gray-600 text-xs line-through">{product.originalPrice}</span>
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
