import React from 'react';
import { Link } from '@inertiajs/react';
import { CheckCircle, FileText } from 'lucide-react';

/**
 * Vista de pago exitoso.
 *
 * Props:
 *  - numeroOrden {string|null} Número legible de la orden
 *  - orderId {number|null} ID de la orden en la BD
 */
export default function CheckoutSuccessView({ numeroOrden, orderId }) {
    React.useEffect(() => {
        if (orderId) {
            // Disparar la descarga automática tras un breve delay
            const timer = setTimeout(() => {
                window.open(`/pedido/${orderId}/factura`, '_blank');
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [orderId]);

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

            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                <Link
                    href="/shop"
                    className="flex-1 bg-[#e31837] hover:bg-[#c2102d] text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest text-center transition-all shadow-lg shadow-red-500/20"
                >
                    SEGUIR COMPRANDO
                </Link>
                
                {orderId && (
                    <a
                        href={`/pedido/${orderId}/factura`}
                        target="_blank"
                        className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest text-center transition-all border border-white/10"
                        onClick={() => {
                            // Opcional: tracking de descarga
                        }}
                    >
                        <FileText className="w-4 h-4 text-red-500" />
                        DESCARGAR FACTURA
                    </a>
                )}
            </div>

            <p className="mt-8 text-gray-600 text-[10px] uppercase tracking-widest font-medium">
                Gracias por confiar en TierOne eSports
            </p>
        </div>
    );
}
