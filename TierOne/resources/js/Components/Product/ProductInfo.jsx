/**
 * Info principal del producto: nombre, categoría, precio, rating.
 */
export default function ProductInfo({ producto }) {
    const ratingStars = Math.round(parseFloat(producto.rating_promedio || 0));

    return (
        <div>
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">
                <a href="/shop" className="hover:text-white transition-colors">Shop</a>
                <span>›</span>
                {producto.categoria && (
                    <>
                        <span className="hover:text-white transition-colors">{producto.categoria.nombre}</span>
                        <span>›</span>
                    </>
                )}
                <span className="text-gray-400 truncate max-w-[200px]">{producto.nombre}</span>
            </nav>

            {/* Badge + Rating */}
            <div className="flex items-center justify-between mb-2">
                {producto.destacado && (
                    <span className="text-[#e31837] text-xs font-black uppercase tracking-widest">
                        EDICIÓN LIMITADA
                    </span>
                )}
                {ratingStars > 0 && (
                    <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                            <span key={i} className={`text-sm ${i < ratingStars ? 'text-red-500' : 'text-gray-700'}`}>★</span>
                        ))}
                    </div>
                )}
            </div>

            {/* Nombre */}
            <h1 className="text-3xl md:text-4xl font-black uppercase italic text-white leading-tight mb-4">
                {producto.nombre}
            </h1>

            {/* Precio */}
            <div className="flex items-baseline gap-3 mb-6">
                <span className="text-3xl font-black text-white">{producto.precio_venta}€</span>
                {parseFloat(producto.precio_proveedor) > 0 && parseFloat(producto.precio_proveedor) < parseFloat(producto.precio_venta) && (
                    <span className="text-lg text-gray-500">Precio estándar</span>
                )}
            </div>
        </div>
    );
}
