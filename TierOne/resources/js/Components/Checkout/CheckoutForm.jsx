import React, { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { Lock, ArrowRight, CreditCard, Loader2 } from 'lucide-react';

/**
 * Formulario de pago Stripe.
 * Debe usarse dentro de un <Elements> provider con clientSecret ya cargado.
 *
 * Props:
 *  - orderId      {number}   ID de la Orden creada en BD
 *  - numeroOrden  {string}   Número legible de la orden (ej: TIO-ABC123)
 *  - total        {number}   Total a cobrar en euros
 *  - onSuccess    {Function} Callback (orderId, numeroOrden) cuando el pago es exitoso
 */
export default function CheckoutForm({ orderId, numeroOrden, total, onSuccess }) {
    const stripe = useStripe();
    const elements = useElements();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [ready, setReady] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements || loading) return;

        setLoading(true);
        setError(null);

        const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                // Stripe redirige aquí solo si se necesita 3DS
                return_url: `${window.location.origin}/checkout/success?order_id=${orderId}`,
            },
            redirect: 'if_required',
        });

        if (stripeError) {
            setError(stripeError.message);
            setLoading(false);
            return;
        }

        if (paymentIntent?.status === 'succeeded') {
            onSuccess(orderId, numeroOrden);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">

            {/* Bloque del PaymentElement */}
            <div className="bg-[#111111] rounded-2xl border border-white/5 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-red-500/10 p-2 rounded-lg">
                        <CreditCard className="w-5 h-5 text-red-500" />
                    </div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-white">
                        Datos de Pago
                    </h3>
                </div>

                <PaymentElement
                    id="stripe-payment-element"
                    onReady={() => setReady(true)}
                    options={{
                        layout: 'tabs',
                        appearance: {
                            theme: 'night',
                            variables: {
                                colorPrimary: '#e31837',
                                colorBackground: '#111111',
                                colorText: '#ffffff',
                                colorDanger: '#e31837',
                                fontFamily: 'Inter, system-ui, sans-serif',
                                spacingUnit: '4px',
                                borderRadius: '8px',
                            },
                        },
                    }}
                />
            </div>

            {/* Mensaje de error */}
            {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                    <p className="text-red-400 text-sm font-medium">{error}</p>
                </div>
            )}

            {/* Botón confirmar */}
            <button
                type="submit"
                id="btn-confirmar-pago"
                disabled={!stripe || !ready || loading}
                className="w-full bg-[#e31837] hover:bg-[#c2102d] disabled:bg-gray-700 disabled:cursor-not-allowed text-white py-5 rounded-xl font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-xl shadow-red-900/20"
            >
                {loading ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        PROCESANDO...
                    </>
                ) : (
                    <>
                        <Lock className="w-4 h-4" />
                        PAGAR €{Number(total ?? 0).toFixed(2)}
                        <ArrowRight className="w-5 h-5" />
                    </>
                )}
            </button>

            <p className="text-center text-[10px] text-gray-600 font-medium">
                Pago procesado de forma segura por Stripe.
                TierOne no almacena tus datos de tarjeta.
            </p>
        </form>
    );
}
