import React, { useRef } from 'react';
import { Link } from '@inertiajs/react';
import { Flame, ChevronRight, Play } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TrendingBar({ topGames }) {
    if (!topGames || topGames.length === 0) return null;

    // Duplicamos para el efecto de loop infinito
    const duplicatedGames = [...topGames, ...topGames];

    return (
        <div className="relative w-full py-16 select-none overflow-hidden">
            {/* Header / Titulo */}
            <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 px-4">
                <div className="relative">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-[2px] w-12 bg-primary" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Twitch Live</span>
                    </div>
                    <h2 className="text-5xl font-black uppercase italic tracking-tighter text-white sm:text-7xl">
                        TOP <span className="text-outline text-transparent opacity-50" style={{ WebkitTextStroke: '1px white' }}>TRENDING</span>
                    </h2>
                </div>
            </div>

            {/* Infinite Loop Container */}
            <div className="relative flex">
                <motion.div 
                    className="flex gap-8 px-4"
                    animate={{ 
                        x: [0, -((topGames.length * 280) + (topGames.length * 32))] 
                    }}
                    transition={{ 
                        duration: topGames.length * 5,
                        ease: "linear", 
                        repeat: Infinity 
                    }}
                    whileHover={{ animationPlayState: "paused" }}
                >
                    {duplicatedGames.map((game, index) => (
                        <TrendingCard 
                            key={`${game.twitch_game_id}-${index}`} 
                            game={game} 
                            index={index % topGames.length} 
                        />
                    ))}
                </motion.div>

                {/* Overlays para el efecto de desvanecimiento en los bordes */}
                <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#0a0a0a] to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#0a0a0a] to-transparent z-10 pointer-events-none" />
            </div>
        </div>
    );
}

function TrendingCard({ game, index }) {
    // Solo usamos Link si hay un slug disponible en nuestra base de datos
    const CardWrapper = game.slug ? Link : 'div';
    const wrapperProps = game.slug ? { href: route('community.show', game.slug) } : {};

    return (
        <motion.div
            className="relative min-w-[240px] sm:min-w-[280px]"
            whileHover={{ y: -10 }}
            transition={{ type: "spring", stiffness: 300 }}
        >
            {/* Numero de Ranking Gigante (Background) - Solid Red and High Visibility */}
            <span 
                className="absolute -top-16 -left-10 text-[16rem] font-black italic leading-none pointer-events-none select-none text-[#E10600] opacity-20 group-hover:opacity-40 transition-all duration-700 group-hover:scale-125 group-hover:-rotate-6"
            >
                {index + 1}
            </span>

            <CardWrapper 
                {...wrapperProps} 
                className={`group block relative aspect-[3/4] rounded-[2rem] overflow-hidden bg-[#0F0F0F] border border-white/5 shadow-2xl ${game.slug ? 'cursor-pointer' : 'cursor-default'}`}
            >
                {/* Imagen Vertical de Portada */}
                <img 
                    src={game.box_art_url} 
                    alt={game.name}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110 brightness-75 group-hover:brightness-100"
                />
                
                {/* Overlay Informativo */}
                <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black via-black/80 to-transparent backdrop-blur-[2px]">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="h-2 w-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_#E10600]" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-primary">Top {index + 1} Global</span>
                    </div>
                    
                    <h3 className="text-xl font-black uppercase italic tracking-tighter text-white mb-4 line-clamp-2 leading-none">
                        {game.name}
                    </h3>

                    {/* Mostrar botón de explorar solo si el juego existe en TierOne */}
                    {game.slug ? (
                        <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-white/40">
                                <Play size={12} className="fill-current text-primary" />
                                <span>Explorar</span>
                            </div>
                            <div className="h-8 w-8 rounded-full bg-primary text-black flex items-center justify-center transition-all">
                                <ChevronRight size={16} />
                            </div>
                        </div>
                    ) : (
                        <div className="text-[9px] font-bold text-white/20 uppercase tracking-widest">
                            No disponible en TierOne
                        </div>
                    )}
                </div>

                {/* Badge minimalista */}
                <div className="absolute top-6 right-6 h-10 w-10 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white font-black italic shadow-xl">
                    #{index + 1}
                </div>
            </CardWrapper>

            {/* Glow de sombra */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[80%] h-4 bg-primary/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
        </motion.div>
    );
}
