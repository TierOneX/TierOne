import React from 'react';
import { CreditCard, Zap } from 'lucide-react';

export default function PriceSummary({ precioBase, elementos, precios, recargo }) {
    const total = precioBase + recargo;

    return (
        <div className="bg-[#111] border border-white/8 rounded-2xl overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="px-5 py-4 border-b border-white/5 flex items-center gap-3 bg-gradient-to-r from-red-600/10 to-transparent">
                <div className="p-1.5 bg-red-600/20 rounded-lg border border-red-500/20">
                    <CreditCard size={16} className="text-red-400" strokeWidth={2.5} />
                </div>
                <h3 className="text-white font-black text-[11px] uppercase tracking-[0.2em] font-['Outfit']">
                    Configuración de Precio
                </h3>
            </div>
            
            <div className="p-5 space-y-4">
                {/* Precio Base */}
                <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                        <span className="text-[9px] text-gray-500 font-black uppercase tracking-widest">Unidad</span>
                        <span className="text-xs text-white font-bold uppercase italic">Precio Base</span>
                    </div>
                    <span className="text-sm text-white font-black">€{precioBase.toFixed(2)}</span>
                </div>
                
                {/* Desglose de personalización */}
                {(elementos.textos > 0 || elementos.imagenes > 0) && (
                    <div className="pt-4 border-t border-white/5 space-y-3">
                        <span className="text-[8px] text-red-500 font-black uppercase tracking-[0.2em] block mb-2">
                            Personalización (Extras)
                        </span>
                        
                        {elementos.textos > 0 && (
                            <div className="flex justify-between items-center group">
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.5)]" />
                                    <span className="text-[10px] text-gray-400 font-medium italic">
                                        {elementos.textos}x Texto(s)
                                    </span>
                                </div>
                                <span className="text-[10px] text-white font-bold">+ €{(elementos.textos * precios.texto).toFixed(2)}</span>
                            </div>
                        )}
                        
                        {elementos.imagenes > 0 && (
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.5)]" />
                                    <span className="text-[10px] text-gray-400 font-medium italic">
                                        {elementos.imagenes}x Imagen(es)
                                    </span>
                                </div>
                                <span className="text-[10px] text-white font-bold">+ €{(elementos.imagenes * precios.imagen).toFixed(2)}</span>
                            </div>
                        )}
                    </div>
                )}
                
                {/* Total Final */}
                <div className="pt-5 border-t border-white/5 relative">
                    {/* Elemento decorativo */}
                    <div className="absolute -top-px left-0 w-1/4 h-px bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.8)]" />
                    
                    <div className="flex justify-between items-end">
                        <div className="flex flex-col">
                            <div className="flex items-center gap-1 text-[9px] text-red-500 font-black uppercase tracking-[0.2em] mb-1">
                                <Zap size={10} strokeWidth={3} /> Precio Total
                            </div>
                            <span className="text-[8px] text-gray-600 italic">IVA Incluido</span>
                        </div>
                        <div className="text-right">
                            <span className="text-3xl font-black text-white tracking-tighter italic font-['Outfit']">
                                €{total.toFixed(2)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Aviso inferior */}
            <div className="bg-black/40 px-5 py-3 border-t border-white/5">
                <p className="text-[8px] text-gray-500 italic text-center leading-relaxed">
                    * El diseño final será revisado por nuestros técnicos antes de entrar en producción.
                </p>
            </div>
        </div>
    );
}
