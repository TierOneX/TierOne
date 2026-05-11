import React, { useRef, useState } from 'react';
import { Link } from '@inertiajs/react';
import { Flame, Users, Trophy, ChevronRight, Share2, Play } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TrendingBar({ topGames }) {
    const carouselRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);

    if (!topGames || topGames.length === 0) return null;

    return (
        <div className="relative w-full py-10 select-none">
            {/* Header / Titulo Estilizado */}
            <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="relative">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-[2px] w-12 bg-primary" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Tendencias Globales</span>
                    </div>
                    <h2 className="text-5xl font-black uppercase italic tracking-tighter text-white sm:text-7xl">
                        TRENDING <span className="text-outline text-transparent opacity-50" style={{ WebkitTextStroke: '1px white' }}>TWITCH</span>
                    </h2>
                </div>
                
                <div className="flex items-center gap-6">
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Desliza para ver más</span>
                        <div className="mt-2 h-1 w-32 bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                                className="h-full bg-primary"
                                animate={{ x: ["-100%", "100%"] }}
                                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Carousel Container (Infinite Loop) */}
            <div className="relative overflow-hidden" ref={carouselRef}>
                <motion.div 
                    className="flex gap-8"
                    // Duplicate games to create seamless loop
                    animate={{ x: [0, -((topGames.length * 280) + (topGames.length - 1) * 8)] }}
                    transition={{
                        repeat: Infinity,
                        duration: topGames.length * 4,
                        ease: "linear",
                    }}
                    // Pause on hover
                    whileHover={{ animationPlayState: "paused" }}
                >
                    {/* Render duplicated items */}
                    {[...topGames, ...topGames].map((game, idx) => (
                        <TrendingCard 
                            key={`${game.twitch_game_id}-${idx}`} 
                            game={game} 
                            index={idx % topGames.length} 
                            isDragging={false}
                        />
                    ))}
                </motion.div>
                {/* Fade overlays for edges */}
                <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent z-10 pointer-events-none" />
            </div>
        </div>
    );
}

function TrendingCard({ game, index, isDragging }) {
    const CardWrapper = game.slug ? Link : 'div';
    const wrapperProps = game.slug 
        ? { 
            href: route('community.show', game.slug),
            onClick: (e) => isDragging && e.preventDefault() 
          } 
        : {};

    return (
        <motion.div
            className="relative min-w-[240px] sm:min-w-[280px]"
            whileHover={{ y: -10 }}
            transition={{ type: "spring", stiffness: 300 }}
        >
            {/* Numero de Ranking Gigante (Background) */}
            <span 
                className="absolute -top-12 -left-6 text-[12rem] font-black italic leading-none opacity-[0.03] pointer-events-none select-none text-white transition-opacity group-hover:opacity-10"
                style={{ WebkitTextStroke: '2px rgba(255,255,255,0.5)' }}
            >
                {index + 1}
            </span>

            <CardWrapper {...wrapperProps} className="group block relative aspect-[3/4] rounded-[2rem] overflow-hidden bg-[#0F0F0F] border border-white/5 shadow-2xl">
                {/* Imagen Vertical de Portada */}
                <img 
                    src={game.box_art_url} 
                    alt={game.name}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110 brightness-75 group-hover:brightness-100"
                />
                
                {/* Overlay de Vidrio en el Bottom */}
                <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black via-black/80 to-transparent backdrop-blur-[2px] transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="h-2 w-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_#E10600]" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-primary">Top {index + 1} Global</span>
                    </div>
                    
                    <h3 className="text-xl font-black uppercase italic tracking-tighter text-white mb-4 line-clamp-2 leading-none">
                        {game.name}
                    </h3>

                    <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-white/40">
                            <Play size={12} className="fill-current text-primary" />
                            <span>Explorar</span>
                        </div>
                        <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center text-white border border-white/10 group-hover:bg-primary group-hover:text-black group-hover:border-primary transition-all">
                            <ChevronRight size={16} />
                        </div>
                    </div>
                </div>

                {/* Ranking Badge Minimal */}
                <div className="absolute top-6 right-6 h-10 w-10 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white font-black italic shadow-xl opacity-100 group-hover:opacity-0 transition-opacity">
                    #{index + 1}
                </div>
            </CardWrapper>

            {/* Sombra proyectada */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[80%] h-4 bg-primary/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
        </motion.div>
    );
}
