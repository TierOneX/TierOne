import { useState } from 'react';

const imgUrl = (src) => {
    if (!src) return '/images/landing/torneos.jpg';
    return src.startsWith('/') || src.startsWith('http') ? src : `/${src}`;
};

export default function TournamentsGameGrid({ games = [], selectedGameId, onSelectGame }) {
    const [imgErrors, setImgErrors] = useState({});

    return (
        <section className="bg-[radial-gradient(circle_at_top_right,_rgba(227,24,55,0.28),_transparent_48%),radial-gradient(circle_at_18%_78%,_rgba(227,24,55,0.14),_transparent_44%),linear-gradient(180deg,_#141414_0%,_#090909_100%)] px-4 pb-16 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-[1400px]">
                <div className="mb-8 flex items-end justify-between gap-4">
                    <div>
                        <p className="text-[11px] font-black uppercase tracking-[0.35em] text-red-500">Todos los juegos</p>
                        <h2 className="mt-2 text-3xl font-black uppercase italic text-white sm:text-4xl">
                            Elige tu circuito
                        </h2>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
                    {games.map((game) => (
                        <article
                            key={game.id}
                            className={`group overflow-hidden rounded-[24px] border transition-all ${
                                selectedGameId === game.id
                                    ? 'border-red-500 bg-white/[0.05] shadow-[0_0_30px_rgba(227,24,55,0.2)]'
                                    : 'border-white/10 bg-[#111111] hover:-translate-y-1 hover:border-white/20'
                            }`}
                        >
                            <button
                                type="button"
                                onClick={() => onSelectGame(game)}
                                className="block w-full text-left"
                            >
                                <div className="relative aspect-[4/5] overflow-hidden">
                                    <img
                                        src={imgErrors[game.id] ? imgUrl(game.imagen_url_local) : imgUrl(game.imagen_url)}
                                        alt={game.nombre}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        onError={() => setImgErrors((prev) => ({ ...prev, [game.id]: true }))}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                                    <div className="absolute left-3 right-3 top-3 flex items-center justify-between gap-2">
                                        <span className="rounded-full bg-black/55 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-white backdrop-blur">
                                            {game.categoria}
                                        </span>
                                        <span className="rounded-full border border-red-500/20 bg-red-500/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-red-300">
                                            {game.torneos_abiertos}
                                        </span>
                                    </div>
                                </div>
                                <div className="space-y-2 p-4 pb-3">
                                    <h3 className="text-sm font-black uppercase text-white sm:text-base">{game.nombre}</h3>
                                    <p className="line-clamp-2 text-xs leading-5 text-gray-400">{game.descripcion}</p>
                                </div>
                            </button>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
