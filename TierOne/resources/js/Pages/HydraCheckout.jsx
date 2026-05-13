import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { ArrowLeft, Wallet, Coins, Zap } from 'lucide-react';

// Sub-componentes
import CheckoutForm from '@/Components/Checkout/CheckoutForm';
import CheckoutOrderSummary from '@/Components/Checkout/CheckoutOrderSummary';
import CheckoutLoadingView from '@/Components/Checkout/CheckoutLoadingView';
import CheckoutErrorView from '@/Components/Checkout/CheckoutErrorView';

let stripePromise = null;
const getStripe = (key) => {
    if (!stripePromise && key) stripePromise = loadStripe(key);
    return stripePromise;
};

export default function HydraCheckout({ pack, stripeKey }) {
    const [step, setStep] = useState('loading');
    const [clientSecret, setClientSecret] = useState(null);
    const [orderData, setOrderData] = useState(null);
    const [initError, setInitError] = useState(null);

    useEffect(() => {
        fetch('/stripe/create-intent-hydra', {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content ?? '',
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ 
                pack_id: pack.id,
                hc_amount: pack.hc,
                price: pack.price,
                name: pack.name
            }),
        })
            .then(async (res) => {
                const data = await res.json();
                if (res.ok && data.success && data.data?.client_secret) {
                    setClientSecret(data.data.client_secret);
                    setOrderData(data.data);
                    setStep('form');
                } else {
                    setInitError(data.message || `Error del servidor (${res.status}).`);
                    setStep('error');
                }
            })
            .catch(() => {
                setInitError('No se pudo conectar con el servidor de pagos.');
                setStep('error');
            });
    }, [pack.id]);

    const handlePaymentSuccess = (orderId, numeroOrden) => {
        if (orderId) {
            window.open(`/orders/${orderId}/invoice`, '_blank');
        }
        setOrderData(prev => ({ ...prev, orderId, numeroOrden }));
        setStep('success');
    };

    const stripeInstance = getStripe(stripeKey);

    if (step === 'success') {
        return (
            <MainLayout>
                <Head title="¡Compra Completada! — TierOne" />
                <div className="max-w-[700px] mx-auto px-4 py-24">
                    <div className="bg-[#0a0a0a] border border-white/5 rounded-[32px] p-8 md:p-12 text-center shadow-2xl">
                        <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-8">
                            <Coins className="w-10 h-10 text-emerald-500" />
                        </div>
                        <h1 className="text-4xl font-black uppercase italic text-white mb-4">¡Energía Recargada!</h1>
                        <p className="text-gray-400 mb-8 max-w-md mx-auto">
                            Has adquirido correctamente <strong>{pack.hc.toLocaleString()} Hydra Coins</strong>. 
                            Tu saldo ha sido actualizado y hemos generado tu factura <span className="text-white font-mono">#{orderData?.numero_orden}</span>.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                            <a
                                href={`/orders/${orderData?.orderId}/invoice`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-red-500 text-white px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-red-600 transition-all flex items-center justify-center gap-2"
                            >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M7.5 12 12 16.5m0 0L16.5 12M12 16.5V3" />
                                </svg>
                                DESCARGAR FACTURA
                            </a>
                            <Link
                                href="/shop"
                                className="bg-white/5 text-white border border-white/10 px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all text-center"
                            >
                                IR A LA TIENDA
                            </Link>
                        </div>
                    </div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <Head title={`Comprar Hydra Coins: ${pack.name} — TierOne`} />

            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500 mb-8">
                    <Link href="/shop" className="hover:text-white transition-colors">TIENDA</Link>
                    <span className="text-gray-700">/</span>
                    <span className="text-red-500">HYDRA PACKS</span>
                </nav>

                <div className="mb-10">
                    <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter text-white mb-2">
                        RECARGA
                    </h1>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">
                        Adquiere Hydra Coins para participar en la competición
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
                    {/* Formulario */}
                    <div className="lg:col-span-3 space-y-6">
                        {step === 'loading' && <CheckoutLoadingView />}
                        {step === 'error' && <CheckoutErrorView message={initError} />}
                        {step === 'form' && clientSecret && (
                            <Elements
                                stripe={stripeInstance}
                                options={{
                                    clientSecret,
                                    appearance: {
                                        theme: 'night',
                                        variables: {
                                            colorPrimary: '#e31837',
                                            colorBackground: '#0a0a0a',
                                            colorText: '#ffffff',
                                        },
                                    },
                                }}
                            >
                                <CheckoutForm
                                    orderId={orderData?.order_id}
                                    numeroOrden={orderData?.numero_orden}
                                    total={orderData?.total}
                                    onSuccess={handlePaymentSuccess}
                                />
                            </Elements>
                        )}
                    </div>

                    {/* Resumen del Pedido */}
                    <div className="lg:col-span-2">
                        <CheckoutOrderSummary 
                            manualItems={[{
                                id: pack.id,
                                nombre: `Pack ${pack.name}: ${pack.hc.toLocaleString()} Hydra Coins`,
                                quantity: 1,
                                precio_venta: pack.price,
                                imagenes: [{ url_imagen: '/assets/hydra-coin.png' }]
                            }]}
                            manualSubtotal={Number(pack.price)}
                        />
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
