import React from 'react';
import { ShieldCheck, Package } from 'lucide-react';
import { useCart } from '@/Contexts/CartContext';

/**
 * Panel de resumen del pedido en el checkout.
 * Lee el carrito del CartContext por defecto, pero permite pasar items manuales.
 */
export default function CheckoutOrderSummary({ manualItems = null, manualSubtotal = null }) {
    const { cart: cartFromContext, subtotal: subtotalFromContext } = useCart();

    const cart = manualItems || cartFromContext;
    const subtotal = manualSubtotal ?? subtotalFromContext;

    const taxRate = 0.21;
    const tax = subtotal * taxRate;
    const total = subtotal + tax;

    return (
        <div className="space-y-4">

            {/* Tarjeta de resumen */}
            <div className="bg-[#111111] rounded-2xl border border-white/5 p-6">
                <h2 className="text-lg font-black italic uppercase tracking-tighter text-white mb-6">
                    Resumen del Pedido
                </h2>

                {/* Lista de items */}
                <div className="space-y-3 mb-6 max-h-64 overflow-y-auto pr-1 scrollbar-thin">
                    {cart.map((item, i) => (
                        <div key={`${item.id}-${i}`} className="flex items-center gap-3">
                            {/* Imagen o placeholder */}
                            {item.imagenes?.[0]?.url_imagen ? (
                                <img
                                    src={item.imagenes[0].url_imagen.startsWith('http') || item.imagenes[0].url_imagen.startsWith('/')
                                        ? item.imagenes[0].url_imagen
                                        : `/storage/${item.imagenes[0].url_imagen}`}
                                    alt={item.nombre}
                                    className="w-12 h-12 rounded-lg object-cover bg-[#1a1a1a] flex-shrink-0"
                                />
                            ) : (
                                <div className="w-12 h-12 rounded-lg bg-[#1a1a1a] flex-shrink-0 flex items-center justify-center">
                                    <Package className="w-5 h-5 text-gray-600" />
                                </div>
                            )}

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <p className="text-white text-xs font-black truncate">{item.nombre}</p>
                                {item.variant && (
                                    <p className="text-gray-500 text-[10px]">{item.variant.nombre}</p>
                                )}
                                <p className="text-gray-500 text-[10px]">× {item.quantity}</p>
                            </div>

                            {/* Precio línea */}
                            <span className="text-white text-xs font-black flex-shrink-0">
                                €{((Number(item.precio_venta) + Number(item.customizationSurcharge || 0)) * item.quantity).toFixed(2)}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Desglose de totales */}
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
                        <span className="text-gray-400 font-bold uppercase tracking-widest">Impuestos (21%)</span>
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
                    <h4 className="text-[11px] font-black uppercase tracking-widest text-white mb-1">
                        PAGO SEGURO
                    </h4>
                    <p className="text-[10px] text-gray-500 leading-relaxed">
                        Cifrado SSL 256-bit. Procesado por Stripe — nunca almacenamos datos de tu tarjeta.
                    </p>
                </div>
            </div>
        </div>
    );
}
