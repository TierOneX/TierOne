import React from 'react';
import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { useCart } from '@/Contexts/CartContext';
import CartItem from '@/Components/Cart/CartItem';
import CartSummary from '@/Components/Cart/CartSummary';
import CartMobileFooter from '@/Components/Cart/CartMobileFooter';
import { ShoppingBag, ArrowLeft, Trophy, Coins, Gamepad2, Package } from 'lucide-react';

/** Configuración de secciones del carrito por tipo */
const SECTION_CONFIG = {
    product: {
        title: 'PRODUCTOS',
        subtitle: 'Merchandising & Gear',
        icon: Package,
        checkoutUrl: '/checkout',
        checkoutLabel: 'PAGAR PRODUCTOS',
        color: 'red',
    },
    tournament: {
        title: 'TORNEOS',
        subtitle: 'Inscripciones a competiciones',
        icon: Trophy,
        // El checkout de torneo es individual por torneo
        checkoutLabel: 'PAGAR INSCRIPCIÓN',
        color: 'amber',
    },
    hydra: {
        title: 'HYDRA COINS',
        subtitle: 'Packs de moneda virtual',
        icon: Coins,
        // El checkout de hydra es individual por pack
        checkoutLabel: 'COMPRAR PACK',
        color: 'emerald',
    },
};

/** Sección del carrito para un tipo de item */
function CartSection({ type, items, config }) {
    const Icon = config.icon;
    const colorClasses = {
        red: 'text-red-500 border-red-500/20 bg-red-500/10',
        amber: 'text-amber-500 border-amber-500/20 bg-amber-500/10',
        emerald: 'text-emerald-500 border-emerald-500/20 bg-emerald-500/10',
    };
    const colors = colorClasses[config.color] || colorClasses.red;

    return (
        <div className="space-y-4">
            {/* Header de sección */}
            <div className="flex items-center gap-4 mb-2">
                <div className={`p-2.5 rounded-xl border ${colors}`}>
                    <Icon className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="text-lg font-black uppercase italic tracking-tight text-white">
                        {config.title}
                    </h3>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                        {config.subtitle} • {items.length} {items.length === 1 ? 'artículo' : 'artículos'}
                    </p>
                </div>
            </div>

            {/* Items */}
            <div className="space-y-4">
                {items.map((item, index) => (
                    <CartItem key={item.cartId || `${item.id}-${index}`} item={item} />
                ))}
            </div>

            {/* Botón de checkout por sección */}
            <div className="pt-4 border-t border-white/5">
                {type === 'product' && (
                    <Link
                        href="/checkout"
                        className="w-full bg-red-600 hover:bg-red-500 text-white py-3.5 rounded-xl font-black text-xs uppercase tracking-[0.15em] flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-red-900/20"
                    >
                        <Package className="w-4 h-4" />
                        {config.checkoutLabel}
                    </Link>
                )}

                {type === 'tournament' && items.map(item => (
                    <Link
                        key={item.cartId}
                        href={`/tournaments/${item.torneo_id}/checkout`}
                        className="w-full bg-amber-600 hover:bg-amber-500 text-white py-3.5 rounded-xl font-black text-xs uppercase tracking-[0.15em] flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-amber-900/20 mb-2"
                    >
                        <Trophy className="w-4 h-4" />
                        {config.checkoutLabel}: {item.nombre}
                    </Link>
                ))}

                {type === 'hydra' && items.map(item => (
                    <Link
                        key={item.cartId}
                        href={`/shop/hydra-pack/${item.pack_id}/checkout`}
                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3.5 rounded-xl font-black text-xs uppercase tracking-[0.15em] flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-emerald-900/20 mb-2"
                    >
                        <Coins className="w-4 h-4" />
                        {config.checkoutLabel}: {item.nombre}
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default function Cart() {
    const { cart, cartCount, getItemsByType } = useCart();

    const productItems = getItemsByType('product');
    const tournamentItems = getItemsByType('tournament');
    const hydraItems = getItemsByType('hydra');

    // Orden de secciones a mostrar
    const sections = [
        { type: 'product', items: productItems, config: SECTION_CONFIG.product },
        { type: 'tournament', items: tournamentItems, config: SECTION_CONFIG.tournament },
        { type: 'hydra', items: hydraItems, config: SECTION_CONFIG.hydra },
    ].filter(s => s.items.length > 0);

    return (
        <MainLayout>
            <Head title="Carrito" />

            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-32 lg:pb-12">
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500 mb-8">
                    <Link href="/shop" className="hover:text-white transition-colors">TIENDA</Link>
                    <span className="text-gray-700">/</span>
                    <span className="text-red-500">TU ARSENAL</span>
                </nav>

                {/* Header de la página */}
                <div className="mb-12">
                    <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter text-white mb-4">
                        CARRITO
                    </h1>
                    <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">
                        Listo para dominar. {cartCount} {cartCount === 1 ? 'artículo premium asegurado' : 'artículos premium asegurados'}.
                    </p>
                </div>

                {cart.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 bg-[#111111] rounded-3xl border border-dashed border-white/10">
                        <div className="bg-[#1a1a1a] p-6 rounded-full mb-6">
                            <ShoppingBag className="w-12 h-12 text-gray-600" />
                        </div>
                        <h2 className="text-2xl font-black text-white mb-2 uppercase italic">Tu arsenal está vacío</h2>
                        <p className="text-gray-500 font-medium mb-8">Consigue algo de equipo y vuelve a la partida.</p>
                        <Link
                            href="/shop"
                            className="bg-white text-black px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all flex items-center gap-2 group mb-4"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            VOLVER A LA TIENDA
                        </Link>
                        
                        <Link 
                            href="/profile?tab=compras" 
                            className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-white transition-colors"
                        >
                            VER HISTORIAL DE COMPRAS
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
                        {/* Lista de productos agrupados por tipo */}
                        <div className="lg:col-span-2 space-y-10">
                            {sections.map(({ type, items, config }) => (
                                <CartSection key={type} type={type} items={items} config={config} />
                            ))}

                            <div className="pt-6 border-t border-white/5 flex justify-between items-center mb-12">
                                <Link
                                    href="/shop"
                                    className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors group"
                                >
                                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                    CONTINUAR COMPRANDO
                                </Link>
                                <p className="text-[10px] text-gray-600 font-medium italic">
                                    Precios mostrados en EUR e incluyen impuestos aplicables.
                                </p>
                            </div>

                            {/* Resumen detallado en móvil */}
                            <div className="lg:hidden mt-8">
                                <CartSummary />
                            </div>
                        </div>

                        {/* Resumen - Solo Desktop */}
                        <div className="hidden lg:block lg:col-span-1">
                            <CartSummary />
                        </div>
                    </div>
                )}
            </div>

            {/* Footer Móvil - Solo aparece si hay items */}
            {cart.length > 0 && <CartMobileFooter />}
        </MainLayout>
    );
}
