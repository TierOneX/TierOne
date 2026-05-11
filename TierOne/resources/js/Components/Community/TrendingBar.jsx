import React from 'react';
import { Flame, MonitorPlay, ChevronRight } from 'lucide-react';

export default function TrendingBar({ topGames }) {
    if (!topGames || topGames.length === 0) return null;

    return (
        <section className="w-full py-12 relative overflow-hidden">
            {/* Decoración de fondo */}
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="mb-8 flex items-end justify-between px-4 sm:px-0">
                <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-[#ff4b2b] shadow-lg shadow-primary/20">
                        <Flame className="text-black" size={28} strokeWidth={2.5} />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white leading-none">
                            Tendencias <span className="text-primary">Twitch</span>
                        </h2>
                        <p className="mt-1 text-sm font-medium text-white/40 flex items-center gap-2">
                            <MonitorPlay size={14} />
                            Los juegos más vistos en vivo ahora mismo
                        </p>
                    </div>
                </div>
                
                <button className="hidden sm:flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/40 hover:text-primary transition-colors group">
                    Ver ranking completo
                    <ChevronRight size={16} className="transition-transform group-hover:translate-x-1" />
                </button>
            </div>

            <div className="flex gap-6 overflow-x-auto pb-6 hide-scrollbar px-4 sm:px-0 -mx-4 sm:mx-0">
                {topGames.map((game, idx) => (
                    <div 
                        key={game.twitch_game_id} 
                        className="group relative min-w-[160px] max-w-[160px] sm:min-w-[200px] sm:max-w-[200px] transition-all duration-500 hover:z-10"
                    >
                        {/* Ranking Glass Badge */}
                        <div className="absolute -left-3 -top-3 z-20 flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 border border-white/20 font-black text-white shadow-xl backdrop-blur-md group-hover:scale-110 group-hover:bg-primary group-hover:text-black group-hover:border-primary transition-all duration-300">
                            {idx + 1}
                        </div>

                        {/* Box Art Container */}
                        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl border border-white/10 bg-[#1A1A1A] shadow-2xl transition-all duration-500 group-hover:shadow-primary/20 group-hover:-translate-y-2">
                            <img 
                                src={game.box_art_url} 
                                alt={game.name}
                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            
                            {/* Overlay Glass */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 transition-opacity group-hover:opacity-80" />
                            
                            <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-2 py-1 rounded-md backdrop-blur-md">
                                    En Vivo
                                </span>
                            </div>
                        </div>

                        {/* Game Name */}
                        <div className="mt-4">
                            <h4 className="line-clamp-1 text-sm sm:text-base font-bold text-white group-hover:text-primary transition-colors tracking-tight">
                                {game.name}
                            </h4>
                            <p className="text-[11px] font-bold text-white/30 uppercase tracking-widest mt-0.5">Ranking Twitch</p>
                        </div>
                    </div>
                ))}
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}} />
        </section>
    );
}
