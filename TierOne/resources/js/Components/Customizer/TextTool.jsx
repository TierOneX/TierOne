import React, { useState } from 'react';
import { Keyboard, Plus, ChevronDown } from 'lucide-react';

const fonts = [
    'Outfit', 'Inter', 'Montserrat', 'Oswald', 'Bebas Neue', 'Impact',
    'Arial', 'Helvetica', 'Georgia', 'Times New Roman'
];

export default function TextTool({ onAddText }) {
    const [config, setConfig] = useState({
        content: '',
        fontSize: 32,
        fontFamily: 'Outfit',
        color: '#ffffff',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (config.content.trim()) {
            onAddText(config);
            setConfig(prev => ({ ...prev, content: '' }));
        }
    };

    return (
        <div className="bg-[#111] border border-white/8 rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="px-4 py-3 border-b border-white/5 flex items-center gap-3 bg-gradient-to-r from-red-600/10 to-transparent">
                <div className="p-1.5 bg-red-600/20 rounded-lg border border-red-500/20">
                    <Keyboard size={14} className="text-red-400" strokeWidth={2.5} />
                </div>
                <h3 className="text-white font-black text-[10px] uppercase tracking-[0.2em] font-['Outfit']">
                    Añadir Texto
                </h3>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-3">
                {/* Input de texto */}
                <input
                    type="text"
                    placeholder="Escribe tu texto..."
                    className="w-full bg-black/60 border border-white/5 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-red-500/50 focus:bg-black/80 transition-all placeholder:text-gray-700"
                    value={config.content}
                    onChange={(e) => setConfig({ ...config, content: e.target.value })}
                />

                {/* Fuente y tamaño */}
                <div className="grid grid-cols-2 gap-2">
                    <div className="relative">
                        <select
                            className="w-full appearance-none bg-black/60 border border-white/5 rounded-xl px-3 py-2.5 text-white text-[11px] outline-none focus:border-red-500/50 transition-all cursor-pointer"
                            value={config.fontFamily}
                            onChange={(e) => setConfig({ ...config, fontFamily: e.target.value })}
                        >
                            {fonts.map(font => (
                                <option key={font} value={font} className="bg-[#111]">{font}</option>
                            ))}
                        </select>
                        <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" />
                    </div>

                    <input
                        type="number"
                        min={8}
                        max={120}
                        className="bg-black/60 border border-white/5 rounded-xl px-3 py-2.5 text-white text-[11px] outline-none focus:border-red-500/50 transition-all text-center"
                        value={config.fontSize}
                        onChange={(e) => setConfig({ ...config, fontSize: parseInt(e.target.value) || 32 })}
                    />
                </div>

                {/* Color picker */}
                <div className="flex items-center gap-3 bg-black/60 border border-white/5 rounded-xl px-3 py-2 hover:border-white/10 transition-all">
                    <div className="relative">
                        <input
                            type="color"
                            className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-none opacity-0 absolute inset-0"
                            value={config.color}
                            onChange={(e) => setConfig({ ...config, color: e.target.value })}
                        />
                        <div
                            className="w-8 h-8 rounded-lg border border-white/10 shadow-inner"
                            style={{ backgroundColor: config.color }}
                        />
                    </div>
                    <span className="text-[10px] text-gray-400 font-mono uppercase tracking-widest">{config.color}</span>
                    <span className="text-[9px] text-gray-600 ml-auto font-black uppercase">Color</span>
                </div>

                {/* Botón */}
                <button
                    type="submit"
                    disabled={!config.content.trim()}
                    className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 disabled:from-gray-800 disabled:to-gray-800 disabled:text-gray-600 text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(220,38,38,0.2)] hover:shadow-[0_0_20px_rgba(220,38,38,0.4)] disabled:shadow-none active:scale-95 font-['Outfit']"
                >
                    <Plus size={14} /> Añadir al Diseño
                </button>
            </form>
        </div>
    );
}
