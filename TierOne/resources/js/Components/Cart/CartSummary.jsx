import React from 'react';
import { Link } from '@inertiajs/react';
import { ArrowRight, ShieldCheck, Zap, Package, Trophy, Coins } from 'lucide-react';
import { useCart } from '@/Contexts/CartContext';

export default function CartSummary({ hideButton = false }) {
    const { subtotal, getItemsByType, getSubtotalByType } = useCart();

    const productItems = getItemsByType('product');
    const tournamentItems = getItemsByType('tournament');
    const hydraItems = getItemsByType('hydra');

    const productSubtotal = getSubtotalByType('product');
    const tournamentSubtotal = getSubtotalByType('tournament');
    const hydraSubtotal = getSubtotalByType('hydra');

    const shipping = 0; // FREE EXPRESS
    const taxRate = 0.21;
    const tax = subtotal * taxRate;
    const total = subtotal + shipping + tax;

    return (
        <div className="space-y-6">
            <div className="bg-[#111111] rounded-2xl border border-white/5 p-8 lg:sticky lg:top-24">
                <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white mb-8">
                    RESUMEN DEL PEDIDO
                </h2>

                {/* Desglose por tipo */}
                <div className="space-y-3 mb-6">
                    {productItems.length > 0 && (
                        <div className="flex justify-between items-center">
                            <span className="text-gray-400 font-bold uppercase text-xs tracking-widest flex items-center gap-1.5">
                                <Package className="w-3.5 h-3.5 text-red-500" />
                                Productos ({productItems.length})
                            </span>
                            <span className="text-white font-black">€{productSubtotal.toFixed(2)}</span>
                        </div>
                    )}
                    {tournamentItems.length > 0 && (
                        <div className="flex justify-between items-center">
                            <span className="text-gray-400 font-bold uppercase text-xs tracking-widest flex items-center gap-1.5">
                                <Trophy className="w-3.5 h-3.5 text-amber-500" />
                                Torneos ({tournamentItems.length})
                            </span>
                            <span className="text-white font-black">€{tournamentSubtotal.toFixed(2)}</span>
                        </div>
                    )}
                    {hydraItems.length > 0 && (
                        <div className="flex justify-between items-center">
                            <span className="text-gray-400 font-bold uppercase text-xs tracking-widest flex items-center gap-1.5">
                                <Coins className="w-3.5 h-3.5 text-emerald-500" />
                                Hydra Coins ({hydraItems.length})
                            </span>
                            <span className="text-white font-black">€{hydraSubtotal.toFixed(2)}</span>
                        </div>
                    )}
                </div>

                <div className="space-y-4 mb-8 border-t border-white/5 pt-4">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-400 font-bold uppercase text-xs tracking-widest">Subtotal</span>
                        <span className="text-white font-black">€{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-[#e31837]">
                        <span className="font-bold uppercase text-xs tracking-widest flex items-center gap-1.5">
                            <Zap className="w-3.5 h-3.5 fill-current" />
                            Envío
                        </span>
                        <span className="font-black text-xs">GRATIS EXPRESS</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-400 font-bold uppercase text-xs tracking-widest">IVA (21%)</span>
                        <span className="text-white font-black">€{tax.toFixed(2)}</span>
                    </div>
                </div>
                {/* Total */}
                <div className="border-t border-white/5 pt-6 mb-8">
                    <div className="flex justify-between items-baseline">
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 block mb-1">TOTAL</span>
                            <span className="text-4xl font-black text-white">€{total.toFixed(2)}</span>
                        </div>
                        <span className="text-[10px] font-black text-gray-500 uppercase">IVA INCLUIDO</span>
                    </div>
                </div>

                {/* Botón principal solo para productos */}
                {!hideButton && productItems.length > 0 && (
                    <Link
                        href="/checkout"
                        id="btn-proceder-pago"
                        className="w-full bg-[#e31837] hover:bg-[#c2102d] text-white py-5 rounded-xl font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-xl shadow-red-900/20 mb-3"
                    >
                        PAGAR PRODUCTOS
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                )}

                {/* Info de pago separado para torneos y hydra */}
                {(tournamentItems.length > 0 || hydraItems.length > 0) && (
                    <p className="text-[10px] text-gray-500 font-medium text-center mt-2 leading-relaxed">
                        Torneos y Hydra Coins se pagan individualmente desde sus respectivos botones en el carrito.
                    </p>
                )}

                <div className="flex items-center justify-center gap-4 mt-8 opacity-40 grayscale hover:grayscale-0 transition-all">
                    <span className="text-[8px] font-black border border-white/20 px-2 py-1 rounded">VISA</span>
                    <span className="text-[8px] font-black border border-white/20 px-2 py-1 rounded">AMEX</span>
                    <span className="text-[8px] font-black border border-white/20 px-2 py-1 rounded">CRYPTO</span>
                </div>
            </div>

            {/* TierOne Protection */}
            <div className="bg-black/20 rounded-2xl border border-white/5 p-5 flex gap-4 items-start">
                <div className="bg-red-500/10 p-2 rounded-lg">
                    <ShieldCheck className="w-6 h-6 text-red-500" />
                </div>
                <div>
                    <h4 className="text-[11px] font-black uppercase tracking-widest text-white mb-1">PROTECCIÓN TIERONE</h4>
                    <p className="text-[10px] text-gray-500 font-medium leading-relaxed">
                        Garantía competitiva de 30 días "Sin Preguntas". Si no mejora tu juego, devuélvelo.
                    </p>
                </div>
            </div>
        </div>
    );
}
