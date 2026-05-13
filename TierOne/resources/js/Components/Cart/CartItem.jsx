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
            <div className="w-full sm:w-40 h-40 bg-[#1a1a1a] rounded-xl overflow-hidden shrink-0 relative">
                <img
                    src={imgUrl(item.imagen_principal)}
                    alt={item.nombre}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {item.customization?.render_principal && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                         <img 
                            src={item.customization.render_principal} 
                            alt="Preview Diseño" 
                            className="w-full h-full object-contain"
                         />
                    </div>
                )}
            </div>

            {/* Información del producto */}
            <div className="flex-grow flex flex-col md:flex-row justify-between w-full gap-4">
                <div className="space-y-1">
                    <h3 className="text-xl font-black uppercase tracking-tight text-white group-hover:text-red-500 transition-colors flex items-center flex-wrap gap-2">
                        {item.nombre} {item.tagline && <span className="italic text-red-500">{item.tagline}</span>}
                        {item.customization && (
                            <span className="text-[9px] bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded border border-purple-500/30 uppercase font-black tracking-widest">
                                Personalizado
                            </span>
                        )}
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
                        
                        {item.customization && (
                            <div className="space-y-1 w-full">
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                                    Detalles del Diseño
                                </p>
                                <div className="flex gap-2 mt-1">
                                    {item.customization.precio_elementos.textos > 0 && (
                                        <span className="text-[10px] text-gray-400 bg-white/5 px-2 py-1 rounded">
                                            {item.customization.precio_elementos.textos} Textos
                                        </span>
                                    )}
                                    {item.customization.precio_elementos.imagenes > 0 && (
                                        <span className="text-[10px] text-gray-400 bg-white/5 px-2 py-1 rounded">
                                            {item.customization.precio_elementos.imagenes} Imágenes
                                        </span>
                                    )}
                                </div>
                                {item.customizationSurcharge > 0 && (
                                    <p className="text-[10px] text-purple-400 font-black uppercase tracking-widest mt-2">
                                        + €{Number(item.customizationSurcharge).toFixed(2)} Personalización
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-col items-end justify-between gap-4">
                    <div className="text-right">
                        <p className="text-2xl font-black text-white">
                            ${(Number(item.precio_venta) + Number(item.customizationSurcharge || 0)).toFixed(2)}
                        </p>
                        <button
                            onClick={() => removeFromCart(item.cartId)}
                            className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-red-500 transition-colors mt-1"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                            ELIMINAR
                        </button>
                    </div>

                    <div className={`flex items-center bg-black/50 border border-white/10 rounded-lg p-1 ${item.customization ? 'opacity-50 pointer-events-none' : ''}`}>
                        <button
                            onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                            className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-md transition-all"
                        >
                            <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-10 text-center font-black text-white text-sm">{item.quantity}</span>
                        <button
                            onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
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
