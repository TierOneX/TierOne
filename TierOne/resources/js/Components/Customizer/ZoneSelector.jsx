import React from 'react';
import { Monitor, CheckCircle2, Crosshair } from 'lucide-react';
import { imgUrl } from '@/Utils/imageUtils';

export default function ZoneSelector({
    views = [],
    activeViewIndex,
    onViewChange,
    activeZoneId,
    onZoneChange,
    zonesWithContent = {},
}) {
    const activeView = views[activeViewIndex];

    return (
        <div className="flex flex-col gap-6 mb-8">
            {/* Selector de Vistas (Vistas del producto) */}
            {views.length > 1 && (
                <div className="flex flex-col items-center gap-4">
                    <span className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em] font-['Outfit'] italic">
                        Selecciona Vista
                    </span>
                    <div className="flex justify-center gap-4">
                        {views.map((view, index) => {
                            const isActive = index === activeViewIndex;
                            const hasContent = view.zonas.some(z => zonesWithContent[z.id]);

                            return (
                                <button
                                    key={index}
                                    onClick={() => onViewChange(index)}
                                    className={`relative group rounded-2xl overflow-hidden border-2 transition-all duration-300 shadow-xl active:scale-95 ${
                                        isActive
                                            ? 'border-red-600 ring-4 ring-red-600/20 scale-110'
                                            : 'border-white/5 opacity-40 hover:opacity-100 hover:border-white/20'
                                    }`}
                                    style={{ width: 80, height: 80 }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                                    <img
                                        src={imgUrl(view.image)}
                                        alt={view.nombre}
                                        className="w-full h-full object-contain p-2"
                                    />
                                    
                                    {/* Indicador de contenido */}
                                    {hasContent && (
                                        <div className="absolute top-1.5 right-1.5 z-20 w-4 h-4 bg-red-600 rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(220,38,38,0.6)] border border-white/20">
                                            <CheckCircle2 size={10} className="text-white" strokeWidth={3} />
                                        </div>
                                    )}

                                    {/* Etiqueta de la vista */}
                                    <div className={`absolute bottom-0 inset-x-0 z-20 text-center py-1.5 text-[8px] font-black uppercase tracking-widest font-['Outfit'] transition-all ${
                                        isActive ? 'bg-red-600 text-white' : 'bg-black/60 text-gray-400 group-hover:text-white'
                                    }`}>
                                        {view.nombre}
                                    </div>
                                    
                                    {/* Efecto de selección */}
                                    {isActive && (
                                        <div className="absolute inset-0 z-0 bg-red-600/10 animate-pulse" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Selector de Zonas (Tabs de la vista actual) */}
            {activeView && activeView.zonas.filter(z => z.tipo !== 'bloqueada').length > 1 && (
                <div className="flex flex-col items-center gap-3">
                    <div className="bg-[#111] p-1.5 rounded-2xl border border-white/5 flex gap-1.5 shadow-inner">
                        {activeView.zonas
                            .filter(z => z.tipo !== 'bloqueada')
                            .map((zona) => {
                                const isActive = zona.id === activeZoneId;
                                const hasContent = zonesWithContent[zona.id];

                                return (
                                    <button
                                        key={zona.id}
                                        onClick={() => onZoneChange(zona.id)}
                                        className={`relative px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-[0.15em] transition-all flex items-center gap-2 group italic font-['Outfit'] ${
                                            isActive
                                                ? 'bg-gradient-to-r from-red-600 to-red-800 text-white shadow-lg shadow-red-600/20'
                                                : 'text-gray-500 hover:text-white hover:bg-white/5'
                                        }`}
                                    >
                                        <Crosshair size={12} className={isActive ? 'text-white' : 'text-gray-700 group-hover:text-red-500'} strokeWidth={2.5} />
                                        {zona.nombre}
                                        
                                        {hasContent && (
                                            <span className="flex h-1.5 w-1.5 rounded-full bg-red-400 shadow-[0_0_5px_rgba(248,113,113,0.8)]" />
                                        )}
                                        
                                        {isActive && (
                                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-red-600 rounded-full shadow-[0_0_10px_red]" />
                                        )}
                                    </button>
                                );
                            })}
                    </div>
                </div>
            )}
        </div>
    );
}
