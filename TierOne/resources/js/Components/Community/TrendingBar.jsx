import React, { useRef, useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { Flame, Users, Trophy, ChevronRight, MousePointer2 } from 'lucide-react';
import { motion, useAnimation } from 'framer-motion';

export default function TrendingBar({ topGames }) {
    const [isDragging, setIsDragging] = useState(false);
    const carouselRef = useRef(null);

    if (!topGames || topGames.length === 0) return null;

    return (
        <div className="relative w-full">
            {/* Header / Title */}
            <div className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <div className="absolute inset-0 bg-primary blur-lg opacity-20 animate-pulse" />
                        <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-primary">
                            <Flame size={28} className="fill-current" />
                        </div>
                    </div>
                    <div>
                        <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white sm:text-4xl">
                            Tendencias <span className="text-primary">Twitch</span>
                        </h2>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="flex h-1.5 w-1.5 rounded-full bg-green-500 animate-ping" />
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">En vivo ahora mismo</p>
                        </div>
                    </div>
                </div>
                
                <div className="hidden items-center gap-4 sm:flex">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/20">
                        <MousePointer2 size={12} />
                        <span>Arrastra para explorar</span>
                    </div>
                </div>
            </div>

            {/* Draggable Carousel with Framer Motion */}
            <div className="relative group">
                <motion.div 
                    ref={carouselRef}
                    className="flex gap-6 overflow-x-hidden cursor-grab active:cursor-grabbing py-4"
                    whileTap={{ cursor: "grabbing" }}
                >
                    <motion.div 
                        drag="x"
                        dragConstraints={carouselRef}
                        className="flex gap-6"
                        onDragStart={() => setIsDragging(true)}
                        onDragEnd={() => setTimeout(() => setIsDragging(false), 100)}
                    >
                        {topGames.map((game, index) => (
                            <TrendingCard 
                                key={game.twitch_game_id} 
                                game={game} 
                                index={index} 
                                isDragging={isDragging}
                            />
                        ))}
                    </motion.div>
                </motion.div>

                {/* Fade overlays for depth */}
                <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#0a0a0a] to-transparent pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#0a0a0a] to-transparent pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
        </div>
    );
}

function TrendingCard({ game, index, isDragging }) {
    // Si el juego tiene slug, enlazamos a la comunidad, si no, es solo informativo
    const CardWrapper = game.slug ? Link : 'div';
    const wrapperProps = game.slug 
        ? { 
            href: route('community.show', game.slug),
            onClick: (e) => isDragging && e.preventDefault() 
          } 
        : {};

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative min-w-[280px] sm:min-w-[320px] select-none"
        >
            <CardWrapper {...wrapperProps} className="group block relative aspect-video rounded-3xl overflow-hidden bg-[#1A1A1A] border border-white/5 shadow-2xl transition-all duration-500 hover:border-primary/50 hover:shadow-primary/10">
                {/* Background Image */}
                <img 
                    src={game.box_art_url} 
                    alt={game.name}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 brightness-50 group-hover:brightness-75"
                />
                
                {/* Overlay Gradiente */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                {/* Badge de Ranking */}
                <div className="absolute top-4 left-4 flex items-center justify-center">
                    <div className="relative">
                        <div className="absolute inset-0 bg-white/20 blur-md rounded-full" />
                        <div className="relative h-10 w-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-black italic">
                            #{index + 1}
                        </div>
                    </div>
                </div>

                {/* Content Info */}
                <div className="absolute inset-x-0 bottom-0 p-6">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="px-2 py-0.5 rounded-md bg-primary text-black text-[9px] font-black uppercase tracking-widest">
                            Top Tier
                        </div>
                    </div>
                    <h3 className="text-xl font-black uppercase italic tracking-tighter text-white group-hover:text-primary transition-colors line-clamp-1">
                        {game.name}
                    </h3>
                    
                    {game.slug && (
                        <div className="mt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40 group-hover:text-white transition-colors">
                            <span>Explorar Comunidad</span>
                            <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                    )}
                </div>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 border-2 border-primary opacity-0 group-hover:opacity-20 transition-opacity rounded-3xl pointer-events-none" />
            </CardWrapper>
        </motion.div>
    );
}
