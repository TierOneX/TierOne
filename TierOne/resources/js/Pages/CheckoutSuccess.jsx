import React, { useEffect, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { XCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { useCart } from '@/Contexts/CartContext';
import CheckoutSuccessView from '@/Components/Checkout/CheckoutSuccessView';

/**
 * Página de confirmación post-pago.
 *
 * Dos flujos de llegada:
 *  A) Stripe redirige aquí tras 3DS con ?payment_intent=pi_xxx&redirect_status=succeeded&order_id=xxx
 *  B) Navegación directa (sin parámetros) — estado ya gestionado en Checkout.jsx
 */
export default function CheckoutSuccess() {
    const { clearCart } = useCart();

    const [status, setStatus] = useState('loading');
    const [orderNum, setOrderNum] = useState(null);
    const [orderId, setOrderId] = useState(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const redirectStatus = params.get('redirect_status');
        const paymentIntent = params.get('payment_intent');
        const orderId = params.get('order_id');

        // Si volvemos de una redirección de Stripe (3DS) exitosa
        if (redirectStatus === 'succeeded' && paymentIntent) {
            clearCart();
            setStatus('loading'); // Verificando con nuestro backend...

            // ✅ Notificamos al backend para que verifique el PI y marque la orden como pagada
            fetch('/stripe/confirm', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content ?? '',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ payment_intent_id: paymentIntent }),
            })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        setOrderNum(data.data?.numero_orden);
                        setOrderId(data.data?.order_id);
                        setStatus('success');
                    } else {
                        setStatus('failed');
                    }
                })
                .catch(() => setStatus('failed'));

            return;
        }

        if (redirectStatus === 'requires_payment_method') {
            setStatus('failed');
            return;
        }

        // Sin parámetros: llegó aquí después de un pago sin 3DS ya confirmado en Checkout.jsx
        setStatus('success');
    }, []);

    return (
        <MainLayout>
            <Head title={status === 'success' ? '¡Pedido confirmado! — TierOne' : 'Pago fallido — TierOne'} />

            <div className="max-w-[700px] mx-auto px-4 sm:px-6 py-24">

                {/* Cargando */}
                {status === 'loading' && (
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="w-10 h-10 text-red-500 animate-spin" />
                        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">
                            Verificando tu pago...
                        </p>
                    </div>
                )}

                {/* Éxito */}
                {status === 'success' && (
                    <CheckoutSuccessView numeroOrden={orderNum} orderId={orderId} />
                )}

                {/* Fallido */}
                {status === 'failed' && (
                    <div className="flex flex-col items-center text-center">
                        <div className="bg-red-500/10 p-6 rounded-full mb-6">
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
                            className="flex items-center gap-2 bg-[#e31837] hover:bg-[#c2102d] text-white px-10 py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            VOLVER AL CARRITO
                        </Link>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
