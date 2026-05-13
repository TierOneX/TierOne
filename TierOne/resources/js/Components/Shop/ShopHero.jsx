import { Link } from '@inertiajs/react';

export default function ShopHero({ featuredProducts = [] }) {
    return (
        <section className="relative overflow-hidden border-b border-white/5 bg-[radial-gradient(circle_at_top_left,_rgba(227,24,55,0.36),_transparent_52%),radial-gradient(circle_at_78%_22%,_rgba(227,24,55,0.18),_transparent_46%),linear-gradient(180deg,_#151515_0%,_#090909_100%)] px-4 pb-16 pt-20 sm:px-6 lg:px-8">
            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
            
            <div className="mx-auto max-w-[1400px] relative z-10">
                <div className="grid lg:grid-cols-[1fr_auto] gap-12 items-center">
                    <div className="max-w-2xl">
                        <p className="mb-3 text-[10px] font-black uppercase tracking-[0.4em] text-red-500">
                            TierOne Official Store
                        </p>
                        <h1 className="text-4xl md:text-7xl font-black uppercase italic tracking-tighter text-white leading-[0.85]">
                            Equípate para <br />
                            <span className="text-red-600 drop-shadow-[0_0_30px_rgba(220,38,38,0.4)]">la victoria</span>
                        </h1>
                        <p className="mt-8 max-w-lg text-lg font-medium leading-relaxed text-gray-400">
                            Desde periféricos de alto rendimiento hasta merchandising exclusivo. 
                            Lleva tu juego al siguiente nivel.
                        </p>
                        
                        <div className="mt-10 flex flex-wrap gap-4">
                            <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-sm">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">Stock disponible</span>
                            </div>
                        </div>
                    </div>

                    {/* Featured Products Grid */}
                    <div className="grid grid-cols-2 gap-4 max-w-xl w-full">
                        {featuredProducts.length > 0 ? featuredProducts.map((product) => (
                            <Link 
                                key={product.id}
                                href={route('product.show', product.slug || product.id)}
                                className="group relative aspect-square overflow-hidden rounded-[32px] border border-white/10 bg-black/40 backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:border-red-500/50"
                            >
                                <img 
                                    src={product.imagen_url || '/images/placeholder.jpg'} 
                                    className="absolute inset-0 w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-110 group-hover:opacity-100" 
                                    alt={product.nombre} 
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                                <div className="absolute bottom-4 left-4 right-4">
                                    <p className="text-[8px] font-black uppercase tracking-widest text-red-500 mb-1">{product.categoria?.nombre}</p>
                                    <h3 className="text-sm font-black text-white uppercase italic leading-tight truncate">{product.nombre}</h3>
                                    <div className="mt-2 flex items-center justify-between">
                                        <p className="text-xs font-black text-white">{parseFloat(product.precio_venta).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</p>
                                        <div className="w-6 h-6 rounded-lg bg-red-600 flex items-center justify-center text-[10px] font-black text-white opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
                                            +
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        )) : (
                            <div className="col-span-2 p-12 rounded-[32px] border border-dashed border-white/10 bg-white/[0.02] text-center">
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Descubriendo novedades...</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
