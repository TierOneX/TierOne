import React from 'react';
import { Eye, Check } from 'lucide-react';
import { imgUrl } from '@/Utils/imageUtils';

/**
 * ZoneSelector — Selector de Vistas (thumbnails) + Sub-selector de Zonas.
 *
 * Muestra thumbnails de cada vista del producto y, debajo,
 * las zonas disponibles en la vista activa como tabs.
 */
export default function ZoneSelector({
    views = [],          // [{ image, nombre, zonas: [] }]
    activeViewIndex,
    onViewChange,
    activeZoneId,
    onZoneChange,
    zonesWithContent = {},  // { [zoneId]: boolean } — zonas que tienen personalización
}) {
    const activeView = views[activeViewIndex];

    return (
        <div className="space-y-3">
            {/* Selector de Vistas (Thumbnails) */}
            {views.length > 1 && (
                <div className="flex justify-center gap-3 mb-2">
                    {views.map((view, index) => {
                        const isActive = index === activeViewIndex;
                        const hasContent = view.zonas.some(z => zonesWithContent[z.id]);

                        return (
                            <button
                                key={index}
                                onClick={() => onViewChange(index)}
                                className={`relative group rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                                    isActive
                                        ? 'border-purple-500 ring-2 ring-purple-500/30 scale-105'
                                        : 'border-white/10 hover:border-white/30 opacity-60 hover:opacity-100'
                                }`}
                                style={{ width: 72, height: 72 }}
                            >
                                <img
                                    src={imgUrl ? imgUrl(view.image) : view.image}
                                    alt={view.nombre}
                                    className="w-full h-full object-contain bg-black/60"
                                />
                                {/* Badge de contenido personalizado */}
                                {hasContent && (
                                    <div className="absolute top-1 right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                                        <Check size={10} className="text-white" />
                                    </div>
                                )}
                                {/* Label */}
                                <div className={`absolute bottom-0 inset-x-0 text-center py-0.5 text-[7px] font-black uppercase tracking-wider ${
                                    isActive ? 'bg-purple-600/90 text-white' : 'bg-black/70 text-gray-400'
                                }`}>
                                    {view.nombre.length > 10 ? view.nombre.slice(0, 10) + '…' : view.nombre}
                                </div>
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Sub-selector de Zonas de la vista activa */}
            {activeView && activeView.zonas.filter(z => z.tipo !== 'bloqueada').length > 1 && (
                <div className="flex justify-center">
                    <div className="bg-white/5 p-1 rounded-2xl border border-white/10 flex gap-1">
                        {activeView.zonas
                            .filter(z => z.tipo !== 'bloqueada')
                            .map((zona) => {
                                const isActive = zona.id === activeZoneId;
                                const hasContent = zonesWithContent[zona.id];

                                return (
                                    <button
                                        key={zona.id}
                                        onClick={() => onZoneChange(zona.id)}
                                        className={`px-4 py-2 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all flex items-center gap-1.5 ${
                                            isActive
                                                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
                                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                        }`}
                                    >
                                        {hasContent && <Check size={10} className="text-green-400" />}
                                        {zona.nombre}
                                    </button>
                                );
                            })}
                    </div>
                </div>
            )}
        </div>
    );
}
