import React from 'react';
import { ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { useCart } from '@/Contexts/CartContext';

export default function CartSummary({ hideButton = false }) {
    const { subtotal } = useCart();


    const shipping = 0; // FREE EXPRESS en el mockup
    const taxRate = 0.08; // Ejemplo
    const tax = subtotal * taxRate;
    const total = subtotal + shipping + tax;

    return (
        <div className="space-y-6">
            <div className="bg-[#111111] rounded-2xl border border-white/5 p-8 lg:sticky lg:top-24">
                <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white mb-8">
                    RESUMEN DEL PEDIDO
                </h2>

                <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-400 font-bold uppercase text-xs tracking-widest">Subtotal</span>
                        <span className="text-white font-black">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-[#e31837]">
                        <span className="font-bold uppercase text-xs tracking-widest flex items-center gap-1.5">
                            <Zap className="w-3.5 h-3.5 fill-current" />
                            Envío
                        </span>
                        <span className="font-black text-xs">GRATIS EXPRESS</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-400 font-bold uppercase text-xs tracking-widest">Impuestos (Estimados)</span>
                        <span className="text-white font-black">${tax.toFixed(2)}</span>
                    </div>
                </div>
                {/* Total */}
                <div className="border-t border-white/5 pt-6 mb-8">
                    <div className="flex justify-between items-baseline">
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 block mb-1">TOTAL</span>
                            <span className="text-4xl font-black text-white">${total.toFixed(2)}</span>
                        </div>
                        <span className="text-[10px] font-black text-gray-500 uppercase">IVA INCLUIDO</span>
                    </div>
                </div>

                {!hideButton && (
                    <button className="w-full bg-[#e31837] hover:bg-[#c2102d] text-white py-5 rounded-xl font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-xl shadow-red-900/20">
                        PROCEDER AL PAGO
                        <ArrowRight className="w-5 h-5" />
                    </button>
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
