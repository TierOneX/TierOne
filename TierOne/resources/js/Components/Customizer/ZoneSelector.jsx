import React from 'react';

export default function ZoneSelector({ zonas = [], activeIndex, onChange }) {
    if (zonas.length <= 1) return null;

    return (
        <div className="flex justify-center gap-2 mb-6">
            <div className="bg-white/5 p-1 rounded-2xl border border-white/10 flex gap-1">
                {zonas.map((zona, index) => (
                    <button
                        key={zona.id}
                        onClick={() => onChange(index)}
                        className={`px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
                            activeIndex === index
                                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        {zona.nombre}
                    </button>
                ))}
            </div>
        </div>
    );
}
