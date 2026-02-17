import ProductCard from './ProductCard';

export default function ProductGrid({ productos, totalCount }) {
    if (!productos || productos.length === 0) {
        return (
            <section className="px-4 py-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center py-20 border border-dashed border-gray-800 rounded-3xl bg-white/5">
                        <div className="text-6xl mb-4">👾</div>
                        <h3 className="text-2xl font-bold text-white mb-2">No se encontraron productos</h3>
                        <p className="text-gray-500">Prueba con otro filtro o categoría.</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="product-grid-section" className="px-4 py-8">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
                    {productos.map((producto) => (
                        <ProductCard key={producto.id} producto={producto} />
                    ))}
                </div>

                {/* Contador de resultados */}
                {productos.length > 0 && (
                    <div className="mt-16 text-center">
                        <div className="mb-4 text-gray-500 text-xs font-bold tracking-widest uppercase">
                            Mostrando {productos.length} de {totalCount} productos
                        </div>
                        <div className="w-64 mx-auto bg-gray-800 rounded-full h-1 mb-8 overflow-hidden">
                            <div
                                className="bg-red-600 h-full transition-all duration-500"
                                style={{ width: `${Math.min((productos.length / totalCount) * 100, 100)}%` }}
                            />
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
