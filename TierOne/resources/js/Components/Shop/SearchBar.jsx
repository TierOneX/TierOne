export default function SearchBar({ searchTerm, onSearchChange, onToggleFilter, isFilterOpen }) {
    return (
        <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                    id="shop-search-input"
                    type="text"
                    placeholder="Buscar productos..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all"
                />
            </div>
            <button
                id="shop-filter-button"
                onClick={onToggleFilter}
                className={`px-8 py-4 rounded-xl flex items-center justify-center gap-2 font-bold transition-all hover:scale-105 active:scale-95 ${isFilterOpen
                        ? 'bg-white text-black'
                        : 'bg-red-600 hover:bg-red-700 text-white'
                    }`}
            >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                <span>{isFilterOpen ? 'CERRAR' : 'FILTRAR'}</span>
            </button>
        </div>
    );
}
