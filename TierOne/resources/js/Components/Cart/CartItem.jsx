import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '@/Contexts/CartContext';

/** Normaliza rutas de imagen relativas a absolutas */
const imgUrl = (src) => {
    if (!src) return null;
    return src.startsWith('/') || src.startsWith('http') ? src : `/${src}`;
};

export default function CartItem({ item }) {
    const { updateQuantity, removeFromCart } = useCart();

    return (
        <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-[#111111] rounded-2xl border border-white/5 group hover:border-white/10 transition-all duration-300">
            {/* Imagen del producto */}
            <div className="w-full sm:w-40 h-40 bg-[#1a1a1a] rounded-xl overflow-hidden shrink-0">
                <img
                    src={imgUrl(item.imagen_principal)}
                    alt={item.nombre}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
            </div>

            {/* Información del producto */}
            <div className="flex-grow flex flex-col md:flex-row justify-between w-full gap-4">
                <div className="space-y-1">
                    <h3 className="text-xl font-black uppercase tracking-tight text-white group-hover:text-red-500 transition-colors">
                        {item.nombre} {item.tagline && <span className="italic text-red-500">{item.tagline}</span>}
                    </h3>
                    <p className="text-sm text-gray-400 font-medium">
                        {item.categoria?.nombre || 'Gear'} • {item.subcategoria || 'TierOne Original'}
                    </p>

                    <div className="flex flex-wrap gap-4 mt-4">
                        {item.variant && (
                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                                    {item.variant.tipo === 'size' ? 'SIZE' : 'VARIANT'}
                                </p>
                                <p className="text-xs font-bold text-white uppercase">{item.variant.nombre}</p>
                            </div>
                        )}
                        {/* Puedes añadir más detalles aquí si es necesario */}
                    </div>
                </div>

                <div className="flex flex-col items-end justify-between gap-4">
                    <div className="text-right">
                        <p className="text-2xl font-black text-white">${Number(item.precio_venta).toFixed(2)}</p>
                        <button
                            onClick={() => removeFromCart(item.id, item.variant)}
                            className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-red-500 transition-colors mt-1"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                            ELIMINAR
                        </button>
                    </div>

                    <div className="flex items-center bg-black/50 border border-white/10 rounded-lg p-1">
                        <button
                            onClick={() => updateQuantity(item.id, item.variant, item.quantity - 1)}
                            className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-md transition-all"
                        >
                            <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-10 text-center font-black text-white text-sm">{item.quantity}</span>
                        <button
                            onClick={() => updateQuantity(item.id, item.variant, item.quantity + 1)}
                            className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-md transition-all"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
