import React, { useState } from 'react';
import { Type, Plus } from 'lucide-react';

export default function TextTool({ onAddText }) {
    const [config, setConfig] = useState({
        content: '',
        fontSize: 32,
        fontFamily: 'Arial',
        color: '#ffffff',
    });

    const fonts = [
        'Arial', 'Helvetica', 'Georgia', 'Times New Roman', 
        'Courier New', 'Verdana', 'Impact', 'Comic Sans MS',
        'Montserrat', 'Bebas Neue', 'Oswald'
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        if (config.content.trim()) {
            onAddText(config);
            setConfig(prev => ({ ...prev, content: '' }));
        }
    };

    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <h3 className="text-white font-black text-[10px] uppercase tracking-widest mb-4 flex items-center gap-2">
                <Type size={14} className="text-purple-400" />
                Añadir Texto
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3">
                <input
                    type="text"
                    placeholder="Escribe algo..."
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white text-sm outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                    value={config.content}
                    onChange={(e) => setConfig({ ...config, content: e.target.value })}
                />
                
                <div className="grid grid-cols-2 gap-2">
                    <select
                        className="bg-black/40 border border-white/10 rounded-xl p-2 text-white text-xs outline-none focus:ring-2 focus:ring-purple-500"
                        value={config.fontFamily}
                        onChange={(e) => setConfig({ ...config, fontFamily: e.target.value })}
                    >
                        {fonts.map(font => (
                            <option key={font} value={font} style={{ fontFamily: font }}>{font}</option>
                        ))}
                    </select>
                    
                    <input
                        type="number"
                        className="bg-black/40 border border-white/10 rounded-xl p-2 text-white text-xs outline-none focus:ring-2 focus:ring-purple-500"
                        value={config.fontSize}
                        onChange={(e) => setConfig({ ...config, fontSize: parseInt(e.target.value) })}
                    />
                </div>

                <div className="flex items-center gap-3 bg-black/40 border border-white/10 rounded-xl p-2">
                    <input
                        type="color"
                        className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-none"
                        value={config.color}
                        onChange={(e) => setConfig({ ...config, color: e.target.value })}
                    />
                    <span className="text-[10px] text-gray-400 uppercase font-black">{config.color}</span>
                </div>

                <button
                    type="submit"
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                >
                    <Plus size={14} /> Añadir al diseño
                </button>
            </form>
        </div>
    );
}
