const imgUrl = (src) => {
    if (!src) return '/images/landing/Partidas.jpg';
    return src.startsWith('/') || src.startsWith('http') ? src : `/${src}`;
};

export default function MatchesHero({ popularGames = [], activeCategory, onCategoryChange, categories = [] }) {
    const availableCategories = ['TODOS', ...categories];

    return (
        <section className="relative overflow-hidden border-b border-white/5 bg-[radial-gradient(circle_at_top_left,_rgba(227,24,55,0.22),_transparent_32%),linear-gradient(180deg,_#111111_0%,_#090909_100%)] px-4 pb-10 pt-10 sm:px-6 lg:px-8">
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
                            Explora los juegos mas activos, filtra por categoria y entra en una sala con lista de partidas en vivo o crea una nueva desde el panel lateral.
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

                <div className="mb-6 flex flex-wrap gap-3">
                    {availableCategories.map((category) => (
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

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
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
                            <div className="relative flex h-full flex-col justify-end p-6">
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
                                <p className="mt-2 max-w-lg text-sm leading-6 text-gray-300">
                                    {game.descripcion}
                                </p>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
