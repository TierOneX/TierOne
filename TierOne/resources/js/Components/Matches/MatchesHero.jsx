import GameDiscoveryFilters from './GameDiscoveryFilters';

const imgUrl = (src) => {
    if (!src) return '/images/landing/Partidas.jpg';
    return src.startsWith('/') || src.startsWith('http') ? src : `/${src}`;
};

export default function MatchesHero({
    popularGames = [],
    activeCategory,
    onCategoryChange,
    categories = [],
    searchTerm,
    onSearchChange,
    totalGames,
    onSelectGame,
    onJoinGame,
    onCreateGame,
}) {
    const availableCategories = ['TODOS', ...categories];

    return (
        <section className="relative overflow-hidden border-b border-white/5 bg-[radial-gradient(circle_at_top_left,_rgba(227,24,55,0.36),_transparent_52%),radial-gradient(circle_at_78%_22%,_rgba(227,24,55,0.18),_transparent_46%),linear-gradient(180deg,_#151515_0%,_#090909_100%)] px-4 pb-10 pt-10 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-[1400px]">
                <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="mb-3 text-[11px] font-black uppercase tracking-[0.35em] text-red-500">
                            Matchmaking TierOne
                        </p>
                        <h1 className="max-w-3xl text-4xl font-black uppercase italic tracking-tight text-white sm:text-6xl">
                            Encuentra partida o crea la tuya en segundos
                        </h1>
                        <p className="mt-4 max-w-2xl text-sm font-medium leading-6 text-gray-400 sm:text-base">
                            Explora los juegos mas activos, filtra por categoria y entra en una sala con lista de partidas en vivo. <span className="text-red-500 font-black">Todas las salas operan exclusivamente con Hydra Coins (HC).</span>
                        </p>
                    </div>

                    <div className="rounded-2xl border border-red-500/20 bg-black/30 px-5 py-4 shadow-[0_18px_60px_rgba(0,0,0,0.45)] backdrop-blur">
                        <p className="text-[10px] font-black uppercase tracking-[0.35em] text-gray-500">Estado</p>
                        <p className="mt-2 text-2xl font-black text-white">{popularGames.length} juegos activos</p>
                        <p className="mt-1 text-xs uppercase tracking-[0.2em] text-red-400">
                            {popularGames.reduce((total, game) => total + game.partidas_abiertas, 0)} partidas abiertas ahora
                        </p>
                    </div>
                </div>

                <GameDiscoveryFilters
                    searchTerm={searchTerm}
                    onSearchChange={onSearchChange}
                    totalValue={totalGames}
                    totalSuffix="juegos listos"
                    categories={availableCategories}
                    activeCategory={activeCategory}
                    onCategoryChange={onCategoryChange}
                />

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4 mt-8">
                    {popularGames.map((game, index) => (
                        <article
                            key={game.id}
                            className={`group relative overflow-hidden rounded-[28px] border border-white/10 bg-[#101010] ${index === 0 ? 'xl:col-span-2 xl:row-span-2 min-h-[360px]' : 'min-h-[220px]'} `}
                        >
                            <img
                                src={imgUrl(game.imagen_url)}
                                alt={game.nombre}
                                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent" />
                            <div
                                role="button"
                                tabIndex={0}
                                onClick={() => onSelectGame(game)}
                                onKeyDown={(event) => {
                                    if (event.key === 'Enter' || event.key === ' ') {
                                        event.preventDefault();
                                        onSelectGame(game);
                                    }
                                }}
                                className="relative flex h-full cursor-pointer flex-col justify-end p-6"
                            >
                                <div className="mb-4 flex items-center justify-between gap-3">
                                    <span className="rounded-full border border-white/10 bg-black/35 px-3 py-1 text-[10px] font-black uppercase tracking-[0.25em] text-red-400">
                                        {game.categoria}
                                    </span>
                                    <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-300">
                                        {game.partidas_abiertas} abiertas
                                    </span>
                                </div>
                                <h2 className="max-w-sm text-2xl font-black uppercase italic text-white">
                                    {game.nombre}
                                </h2>
                                <p className="mt-2 max-w-lg text-sm leading-6 text-gray-300 line-clamp-2">
                                    {game.descripcion}
                                </p>
                                <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <button
                                        type="button"
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            onJoinGame(game);
                                        }}
                                        className="min-h-11 rounded-xl border border-white/20 bg-black/35 px-3 py-2 text-[10px] font-black uppercase tracking-[0.12em] text-white transition hover:border-red-500/60 hover:bg-red-500/10"
                                    >
                                        Unirse a partida
                                    </button>
                                    <button
                                        type="button"
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            onCreateGame(game);
                                        }}
                                        className="min-h-11 rounded-xl bg-red-600 px-3 py-2 text-[10px] font-black uppercase tracking-[0.12em] text-white transition hover:bg-red-500"
                                    >
                                        Crear partida
                                    </button>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
