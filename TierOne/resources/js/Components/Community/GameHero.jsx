import React from 'react';
import { igdbImageUrl } from '@/Utils/igdb';
import TrailerPlayer from './TrailerPlayer';

export default function GameHero({ juego }) {
    const rating = Math.round(juego.community_rating || juego.critic_rating || 0);

    return (
        <section className="relative h-[450px] w-full overflow-hidden sm:h-[600px]">
            {/* Background Image (Artwork/Screenshot) */}
            <div className="absolute inset-0 z-0">
                <img 
                    src={igdbImageUrl(juego.artwork_ids?.[0] || juego.screenshot_ids?.[0], 't_1080p')} 
                    className="h-full w-full object-cover brightness-[0.3]"
                    alt="Background"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
            </div>

            <div className="container relative z-10 mx-auto flex h-full items-end pb-12 px-4">
                <div className="flex w-full flex-col gap-8 md:flex-row md:items-end">
                    {/* Cover oficial */}
                    <div className="hidden w-48 shrink-0 overflow-hidden rounded-2xl shadow-2xl shadow-black/50 md:block lg:w-64">
                        <img 
                            src={igdbImageUrl(juego.cover_image_id, 't_cover_big_2x')} 
                            alt={juego.nombre}
                            className="aspect-[3/4] w-full object-cover"
                        />
                    </div>

                    {/* Información principal */}
                    <div className="flex-1">
                        <div className="mb-4 flex flex-wrap gap-2">
                            {juego.genres?.map((genre, idx) => (
                                <span key={idx} className="rounded-full bg-primary/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary backdrop-blur-md">
                                    {genre}
                                </span>
                            ))}
                        </div>
                        
                        <h1 className="text-4xl font-black uppercase italic leading-none tracking-tighter text-white sm:text-7xl">
                            {juego.nombre}
                        </h1>

                        <div className="mt-4 flex flex-wrap items-center gap-6 text-white/60">
                            {juego.developer && (
                                <div className="flex flex-col">
                                    <span className="text-[10px] uppercase tracking-widest">Desarrollador</span>
                                    <span className="font-bold text-white">{juego.developer}</span>
                                </div>
                            )}
                            {juego.fecha_lanzamiento && (
                                <div className="flex flex-col">
                                    <span className="text-[10px] uppercase tracking-widest">Lanzamiento</span>
                                    <span className="font-bold text-white">{new Date(juego.fecha_lanzamiento).getFullYear()}</span>
                                </div>
                            )}
                            {rating > 0 && (
                                <div className="flex items-center gap-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 font-black text-white ring-1 ring-white/10">
                                        {rating}
                                    </div>
                                    <div className="flex flex-col leading-tight">
                                        <span className="text-[10px] uppercase tracking-widest">Rating</span>
                                        <span className="text-xs">IGDB Global</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Botones de acción rápida */}
                        <div className="mt-8 flex flex-wrap gap-4">
                            <button className="flex items-center gap-2 rounded-xl bg-primary px-8 py-3 font-bold text-black transition-transform hover:scale-105 active:scale-95">
                                🎮 Unirse al Torneo
                            </button>
                            <TrailerPlayer videos={juego.video_ids} />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
