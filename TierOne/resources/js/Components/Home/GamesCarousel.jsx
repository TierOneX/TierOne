import { useRef, useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';

/**
 * Props esperadas: games = [{ id, name, category, image, players_count }]
 * image: ruta de la imagen almacenada en la BD (ej: /storage/games/lol.jpg)
 */
export default function GamesCarousel({ games }) {
    const scrollRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const checkScroll = () => {
        if (!scrollRef.current) return;
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        setCanScrollLeft(scrollLeft > 10);
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    };

    useEffect(() => {
        checkScroll();
        const el = scrollRef.current;
        if (el) el.addEventListener('scroll', checkScroll);
        return () => el?.removeEventListener('scroll', checkScroll);
    }, []);

    const scroll = (dir) => {
        if (!scrollRef.current) return;
        scrollRef.current.scrollBy({ left: dir === 'left' ? -320 : 320, behavior: 'smooth' });
    };

    if (!games || games.length === 0) return null;

    return (
        <section id="games-section" className="py-14 lg:py-20" style={{ background: '#0a0a0c' }}>
            <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
                {/* Header */}
                <div className="flex items-end justify-between mb-8">
                    <div>
                        <p className="text-[#e31837] text-xs font-bold uppercase tracking-[0.25em] mb-2 flex items-center gap-2">
                            <span className="w-5 h-[2px] bg-[#e31837] rounded-full" />
                            NUESTROS JUEGOS
                        </p>
                        <h2 className="text-2xl lg:text-4xl font-black italic uppercase text-white">
                            ELIGE TU <span className="text-[#e31837]">ARENA</span>
                        </h2>
                    </div>
                    <div className="hidden sm:flex items-center gap-2">
                        <button onClick={() => scroll('left')} disabled={!canScrollLeft}
                            className={`w-10 h-10 rounded-lg border flex items-center justify-center transition-all ${canScrollLeft ? 'border-white/20 text-white hover:bg-white/10' : 'border-white/5 text-white/20 cursor-not-allowed'}`}>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                        </button>
                        <button onClick={() => scroll('right')} disabled={!canScrollRight}
                            className={`w-10 h-10 rounded-lg border flex items-center justify-center transition-all ${canScrollRight ? 'border-white/20 text-white hover:bg-white/10' : 'border-white/5 text-white/20 cursor-not-allowed'}`}>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                        </button>
                    </div>
                </div>

                {/* Carrusel */}
                <div className="relative">
                    {canScrollLeft && (
                        <div className="hidden sm:block absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
                            style={{ background: 'linear-gradient(90deg, #0a0a0c, transparent)' }} />
                    )}

                    <div ref={scrollRef}
                        className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide"
                        style={{ scrollSnapType: 'x mandatory' }}>
                        {games.map((game) => (
                            <Link
                                key={game.id}
                                href={`/games/${game.id}`}
                                className="group flex-shrink-0 w-[200px] lg:w-[230px] rounded-xl overflow-hidden border border-white/5 hover:border-[#e31837]/40 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-red-900/10"
                                style={{ scrollSnapAlign: 'start', background: '#141418' }}
                            >
                                {/* Imagen del juego */}
                                <div className="relative h-[260px] lg:h-[300px] overflow-hidden">
                                    <img
                                        src={game.image}
                                        alt={game.name}
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#141418] via-transparent to-transparent" />
                                    <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-black/60 text-white backdrop-blur-sm border border-white/10">
                                        {game.category}
                                    </span>
                                </div>

                                {/* Info */}
                                <div className="p-4 -mt-4 relative z-10">
                                    <h3 className="text-white font-bold text-sm uppercase tracking-wide truncate group-hover:text-[#e31837] transition-colors">
                                        {game.name}
                                    </h3>
                                    {game.players_count && (
                                        <div className="flex items-center gap-1.5 mt-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                            <span className="text-gray-500 text-xs font-medium">{game.players_count} jugando</span>
                                        </div>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>

                    {canScrollRight && (
                        <div className="hidden sm:block absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
                            style={{ background: 'linear-gradient(270deg, #0a0a0c, transparent)' }} />
                    )}
                </div>
            </div>
        </section>
    );
}
