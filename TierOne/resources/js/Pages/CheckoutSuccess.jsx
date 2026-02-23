import React, { useEffect, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { CheckCircle, Package, Loader2, XCircle } from 'lucide-react';
import { useCart } from '@/Contexts/CartContext';

/**
 * Página de confirmación post-pago.
 *
 * Se llega aquí de dos formas:
 *  1. Redirección de Stripe tras autenticación 3DS (?payment_intent=pi_xxx&order_id=xxx)
 *  2. Navegación directa desde Checkout.jsx tras pago sin 3DS (state manejado allí)
 */
export default function CheckoutSuccess() {
    const { clearCart } = useCart();

    const [status, setStatus] = useState('loading'); // loading | success | failed
    const [ordenId, setOrdenId] = useState(null);
    const [orderNum, setOrderNum] = useState(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const paymentIntentId = params.get('payment_intent');
        const paymentIntentStatus = params.get('redirect_status');
        const orderId = params.get('order_id');

        // Si Stripe redirigió aquí con parámetros de redirect
        if (paymentIntentStatus === 'succeeded') {
            clearCart();
            setOrdenId(orderId);
            setStatus('success');

            // Obtener número de orden del backend
            if (orderId) {
                fetch(`/stripe/orden/${orderId}`, {
                    headers: { 'Accept': 'application/json' },
                })
                    .then(r => r.json())
                    .then(data => {
                        if (data.success) {
                            setOrderNum(data.data?.numero_orden);
                        }
                    })
                    .catch(() => { });
            }
            return;
        }

        if (paymentIntentStatus === 'requires_payment_method') {
            setStatus('failed');
            return;
        }

        // Sin parámetros: puede que lleguen aquí por navegación directa
        // tras un pago ya completado dentro de Checkout.jsx
        setStatus('success');
    }, []);

    return (
        <MainLayout>
            <Head title={status === 'success' ? '¡Pedido confirmado! — TierOne' : 'Pago fallido — TierOne'} />

            <div className="max-w-[700px] mx-auto px-4 sm:px-6 py-24 flex flex-col items-center text-center">

                {status === 'loading' && (
                    <>
                        <Loader2 className="w-16 h-16 text-red-500 animate-spin mb-6" />
                        <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">
                            Verificando tu pago...
                        </p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        {/* Icono animado */}
                        <div className="relative mb-8">
                            <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping" />
                            <div className="relative bg-green-500/10 p-6 rounded-full">
                                <CheckCircle className="w-16 h-16 text-green-500" />
                            </div>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter text-white mb-4">
                            ¡LISTO!
                        </h1>
                        <p className="text-xl font-bold text-gray-300 mb-3">
                            Tu pedido ha sido confirmado
                        </p>
                        <p className="text-gray-500 text-sm mb-2">
                            Recibirás un email con los detalles de tu compra.
                        </p>

                        {orderNum && (
                            <div className="my-6 bg-[#111111] border border-white/5 rounded-xl px-6 py-4 inline-block">
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 block mb-1">
                                    NÚMERO DE PEDIDO
                                </span>
                                <span className="text-lg font-black text-red-500 tracking-widest">
                                    {orderNum}
                                </span>
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm mt-4">
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
                                IR AL INICIO
                            </Link>
                        </div>
                    </>
                )}

                {status === 'failed' && (
                    <>
                        <div className="bg-red-500/10 p-6 rounded-full mb-8">
                            <XCircle className="w-16 h-16 text-red-500" />
                        </div>

                        <h1 className="text-5xl font-black italic uppercase tracking-tighter text-white mb-4">
                            PAGO FALLIDO
                        </h1>
                        <p className="text-gray-400 mb-8">
                            No pudimos procesar tu pago. Por favor, inténtalo de nuevo.
                        </p>

                        <Link
                            href="/cart"
                            className="bg-[#e31837] hover:bg-[#c2102d] text-white px-10 py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all"
                        >
                            VOLVER AL CARRITO
                        </Link>
                    </>
                )}
            </div>
        </MainLayout>
    );
}
