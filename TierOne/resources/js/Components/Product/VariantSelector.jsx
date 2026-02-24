import { useState } from 'react';

/**
 * Selector de variante (talla, color, etc.) basado en las variantes de la BD.
 */
export default function VariantSelector({ variantes, selectedVariant, onSelect }) {
    if (!variantes || variantes.length === 0) return null;

    return (
        <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
                    Seleccionar variante
                </span>
            </div>
            <div className="flex flex-wrap gap-3">
                {variantes.map((variante) => (
                    <button
                        key={variante.id}
                        id={`variant-${variante.id}`}
                        onClick={() => variante.disponible && onSelect(variante)}
                        disabled={!variante.disponible}
                        className={`px-6 py-3 rounded-lg text-sm font-bold uppercase tracking-wider border transition-all ${!variante.disponible
                                ? 'border-gray-800 text-gray-700 cursor-not-allowed line-through'
                                : selectedVariant?.id === variante.id
                                    ? 'border-red-600 bg-red-600 text-white'
                                    : 'border-gray-700 text-gray-300 hover:border-white hover:text-white'
                            }`}
                    >
                        {variante.nombre}
                    </button>
                ))}
            </div>
        </div>
    );
}
