import React from 'react';
import { Layers, Type, ImageIcon, Trash2 } from 'lucide-react';

export default function LayerPanel({ layers = [], onSelectLayer, onDeleteLayer }) {
    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <h3 className="text-white font-black text-[10px] uppercase tracking-widest mb-4 flex items-center gap-2">
                <Layers size={14} className="text-amber-400" />
                Capas ({layers.length})
            </h3>
            
            <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                {layers.map((layer, index) => (
                    <div
                        key={index}
                        onClick={() => onSelectLayer(index)}
                        className="flex items-center justify-between p-3 bg-black/40 border border-white/5 hover:border-white/20 rounded-xl cursor-pointer group transition-all"
                    >
                        <div className="flex items-center gap-3 overflow-hidden">
                            {layer.tipo === 'texto' ? (
                                <Type size={12} className="text-purple-400 shrink-0" />
                            ) : (
                                <ImageIcon size={12} className="text-pink-400 shrink-0" />
                            )}
                            <span className="text-[10px] text-gray-300 truncate font-bold uppercase tracking-tight">
                                {layer.tipo === 'texto' ? layer.contenido : 'Imagen subida'}
                            </span>
                        </div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDeleteLayer(index);
                            }}
                            className="p-1.5 text-gray-500 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                        >
                            <Trash2 size={12} />
                        </button>
                    </div>
                ))}
                
                {layers.length === 0 && (
                    <div className="py-8 text-center">
                        <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Sin elementos</p>
                    </div>
                )}
            </div>
        </div>
    );
}
