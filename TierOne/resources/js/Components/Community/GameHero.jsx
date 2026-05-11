import React from 'react';
import { Star, Calendar, Gamepad2, Layers, PlayCircle, Trophy } from 'lucide-react';
import { igdbImageUrl } from '@/Utils/igdb';
import TrailerPlayer from './TrailerPlayer';

export default function GameHero({ juego }) {
    const rating = Math.round(juego.community_rating || juego.critic_rating || 0);

    return (
        <section className="relative min-h-[500px] w-full overflow-hidden sm:min-h-[700px] flex items-end">
            {/* Background Image (Artwork/Screenshot) con Capas */}
            <div className="absolute inset-0 z-0">
                <img 
                    src={igdbImageUrl(juego.artwork_ids?.[0] || juego.screenshot_ids?.[0] || juego.cover_image_id, 't_1080p')} 
                    className="h-full w-full object-cover brightness-[0.25] scale-105"
                    alt="Background"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-transparent to-transparent" />
            </div>

            <div className="container relative z-10 mx-auto pb-16 px-4">
                <div className="flex w-full flex-col gap-10 lg:flex-row lg:items-end">
                    {/* Cover oficial con Glassmorphism Effect */}
                    <div className="hidden lg:block w-72 shrink-0 group">
                        <div className="relative aspect-[3/4] overflow-hidden rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.8)] ring-1 ring-white/10 transition-transform duration-500 group-hover:scale-[1.02]">
                            <img 
                                src={igdbImageUrl(juego.cover_image_id, 't_cover_big_2x')} 
                                alt={juego.nombre}
                                className="h-full w-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                        </div>
                    </div>

                    {/* Información principal */}
                    <div className="flex-1 max-w-4xl">
                        <div className="mb-6 flex flex-wrap gap-2">
                            {juego.genres?.map((genre, idx) => (
                                <span key={idx} className="flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.15em] text-white/70 backdrop-blur-md">
                                    <Layers size={12} className="text-primary" />
                                    {genre}
                                </span>
                            ))}
                        </div>
                        
                        <h1 className="text-5xl font-black uppercase italic leading-[0.9] tracking-tighter text-white sm:text-8xl drop-shadow-2xl">
                            {juego.nombre}
                        </h1>

                        <div className="mt-8 grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-6 sm:gap-10">
                            {juego.developer && (
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Estudio</span>
                                    <div className="flex items-center gap-2">
                                        <Gamepad2 size={16} className="text-primary" />
                                        <span className="font-bold text-white text-sm sm:text-base">{juego.developer}</span>
                                    </div>
                                </div>
                            )}
                            {juego.fecha_lanzamiento && (
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Lanzamiento</span>
                                    <div className="flex items-center gap-2">
                                        <Calendar size={16} className="text-primary" />
                                        <span className="font-bold text-white text-sm sm:text-base">{new Date(juego.fecha_lanzamiento).getFullYear()}</span>
                                    </div>
                                </div>
                            )}
                            {rating > 0 && (
                                <div className="group flex items-center gap-5 bg-white/5 border border-white/10 rounded-[2rem] p-4 backdrop-blur-xl transition-all hover:bg-white/10 hover:border-white/20">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-primary/20 blur-md opacity-40 group-hover:opacity-60 transition-opacity" />
                                        <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 shadow-xl">
                                            <Star size={28} className="text-primary fill-primary" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-3xl font-black text-white">{rating}</span>
                                            <span className="text-sm font-black text-primary">%</span>
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Puntuación Global</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Botones de acción rápida */}
                        <div className="mt-10 flex flex-wrap gap-4 sm:gap-6">
                            <button className="relative flex items-center gap-3 rounded-2xl bg-[#E10600] px-12 py-5 font-black uppercase italic tracking-tighter text-white transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(225,6,0,0.8)] active:scale-95 group overflow-hidden border border-white/20">
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                                <div className="relative z-10 flex items-center gap-3">
                                    <Trophy size={22} strokeWidth={3} className="text-white" />
                                    <span>Unirse al Torneo</span>
                                </div>
                            </button>
                            
                            <TrailerPlayer videos={juego.video_ids} />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
