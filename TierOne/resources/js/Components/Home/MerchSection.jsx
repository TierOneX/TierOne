import { Link } from '@inertiajs/react';
import ProductCard from '@/Components/Shop/ProductCard';

/**
 * Secci├│n de Merchandising para la p├ígina Home.
 * Reutiliza el componente ProductCard compartido con la Shop.
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

                {/* Grid de productos ÔÇö reutiliza ProductCard de Shop */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
                    {products.map((producto) => (
                        <ProductCard key={producto.id} producto={producto} />
                    ))}
                </div>
            </div>
        </section>
    );
}
