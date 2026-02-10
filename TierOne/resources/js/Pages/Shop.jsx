import { Head } from '@inertiajs/react';
import { useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';

export default function Shop({ productos = [] }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('ALL');
    const [showFilter, setShowFilter] = useState(false);

    // Datos Mock para visualización (se usan si no hay productos de la BD)
    const mockProducts = [
        {
            id: 1,
            nombre: 'TIERONE PRO JERSEY',
            categoria: { nombre: 'JERSEYS' },
            precio_venta: 85.00,
            precio_proveedor: 110.00,
            imagen_principal: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=800&auto=format&fit=crop',
            destacado: true
        },
        {
            id: 2,
            nombre: 'STEALTH BOMBER JACKET',
            categoria: { nombre: 'HOODIES' },
            precio_venta: 150.00,
            precio_proveedor: 120.00,
            imagen_principal: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800&auto=format&fit=crop',
            destacado: true
        },
        {
            id: 3,
            nombre: 'ELITE JOGGERS',
            categoria: { nombre: 'BOTTOMS' },
            precio_venta: 75.00,
            precio_proveedor: 90.00,
            imagen_principal: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?q=80&w=800&auto=format&fit=crop',
            destacado: false
        },
        {
            id: 4,
            nombre: 'CHAMPIONSHIP CAP',
            categoria: { nombre: 'HEADWEAR' },
            precio_venta: 35.00,
            precio_proveedor: 25.00,
            imagen_principal: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=800&auto=format&fit=crop',
            destacado: true
        }
    ];

    const displayProducts = productos.length > 0 ? productos : mockProducts;

    const categories = [
        'ALL', 'HOODIES', 'JERSEYS', 'BOTTOMS', 'ACCESSORIES', 'HEADWEAR',
    ];

    return (
        <MainLayout>
            <Head title="Shop - TierOne" />

            {/* Hero Section */}
            <section className="bg-gradient-to-b from-black via-gray-900 to-[#0a0a0a] pt-12 pb-16 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8 relative">
                        <h1 className="text-5xl md:text-7xl font-black mb-4 bg-gradient-to-r from-white via-gray-300 to-gray-500 bg-clip-text text-transparent italic tracking-tighter">
                            TIERONE
                        </h1>
                        <p className="text-gray-400 text-lg max-w-2xl font-medium">
                            Premium gaming performance meets high-end street fashion. <br />
                            <span className="text-red-500">Gear up for the next drop.</span>
                        </p>
                    </div>

                    {/* Search and Filter */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-8">
                        <div className="flex-1 relative">
                            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search exclusive drops..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all"
                            />
                        </div>
                        <button
                            onClick={() => setShowFilter(!showFilter)}
                            className="bg-red-600 hover:bg-red-700 px-8 py-4 rounded-xl flex items-center justify-center gap-2 font-bold transition-all hover:scale-105 active:scale-95"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                            </svg>
                            <span>FILTER</span>
                        </button>
                    </div>

                    {/* Category Pills */}
                    <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`px-6 py-2.5 rounded-full font-bold text-sm whitespace-nowrap transition-all border ${activeCategory === category
                                    ? 'bg-white text-black border-white'
                                    : 'bg-transparent text-gray-400 border-gray-700 hover:border-gray-500 hover:text-white'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Products Grid */}
            <section className="px-4 py-8">
                <div className="max-w-7xl mx-auto">
                    {displayProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {displayProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 border border-dashed border-gray-800 rounded-3xl bg-white/5">
                            <div className="text-6xl mb-4">👾</div>
                            <h3 className="text-2xl font-bold text-white mb-2">No products found</h3>
                            <p className="text-gray-500">Inventory is empty. Wait for the next drop.</p>
                        </div>
                    )}

                    {/* Load More */}
                    {displayProducts.length > 0 && (
                        <div className="mt-16 text-center">
                            <div className="mb-4 text-gray-500 text-xs font-bold tracking-widest uppercase">
                                Showing {displayProducts.length} items
                            </div>
                            <div className="w-64 mx-auto bg-gray-800 rounded-full h-1 mb-8 overflow-hidden">
                                <div className="bg-red-600 h-full w-1/3"></div>
                            </div>
                            <button className="bg-transparent border border-gray-700 hover:border-white text-white px-10 py-4 rounded-xl font-bold transition-all hover:bg-white/5 tracking-widest text-sm">
                                LOAD MORE
                            </button>
                        </div>
                    )}
                </div>
            </section>
        </MainLayout>
    );
}

function ProductCard({ product }) {
    const [isHovered, setIsHovered] = useState(false);

    // Safety check for prices
    const precioVenta = parseFloat(product.precio_venta || 0);
    const precioProveedor = parseFloat(product.precio_proveedor || 0);
    const hasDiscount = precioProveedor > precioVenta;

    return (
        <div
            className="group cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="relative overflow-hidden rounded-2xl bg-[#111] border border-gray-800 group-hover:border-red-600/50 transition-all duration-300 mb-4 aspect-[4/5]">
                {/* Badges */}
                {product.destacado && (
                    <div className="absolute top-3 left-3 z-10">
                        <span className="bg-red-600 text-white text-[10px] font-black px-2 py-1 rounded uppercase tracking-wider">
                            Tournament Discount
                        </span>
                    </div>
                )}

                {/* Image Area */}
                <div className="w-full h-full flex items-center justify-center p-6 bg-gradient-to-br from-[#151515] to-[#050505]">
                    {product.imagen_principal ? (
                        <img
                            src={product.imagen_principal}
                            alt={product.nombre}
                            className={`w-full h-full object-contain transition-transform duration-500 ease-out ${isHovered ? 'scale-110' : 'scale-100'}`}
                        />
                    ) : (
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                    )}
                </div>

                {/* Quick View Button */}
                <div className={`absolute inset-x-0 bottom-4 flex justify-center transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <button className="bg-white text-black px-6 py-2 rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-red-600 hover:text-white transition-colors shadow-lg shadow-black/50">
                        Quick View
                    </button>
                </div>
            </div>

            {/* Info */}
            <div className="space-y-1">
                <h3 className="font-bold text-gray-200 group-hover:text-red-500 transition-colors truncate">
                    {product.nombre || 'Product Name'}
                </h3>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">
                    {product.categoria?.nombre || 'Category'}
                </p>
                <div className="flex items-center gap-3 pt-1">
                    <span className="text-white font-bold text-lg">
                        ${precioVenta.toFixed(2)}
                    </span>
                    {hasDiscount && (
                        <span className="text-gray-600 line-through text-sm font-medium">
                            ${precioProveedor.toFixed(2)}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
