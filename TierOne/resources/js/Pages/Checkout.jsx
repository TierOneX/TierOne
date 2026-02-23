import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { useCart } from '@/Contexts/CartContext';

// Sub-componentes de Checkout
import CheckoutForm from '@/Components/Checkout/CheckoutForm';
import CheckoutOrderSummary from '@/Components/Checkout/CheckoutOrderSummary';
import CheckoutSuccessView from '@/Components/Checkout/CheckoutSuccessView';
import CheckoutErrorView from '@/Components/Checkout/CheckoutErrorView';
import CheckoutLoadingView from '@/Components/Checkout/CheckoutLoadingView';

// Instancia de Stripe (singleton fuera del componente)
let stripePromise = null;
const getStripe = (key) => {
    if (!stripePromise && key) stripePromise = loadStripe(key);
    return stripePromise;
};

// ─────────────────────────────────────────────────────────────────────────────
export default function Checkout({ stripeKey }) {
    const { cart, subtotal, clearCart } = useCart();

    // Estados del proceso: idle → loading → form → success | error
    const [step, setStep] = useState('idle');
    const [clientSecret, setClientSecret] = useState(null);
    const [orderData, setOrderData] = useState(null);
    const [initError, setInitError] = useState(null);

    const taxRate = 0.08;
    const total = subtotal + subtotal * taxRate;

    // Al montar: si hay items, crear PaymentIntent en el backend
    useEffect(() => {
        if (cart.length === 0) { setStep('empty'); return; }

        setStep('loading');

        const items = cart.map(item => ({
            id: item.id,
            cantidad: item.quantity,
            id_variante: item.variant?.id ?? null,
        }));

        fetch('/stripe/create-intent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content ?? '',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ items }),
        })
            .then(res => res.json())
            .then(data => {
                if (data.success && data.data?.client_secret) {
                    setClientSecret(data.data.client_secret);
                    setOrderData(data.data);
                    setStep('form');
                } else {
                    setInitError(data.message ?? 'Error al inicializar el pago.');
                    setStep('error');
                }
            })
            .catch(() => {
                setInitError('No se pudo conectar con el servidor de pagos.');
                setStep('error');
            });
    }, []);

    const handlePaymentSuccess = (orderId, numeroOrden) => {
        clearCart();
        setOrderData(prev => ({ ...prev, orderId, numeroOrden }));
        setStep('success');
    };

    const stripeInstance = getStripe(stripeKey);

    // ── Carrito vacío ──────────────────────────────────────────────────────────
    if (step === 'empty') {
        return (
            <MainLayout>
                <Head title="Checkout — TierOne" />
                <div className="max-w-[600px] mx-auto px-4 py-24 flex flex-col items-center text-center">
                    <div className="bg-[#1a1a1a] p-6 rounded-full mb-6">
                        <ShoppingBag className="w-12 h-12 text-gray-600" />
                    </div>
                    <h1 className="text-3xl font-black uppercase italic text-white mb-2">Carrito vacío</h1>
                    <p className="text-gray-500 mb-8">Añade productos antes de proceder al pago.</p>
                    <Link
                        href="/shop"
                        className="bg-white text-black px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
                    >
                        IR A LA TIENDA
                    </Link>
                </div>
            </MainLayout>
        );
    }

    // ── Pago exitoso ──────────────────────────────────────────────────────────
    if (step === 'success') {
        return (
            <MainLayout>
                <Head title="¡Pedido confirmado! — TierOne" />
                <div className="max-w-[700px] mx-auto px-4 sm:px-6 py-12">
                    <CheckoutSuccessView numeroOrden={orderData?.numero_orden ?? orderData?.numeroOrden} />
                </div>
            </MainLayout>
        );
    }

    // ── Vista principal (loading / error / formulario) ─────────────────────────
    return (
        <MainLayout>
            <Head title="Checkout — TierOne" />

            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12">

                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500 mb-8">
                    <Link href="/cart" className="hover:text-white transition-colors">CARRITO</Link>
                    <span className="text-gray-700">/</span>
                    <span className="text-red-500">PAGO</span>
                </nav>

                {/* Título */}
                <div className="mb-10">
                    <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter text-white mb-2">
                        CHECKOUT
                    </h1>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">
                        Paso final — confirma tu pedido
                    </p>
                </div>

                {/* Layout 3+2 columnas */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">

                    {/* Columna principal: formulario */}
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
                                    total={orderData?.total ?? total}
                                    onSuccess={handlePaymentSuccess}
                                />
                            </Elements>
                        )}

                        {/* Volver al carrito */}
                        <Link
                            href="/cart"
                            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-600 hover:text-white transition-colors group"
                        >
                            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                            Volver al carrito
                        </Link>
                    </div>

                    {/* Columna lateral: resumen del pedido */}
                    <div className="lg:col-span-2">
                        <CheckoutOrderSummary />
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
