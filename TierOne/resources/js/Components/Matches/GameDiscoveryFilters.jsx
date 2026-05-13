import React from 'react';

export default function GameDiscoveryFilters({
    searchTerm,
    onSearchChange,
    totalLabel = 'Catalogo',
    totalValue,
    totalSuffix = 'juegos listos',
    categories = [],
    activeCategory = 'TODOS',
    onCategoryChange,
}) {
    return (
        <>
            <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="relative flex-1">
                    <svg
                        className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" />
                    </svg>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(event) => onSearchChange(event.target.value)}
                        placeholder="Busca por nombre, categoria o descripcion"
                        className="w-full rounded-[22px] border border-white/10 bg-white/[0.04] py-4 pl-14 pr-5 text-sm font-semibold text-white outline-none transition placeholder:text-gray-500 focus:border-red-500/60 focus:bg-white/[0.06]"
                    />
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-left lg:text-right">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">{totalLabel}</p>
                    <p className="mt-1 text-lg font-black text-white">{totalValue} {totalSuffix}</p>
                </div>
            </div>

            <div className="mb-6 flex flex-wrap gap-3">
                {categories.map((category) => (
                    <button
                        key={category}
                        type="button"
                        onClick={() => onCategoryChange(category)}
                        className={`rounded-full border px-4 py-2 text-[11px] font-black uppercase tracking-[0.2em] transition-all ${
                            activeCategory === category
                                ? 'border-red-500 bg-red-600 text-white shadow-[0_0_20px_rgba(227,24,55,0.3)]'
                                : 'border-white/10 bg-white/[0.03] text-gray-400 hover:border-white/20 hover:text-white'
                        }`}
                    >
                        {category}
                    </button>
                ))}
            </div>
        </>
    );
}
