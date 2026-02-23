import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { useCart } from '@/Contexts/CartContext';
import { loadStripe } from '@stripe/stripe-js';
import {
    Elements,
    PaymentElement,
    useStripe,
    useElements,
} from '@stripe/react-stripe-js';
import {
    ShieldCheck, Lock, ArrowLeft, ArrowRight,
    Package, CreditCard, CheckCircle, Loader2,
} from 'lucide-react';

// ─── Carga de Stripe (fuera del componente para no re-instanciar) ────────────
let stripePromise = null;
const getStripe = (key) => {
    if (!stripePromise && key) {
        stripePromise = loadStripe(key);
    }
    return stripePromise;
};

// ─── Formulario de pago (dentro del contexto Elements) ───────────────────────
function CheckoutForm({ orderId, numeroOrden, total, onSuccess }) {
    const stripe = useStripe();
    const elements = useElements();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [ready, setReady] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setLoading(true);
        setError(null);

        const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                // Stripe redirige aquí si requiere autenticación 3DS
                return_url: `${window.location.origin}/checkout/success?order_id=${orderId}`,
            },
            redirect: 'if_required', // Solo redirige si es necesario (3DS)
        });

        if (stripeError) {
            setError(stripeError.message);
            setLoading(false);
            return;
        }

        if (paymentIntent && paymentIntent.status === 'succeeded') {
            onSuccess(orderId, numeroOrden);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Stripe Payment Element */}
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

            {/* Error */}
            {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                    <p className="text-red-400 text-sm font-medium">{error}</p>
                </div>
            )}

            {/* Botón pagar */}
            <button
                type="submit"
                disabled={!stripe || !ready || loading}
                id="btn-confirmar-pago"
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
                        PAGAR €{total?.toFixed(2) ?? '0.00'}
                        <ArrowRight className="w-5 h-5" />
                    </>
                )}
            </button>

            <p className="text-center text-[10px] text-gray-600 font-medium">
                Pago procesado de forma segura por Stripe. TierOne no almacena tus datos de tarjeta.
            </p>
        </form>
    );
}

// ─── Página principal de Checkout ────────────────────────────────────────────
export default function Checkout({ stripeKey }) {
    const { cart, subtotal, clearCart } = useCart();

    const [step, setStep] = useState('loading'); // loading | form | success | error
    const [clientSecret, setClientSecret] = useState(null);
    const [orderData, setOrderData] = useState(null);
    const [initError, setInitError] = useState(null);

    const taxRate = 0.08;
    const tax = subtotal * taxRate;
    const total = subtotal + tax;

    // Al montar: crear el PaymentIntent en el backend
    useEffect(() => {
        if (cart.length === 0) {
            setStep('empty');
            return;
        }

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
            .catch(err => {
                setInitError('No se pudo conectar con el servidor de pagos.');
                setStep('error');
            });
    }, []);

    const handleSuccess = (orderId, numeroOrden) => {
        clearCart();
        setStep('success');
        setOrderData(prev => ({ ...prev, orderId, numeroOrden }));
    };

    const stripeInstance = getStripe(stripeKey);

    // ── Carrito vacío ──
    if (step === 'empty') {
        return (
            <MainLayout>
                <Head title="Checkout" />
                <div className="max-w-[1400px] mx-auto px-4 py-24 flex flex-col items-center">
                    <Package className="w-16 h-16 text-gray-600 mb-4" />
                    <h1 className="text-3xl font-black uppercase italic text-white mb-2">Carrito vacío</h1>
                    <p className="text-gray-500 mb-8">Añade productos antes de proceder al pago.</p>
                    <Link href="/shop" className="bg-white text-black px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">
                        IR A LA TIENDA
                    </Link>
                </div>
            </MainLayout>
        );
    }

    // ── Éxito ──
    if (step === 'success') {
        return (
            <MainLayout>
                <Head title="¡Pago completado!" />
                <div className="max-w-[600px] mx-auto px-4 py-24 flex flex-col items-center text-center">
                    <div className="bg-green-500/10 p-6 rounded-full mb-6">
                        <CheckCircle className="w-16 h-16 text-green-500" />
                    </div>
                    <h1 className="text-4xl font-black uppercase italic text-white mb-3">¡Pago Completado!</h1>
                    <p className="text-gray-400 mb-2 font-medium">Tu pedido ha sido confirmado.</p>
                    {orderData?.numeroOrden && (
                        <p className="text-[12px] font-black uppercase tracking-widest text-gray-600 mb-8">
                            Nº de orden: <span className="text-red-500">{orderData.numeroOrden}</span>
                        </p>
                    )}
                    <div className="flex flex-col sm:flex-row gap-4 w-full">
                        <Link
                            href="/shop"
                            className="flex-1 bg-white text-black py-4 rounded-xl font-black text-xs uppercase tracking-widest text-center hover:bg-red-500 hover:text-white transition-all"
                        >
                            SEGUIR COMPRANDO
                        </Link>
                    </div>
                </div>
            </MainLayout>
        );
    }

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

                <div className="mb-10">
                    <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter text-white mb-2">
                        CHECKOUT
                    </h1>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">
                        Paso final — confirma tu pedido
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">

                    {/* ── Formulario de pago ── */}
                    <div className="lg:col-span-3">
                        {step === 'loading' && (
                            <div className="flex flex-col items-center justify-center py-24 gap-4">
                                <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
                                <p className="text-gray-500 text-sm font-medium uppercase tracking-widest">
                                    Preparando el pago seguro...
                                </p>
                            </div>
                        )}

                        {step === 'error' && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8">
                                <h3 className="text-white font-black uppercase mb-2">Error al inicializar</h3>
                                <p className="text-red-400 mb-6">{initError}</p>
                                <Link href="/cart" className="flex items-center gap-2 text-gray-400 hover:text-white text-xs font-black uppercase tracking-widest">
                                    <ArrowLeft className="w-4 h-4" />
                                    Volver al carrito
                                </Link>
                            </div>
                        )}

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
                                    onSuccess={handleSuccess}
                                />
                            </Elements>
                        )}

                        {/* Volver al carrito */}
                        <Link
                            href="/cart"
                            className="mt-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-600 hover:text-white transition-colors group"
                        >
                            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                            Volver al carrito
                        </Link>
                    </div>

                    {/* ── Resumen del pedido ── */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="bg-[#111111] rounded-2xl border border-white/5 p-6 lg:sticky lg:top-24">
                            <h2 className="text-lg font-black italic uppercase tracking-tighter text-white mb-6">
                                Resumen
                            </h2>

                            {/* Items */}
                            <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                                {cart.map((item, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        {item.imagenes?.[0]?.url_imagen ? (
                                            <img
                                                src={`/storage/${item.imagenes[0].url_imagen}`}
                                                alt={item.nombre}
                                                className="w-12 h-12 rounded-lg object-cover bg-[#1a1a1a] flex-shrink-0"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 rounded-lg bg-[#1a1a1a] flex-shrink-0 flex items-center justify-center">
                                                <Package className="w-5 h-5 text-gray-600" />
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-white text-xs font-black truncate">{item.nombre}</p>
                                            {item.variant && (
                                                <p className="text-gray-500 text-[10px]">{item.variant.nombre}</p>
                                            )}
                                            <p className="text-gray-500 text-[10px]">× {item.quantity}</p>
                                        </div>
                                        <span className="text-white text-xs font-black flex-shrink-0">
                                            €{(Number(item.precio_venta) * item.quantity).toFixed(2)}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Totales */}
                            <div className="border-t border-white/5 pt-4 space-y-2">
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-400 font-bold uppercase tracking-widest">Subtotal</span>
                                    <span className="text-white font-black">€{subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-400 font-bold uppercase tracking-widest">Envío</span>
                                    <span className="text-green-500 font-black">GRATIS</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-400 font-bold uppercase tracking-widest">Impuestos</span>
                                    <span className="text-white font-black">€{tax.toFixed(2)}</span>
                                </div>
                                <div className="border-t border-white/5 pt-3 flex justify-between items-baseline">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">TOTAL</span>
                                    <span className="text-3xl font-black text-white">€{total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Badge de seguridad */}
                        <div className="bg-black/20 rounded-2xl border border-white/5 p-4 flex gap-3 items-start">
                            <div className="bg-red-500/10 p-2 rounded-lg flex-shrink-0">
                                <ShieldCheck className="w-5 h-5 text-red-500" />
                            </div>
                            <div>
                                <h4 className="text-[11px] font-black uppercase tracking-widest text-white mb-1">PAGO SEGURO</h4>
                                <p className="text-[10px] text-gray-500 leading-relaxed">
                                    Cifrado SSL 256-bit. Procesado por Stripe — nunca almacenamos datos de tu tarjeta.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
