import React from 'react';
import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import { useCart } from '@/Contexts/CartContext';

export default function CartMobileFooter() {
    const { subtotal } = useCart();

    const shipping = 0;
    const taxRate = 0.08;
    const tax = subtotal * taxRate;
    const total = subtotal + shipping + tax;

    return (
        <div className="lg:hidden fixed bottom-16 left-0 right-0 z-[60] bg-[#0a0a0a]/95 backdrop-blur-xl border-t border-white/10 px-4 py-4 safe-bottom shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
            <div className="max-w-md mx-auto flex items-center justify-between gap-4">
                <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 block mb-0.5">TOTAL</span>
                    <span className="text-2xl font-black text-white">€{total.toFixed(2)}</span>
                </div>

                <Link
                    href="/checkout"
                    id="btn-pagar-movil"
                    className="flex-grow bg-[#e31837] text-white py-4 px-6 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all shadow-xl shadow-red-900/40"
                >
                    PAGAR
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
