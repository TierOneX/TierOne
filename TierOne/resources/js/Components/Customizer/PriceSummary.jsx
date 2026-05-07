import React from 'react';
import { DollarSign } from 'lucide-react';

export default function PriceSummary({ precioBase, elementos, precios, recargo }) {
    const total = precioBase + recargo;

    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-white font-black text-[10px] uppercase tracking-widest mb-6 flex items-center gap-2 border-b border-white/10 pb-4">
                <DollarSign size={14} className="text-green-400" />
                Resumen de Precio
            </h3>
            
            <div className="space-y-4">
                <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400 font-bold uppercase">Precio base</span>
                    <span className="text-white font-black">€{precioBase.toFixed(2)}</span>
                </div>
                
                {elementos.textos > 0 && (
                    <div className="flex justify-between items-center text-[11px]">
                        <span className="text-gray-500 font-medium">
                            {elementos.textos} textos x €{precios.texto.toFixed(2)}
                        </span>
                        <span className="text-purple-400 font-bold">+ €{(elementos.textos * precios.texto).toFixed(2)}</span>
                    </div>
                )}
                
                {elementos.imagenes > 0 && (
                    <div className="flex justify-between items-center text-[11px]">
                        <span className="text-gray-500 font-medium">
                            {elementos.imagenes} imágenes x €{precios.imagen.toFixed(2)}
                        </span>
                        <span className="text-pink-400 font-bold">+ €{(elementos.imagenes * precios.imagen).toFixed(2)}</span>
                    </div>
                )}
                
                <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                    <span className="text-[10px] text-white font-black uppercase tracking-widest">Total</span>
                    <span className="text-2xl font-black text-white tracking-tight">
                        €{total.toFixed(2)}
                    </span>
                </div>
            </div>
            
            <p className="text-[9px] text-gray-500 mt-6 italic text-center leading-relaxed">
                * El precio final se calculará al añadir al carrito incluyendo posibles variaciones.
            </p>
        </div>
    );
}
