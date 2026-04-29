export default function MatchesSearchBar({ searchTerm, onSearchChange, totalGames }) {
    return (
        <section className="bg-[#090909] px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto flex max-w-[1400px] flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
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

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-right">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Catalogo</p>
                    <p className="mt-1 text-lg font-black text-white">{totalGames} juegos listos</p>
                </div>
            </div>
        </section>
    );
}
