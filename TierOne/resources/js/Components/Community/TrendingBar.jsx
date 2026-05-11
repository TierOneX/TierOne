import React from 'react';
import { Link } from '@inertiajs/react';

export default function TrendingBar({ topGames }) {
    if (!topGames || topGames.length === 0) return null;

    return (
        <div className="w-full py-8">
            <div className="mb-6 flex items-center justify-between px-4 sm:px-0">
                <h2 className="text-xl font-black uppercase tracking-tighter text-white sm:text-2xl">
                    🔥 Trending en <span className="text-[#9146FF]">Twitch</span>
                </h2>
                <div className="flex gap-2">
                    {/* Controles de scroll si fuera necesario */}
                </div>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar px-4 sm:px-0">
                {topGames.map((game, idx) => (
                    <div 
                        key={game.twitch_game_id} 
                        className="group relative min-w-[140px] max-w-[140px] cursor-pointer sm:min-w-[180px] sm:max-w-[180px]"
                    >
                        {/* Ranking Badge */}
                        <div className="absolute -left-2 -top-2 z-10 flex h-8 w-8 items-center justify-center rounded-lg bg-primary font-black text-black shadow-lg shadow-primary/20">
                            {idx + 1}
                        </div>

                        {/* Box Art */}
                        <div className="aspect-[3/4] w-full overflow-hidden rounded-xl border border-white/5 bg-[#1A1A1A]">
                            <img 
                                src={game.box_art_url} 
                                alt={game.name}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                        </div>

                        {/* Game Name */}
                        <div className="mt-3">
                            <h4 className="line-clamp-1 text-sm font-bold text-white group-hover:text-primary transition-colors">
                                {game.name}
                            </h4>
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
        </div>
    );
}
