import React from 'react';
import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { useCart } from '@/Contexts/CartContext';
import CartItem from '@/Components/Cart/CartItem';
import CartSummary from '@/Components/Cart/CartSummary';
import CartMobileFooter from '@/Components/Cart/CartMobileFooter';
import { ShoppingBag, ArrowLeft } from 'lucide-react';

export default function Cart() {
    const { cart, cartCount } = useCart();

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
                        {/* Lista de productos */}
                        <div className="lg:col-span-2 space-y-6">
                            {cart.map((item, index) => (
                                <CartItem key={`${item.id}-${index}`} item={item} />
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
                                    Precios mostrados en USD e incluyen impuestos aplicables.
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
