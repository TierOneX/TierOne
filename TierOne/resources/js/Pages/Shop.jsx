import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Shop({ auth, productos = [] }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('ALL GEAR');
    const [showFilter, setShowFilter] = useState(false);

    const categories = [
        'ALL GEAR',
        'HOODIES',
        'JERSEYS',
        'BOTTOMS',
        'ACCESSORIES',
        'HEADWEAR',
    ];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Shop</h2>}
        >
            <Head title="Shop - TierOne" />

            <div className="min-h-screen bg-[#0a0a0a] text-white">
                {/* Hero Section */}
                <section className="bg-gradient-to-b from-black via-gray-900 to-[#0a0a0a] pt-8 pb-12 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="mb-6">
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-3 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent italic tracking-tight">
                                TIERONE
                            </h1>
                            <p className="text-gray-400 text-base sm:text-lg max-w-2xl">
                                Premium gaming performance meets high-end street fashion. Gear up for the next drop.
                            </p>
                        </div>

                        {/* Search and Filter */}
                        <div className="flex gap-3 mb-6">
                            <div className="flex-1 relative">
                                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Search exclusive drops..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-black/50 border border-gray-800 rounded-lg pl-12 pr-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all"
                                />
                            </div>
                            <button
                                onClick={() => setShowFilter(!showFilter)}
                                className="bg-red-600 hover:bg-red-700 px-4 sm:px-6 rounded-lg flex items-center gap-2 font-bold transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                                </svg>
                                <span className="hidden sm:inline">FILTER</span>
                            </button>
                        </div>

                        {/* Category Pills */}
                        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setActiveCategory(category)}
                                    className={`px-5 py-2.5 rounded-full font-bold text-sm whitespace-nowrap transition-all ${activeCategory === category
                                        ? 'bg-red-600 text-white shadow-lg shadow-red-600/50'
                                        : 'bg-gray-800/50 text-gray-300 hover:bg-gray-800 border border-gray-700'
                                        }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Products Grid */}
                <section className="px-4 sm:px-6 lg:px-8 py-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                            {productos.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>

                        {/* Load More */}
                        <div className="mt-12 text-center">
                            <div className="mb-4 text-gray-500 text-sm">
                                SHOWING {productos.length} OF {productos.length} ITEMS
                            </div>
                            <div className="w-full bg-gray-800 rounded-full h-1 mb-6 overflow-hidden">
                                <div className="bg-gradient-to-r from-red-600 to-red-500 h-full" style={{ width: '100%' }}></div>
                            </div>
                            <button className="bg-transparent border-2 border-gray-700 hover:border-white text-white px-8 sm:px-12 py-3 sm:py-4 rounded-lg font-bold transition-all hover:bg-white/5 tracking-wider text-sm sm:text-base">
                                LOAD MORE DROPS
                            </button>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-black border-t border-gray-800 mt-16 px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-8">
                            {/* Brand */}
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center">
                                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 2L2 7L12 12L22 7L12 2Z" />
                                            <path d="M2 17L12 22L22 17V12L12 17L2 12V17Z" opacity="0.7" />
                                        </svg>
                                    </div>
                                    <span className="text-xl font-bold">TIERONE</span>
                                </div>
                                <p className="text-gray-500 text-sm leading-relaxed">
                                    The premier destination for competitive gaming and streetwear. Built for the elite.
                                </p>
                            </div>

                            {/* Shop Links */}
                            <div>
                                <h3 className="font-bold mb-4 text-sm tracking-wider">SHOP</h3>
                                <ul className="space-y-2 text-sm text-gray-400">
                                    <li><a href="#" className="hover:text-white transition-colors">New Arrivals</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Best Sellers</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Collections</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Limited Drops</a></li>
                                </ul>
                            </div>

                            {/* Company Links */}
                            <div>
                                <h3 className="font-bold mb-4 text-sm tracking-wider">COMPANY</h3>
                                <ul className="space-y-2 text-sm text-gray-400">
                                    <li><a href="#" className="hover:text-white transition-colors">About TierOne</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Sustainability</a></li>
                                </ul>
                            </div>

                            {/* Newsletter */}
                            <div>
                                <h3 className="font-bold mb-4 text-sm tracking-wider">NEWSLETTER</h3>
                                <p className="text-gray-500 text-sm mb-4">
                                    GET EARLY ACCESS TO EXCLUSIVE DROPS.
                                </p>
                                <div className="flex gap-2">
                                    <input
                                        type="email"
                                        placeholder="Email Address"
                                        className="flex-1 bg-gray-900 border border-gray-800 rounded px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-600"
                                    />
                                    <button className="bg-red-600 hover:bg-red-700 px-4 rounded font-bold text-sm transition-colors">
                                        JOIN
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Bar */}
                        <div className="border-t border-gray-800 pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs sm:text-sm text-gray-500">
                            <div>© 2024 TIERONE GAMING APPAREL. ALL RIGHTS RESERVED.</div>
                            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                                <a href="#" className="hover:text-white transition-colors">PRIVACY POLICY</a>
                                <a href="#" className="hover:text-white transition-colors">TERMS OF SERVICE</a>
                                <a href="#" className="hover:text-white transition-colors">SHIPPING & RETURNS</a>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </AuthenticatedLayout>
    );
}

function ProductCard({ product }) {
    const [isHovered, setIsHovered] = useState(false);
    const hasDiscount = product.precio_proveedor && product.precio_venta < product.precio_proveedor;

    return (
        <div
            className="group cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-gray-900 to-black border border-gray-800 hover:border-red-600 transition-all duration-300 mb-4">
                {/* Badges */}
                {product.destacado && (
                    <div className="absolute top-3 left-3 z-10">
                        <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded">
                            TOURNAMENT DISCOUNT
                        </span>
                    </div>
                )}

                {/* Product Image */}
                <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-900 relative overflow-hidden">
                    {product.imagen_principal ? (
                        <img
                            src={product.imagen_principal}
                            alt={product.nombre}
                            className={`w-full h-full object-cover transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'
                                }`}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <div className="w-20 h-20 bg-gray-700/30 rounded-lg flex items-center justify-center">
                                <svg className="w-10 h-10 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                        </div>
                    )}

                    {/* Hover Overlay */}
                    <div className={`absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'
                        }`}>
                        <button className="bg-white text-black px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-bold hover:bg-red-600 hover:text-white transition-colors transform translate-y-2 group-hover:translate-y-0 text-sm sm:text-base">
                            QUICK VIEW
                        </button>
                    </div>
                </div>
            </div>

            {/* Product Info */}
            <div className="px-1">
                <h3 className="font-bold text-white mb-1 group-hover:text-red-500 transition-colors text-sm sm:text-base">
                    {product.nombre}
                </h3>
                <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide">
                    {product.categoria?.nombre || 'EXCLUSIVE'}
                </p>
                <div className="flex items-center gap-2">
                    <span className="text-red-500 font-bold text-lg sm:text-xl">
                        ${parseFloat(product.precio_venta).toFixed(2)}
                    </span>
                    {hasDiscount && (
                        <span className="text-gray-500 line-through text-xs sm:text-sm">
                            ${parseFloat(product.precio_proveedor).toFixed(2)}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
