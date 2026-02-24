import React from 'react';
import { Link } from '@inertiajs/react';
import { ArrowLeft, XCircle } from 'lucide-react';

/**
 * Vista de error al inicializar el pago.
 *
 * Props:
 *  - message {string} Descripción del error
 */
export default function CheckoutErrorView({ message }) {
    return (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-4">
                <XCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
                <h3 className="text-white font-black uppercase text-sm">
                    Error al inicializar el pago
                </h3>
            </div>
            <p className="text-red-400 text-sm mb-6">{message}</p>
            <Link
                href="/cart"
                className="flex items-center gap-2 text-gray-400 hover:text-white text-xs font-black uppercase tracking-widest transition-colors group"
            >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Volver al carrito
            </Link>
        </div>
    );
}
