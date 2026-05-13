import React from 'react';
import { Layers, Keyboard, Monitor, Trash2, GripVertical } from 'lucide-react';

export default function LayerPanel({ layers = [], onSelectLayer, onDeleteLayer }) {
    return (
        <div className="bg-[#111] border border-white/8 rounded-2xl overflow-hidden flex flex-col h-[280px]">
            {/* Header */}
            <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-red-600/10 to-transparent shrink-0">
                <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-red-600/20 rounded-lg border border-red-500/20">
                        <Layers size={14} className="text-red-400" strokeWidth={2.5} />
                    </div>
                    <h3 className="text-white font-black text-[10px] uppercase tracking-[0.2em] font-['Outfit']">
                        Capas <span className="text-red-500 ml-1">({layers.length})</span>
                    </h3>
                </div>
            </div>
            
            {/* List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
                {layers.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center opacity-20 grayscale">
                        <Layers size={32} className="mb-2 text-gray-400" />
                        <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest text-center">
                            Diseño vacío
                        </p>
                    </div>
                ) : (
                    [...layers].reverse().map((layer, index) => {
                        // El index real en el array original (que no está revertido)
                        const realIndex = layers.length - 1 - index;
                        
                        return (
                            <div
                                key={realIndex}
                                onClick={() => onSelectLayer(realIndex)}
                                className="group flex items-center gap-3 p-3 bg-black/40 border border-white/5 hover:border-red-500/30 hover:bg-red-500/5 rounded-xl cursor-pointer transition-all active:scale-[0.98]"
                            >
                                <div className="text-gray-700 group-hover:text-red-500/50 transition-colors">
                                    <GripVertical size={14} />
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        {layer.tipo === 'texto' ? (
                                            <Keyboard size={10} className="text-red-400" strokeWidth={2.5} />
                                        ) : (
                                            <Monitor size={10} className="text-red-400" strokeWidth={2.5} />
                                        )}
                                        <span className="text-[8px] text-gray-500 font-black uppercase tracking-widest">
                                            {layer.tipo === 'texto' ? 'Capa de Texto' : 'Capa de Imagen'}
                                        </span>
                                    </div>
                                    <p className="text-[10px] text-white font-bold truncate pr-2">
                                        {layer.tipo === 'texto' ? layer.contenido : 'Imagen Personalizada'}
                                    </p>
                                </div>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDeleteLayer(realIndex);
                                    }}
                                    className="p-2 text-gray-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                >
                                    <Trash2 size={12} />
                                </button>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Footer / Hint */}
            {layers.length > 0 && (
                <div className="px-4 py-2 border-t border-white/5 bg-black/20 shrink-0">
                    <p className="text-[8px] text-gray-600 italic text-center">
                        Haz clic para seleccionar un elemento en el lienzo
                    </p>
                </div>
            )}
        </div>
    );
}
