import ProductCard from '@/Components/Shop/ProductCard';

/**
 * Sección "Completa el kit" — productos relacionados de la misma categoría.
 * Reutiliza la ProductCard de la Shop.
 */
export default function RelatedProducts({ productos }) {
    if (!productos || productos.length === 0) return null;

    return (
        <section className="py-16 border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex items-end justify-between mb-8">
                    <h2 className="text-2xl md:text-3xl font-black italic uppercase text-white">
                        COMPLETA <span className="text-[#e31837]">EL KIT</span>
                    </h2>
                    <a
                        href="/shop"
                        className="text-sm font-bold uppercase tracking-wider text-gray-500 hover:text-[#e31837] transition-colors flex items-center gap-2 group"
                    >
                        Ver colección
                        <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                    </a>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                    {productos.map((producto) => (
                        <ProductCard key={producto.id} producto={producto} />
                    ))}
                </div>
            </div>
        </section>
    );
}
