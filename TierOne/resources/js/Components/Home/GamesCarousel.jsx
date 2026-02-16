import { useState, useRef, useEffect } from 'react';
import { Link } from '@inertiajs/react';

const games = [
    {
        id: 1,
        name: 'League of Legends',
        category: 'MOBA',
        players: '12.4K jugando',
        color: '#C89B3C',
        icon: '⚔️',
        bgGradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    },
    {
        id: 2,
        name: 'Valorant',
        category: 'FPS Táctico',
        players: '9.8K jugando',
        color: '#FF4655',
        icon: '🎯',
        bgGradient: 'linear-gradient(135deg, #1a0a0a 0%, #2d1515 50%, #4a1c1c 100%)',
    },
    {
        id: 3,
        name: 'Counter-Strike 2',
        category: 'FPS',
        players: '15.2K jugando',
        color: '#F0B232',
        icon: '💣',
        bgGradient: 'linear-gradient(135deg, #1a1a0a 0%, #2d2d15 50%, #4a4a1c 100%)',
    },
    {
        id: 4,
        name: 'Fortnite',
        category: 'Battle Royale',
        players: '8.1K jugando',
        color: '#00D4FF',
        icon: '🏗️',
        bgGradient: 'linear-gradient(135deg, #0a1a1a 0%, #152d2d 50%, #1c4a4a 100%)',
    },
    {
        id: 5,
        name: 'Rocket League',
        category: 'Deportivo',
        players: '5.3K jugando',
        color: '#0078F2',
        icon: '🚗',
        bgGradient: 'linear-gradient(135deg, #0a0a1a 0%, #15152d 50%, #1c1c4a 100%)',
    },
    {
        id: 6,
        name: 'Apex Legends',
        category: 'Battle Royale',
        players: '7.6K jugando',
        color: '#DA292A',
        icon: '🔫',
        bgGradient: 'linear-gradient(135deg, #1a0a0a 0%, #2d1010 50%, #4a1818 100%)',
    },
    {
        id: 7,
        name: 'FIFA 25',
        category: 'Deportivo',
        players: '6.9K jugando',
        color: '#1DB954',
        icon: '⚽',
        bgGradient: 'linear-gradient(135deg, #0a1a0a 0%, #102d10 50%, #184a18 100%)',
    },
    {
        id: 8,
        name: 'Call of Duty',
        category: 'FPS',
        players: '11.1K jugando',
        color: '#FF8C00',
        icon: '🎖️',
        bgGradient: 'linear-gradient(135deg, #1a150a 0%, #2d2210 50%, #4a3818 100%)',
    },
];

export default function GamesCarousel() {
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
        const amount = scrollRef.current.clientWidth * 0.7;
        scrollRef.current.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
    };

    return (
        <section id="games-section" className="py-12 lg:py-20" style={{ background: '#0d0d0f' }}>
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
                        <button
                            onClick={() => scroll('left')}
                            disabled={!canScrollLeft}
                            className={`w-10 h-10 rounded-lg border flex items-center justify-center transition-all duration-200 ${canScrollLeft ? 'border-white/20 text-white hover:bg-white/10' : 'border-white/5 text-white/20 cursor-not-allowed'}`}
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            disabled={!canScrollRight}
                            className={`w-10 h-10 rounded-lg border flex items-center justify-center transition-all duration-200 ${canScrollRight ? 'border-white/20 text-white hover:bg-white/10' : 'border-white/5 text-white/20 cursor-not-allowed'}`}
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                        </button>
                    </div>
                </div>

                {/* Carrusel horizontal */}
                <div className="relative">
                    {/* Gradient fade izquierda */}
                    {canScrollLeft && (
                        <div className="hidden sm:block absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
                            style={{ background: 'linear-gradient(90deg, #0d0d0f 0%, transparent 100%)' }} />
                    )}

                    <div
                        ref={scrollRef}
                        className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide"
                        style={{ scrollSnapType: 'x mandatory', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {games.map((game) => (
                            <Link
                                key={game.id}
                                href={`/games/${game.id}`}
                                className="group flex-shrink-0 w-[200px] lg:w-[220px] rounded-xl overflow-hidden border border-white/5 hover:border-white/15 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                                style={{ scrollSnapAlign: 'start', background: game.bgGradient }}
                            >
                                {/* Icono grande como placeholder de imagen */}
                                <div className="relative h-[180px] lg:h-[200px] flex items-center justify-center overflow-hidden">
                                    <span className="text-7xl lg:text-8xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 filter drop-shadow-lg">
                                        {game.icon}
                                    </span>
                                    {/* Overlay gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                    {/* Badge categoría */}
                                    <span
                                        className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md"
                                        style={{ background: `${game.color}20`, color: game.color, border: `1px solid ${game.color}30` }}
                                    >
                                        {game.category}
                                    </span>
                                </div>

                                {/* Info */}
                                <div className="p-4 pt-2">
                                    <h3 className="text-white font-bold text-sm uppercase tracking-wide truncate group-hover:text-gray-200 transition-colors">
                                        {game.name}
                                    </h3>
                                    <div className="flex items-center gap-1.5 mt-2">
                                        <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#1db954' }} />
                                        <span className="text-gray-500 text-xs font-medium">{game.players}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Gradient fade derecha */}
                    {canScrollRight && (
                        <div className="hidden sm:block absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
                            style={{ background: 'linear-gradient(270deg, #0d0d0f 0%, transparent 100%)' }} />
                    )}
                </div>
            </div>
        </section>
    );
}
