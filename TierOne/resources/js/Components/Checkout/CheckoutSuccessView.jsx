import React from 'react';
import { Link } from '@inertiajs/react';
import { CheckCircle } from 'lucide-react';

/**
 * Vista de pago exitoso.
 *
 * Props:
 *  - numeroOrden {string|null} Número legible de la orden
 */
export default function CheckoutSuccessView({ numeroOrden }) {
    return (
        <div className="flex flex-col items-center text-center py-12">

            {/* Icono con animación */}
            <div className="relative mb-8">
                <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping" />
                <div className="relative bg-green-500/10 p-6 rounded-full">
                    <CheckCircle className="w-16 h-16 text-green-500" />
                </div>
            </div>

            <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-white mb-4">
                ¡LISTO!
            </h2>
            <p className="text-lg font-bold text-gray-300 mb-2">
                Tu pedido ha sido confirmado
            </p>
            <p className="text-gray-500 text-sm mb-4">
                Recibirás un email con los detalles de tu compra.
            </p>

            {numeroOrden && (
                <div className="mb-8 bg-[#111111] border border-white/5 rounded-xl px-6 py-4 inline-block">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 block mb-1">
                        NÚMERO DE PEDIDO
                    </span>
                    <span className="text-lg font-black text-red-500 tracking-widest">
                        {numeroOrden}
                    </span>
                </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs">
                <Link
                    href="/shop"
                    className="flex-1 bg-[#e31837] hover:bg-[#c2102d] text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest text-center transition-all"
                >
                    SEGUIR COMPRANDO
                </Link>
                <Link
                    href="/"
                    className="flex-1 bg-white/5 hover:bg-white/10 text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest text-center transition-all border border-white/5"
                >
                    INICIO
                </Link>
            </div>
        </div>
    );
}
