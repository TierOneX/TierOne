import React from 'react';
import { Link } from '@inertiajs/react';
import { Star, ChevronRight } from 'lucide-react';
import { igdbImageUrl } from '@/Utils/igdb';

export default function GameCard({ juego }) {
    const rating = Math.round(juego.community_rating || juego.critic_rating || 0);
    
    const getRatingColor = (score) => {
        if (score >= 80) return 'text-green-400';
        if (score >= 60) return 'text-yellow-400';
        return 'text-red-400';
    };

    return (
        <Link 
            href={route('community.show', juego.slug)}
            className="group relative block w-full transition-all duration-500"
        >
            {/* Imagen de Portada con Efectos */}
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl border border-white/10 bg-[#1A1A1A] shadow-xl transition-all duration-500 group-hover:shadow-primary/20 group-hover:-translate-y-2">
                <img 
                    src={igdbImageUrl(juego.cover_image_id, 't_cover_big')} 
                    alt={juego.nombre}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Badge de Rating Flotante */}
                {rating > 0 && (
                    <div className="absolute right-3 top-3 flex items-center gap-1 rounded-xl bg-black/60 px-2 py-1 text-xs font-black backdrop-blur-md border border-white/10 shadow-lg">
                        <Star size={12} className={`fill-current ${getRatingColor(rating)}`} />
                        <span className="text-white">{rating}</span>
                    </div>
                )}

                {/* Overlay de Hover Premium */}
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100 backdrop-blur-[2px]">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-black scale-50 opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100 shadow-[0_0_20px_rgba(227,24,55,0.4)]">
                        <ChevronRight size={28} strokeWidth={3} />
                    </div>
                    <span className="mt-3 text-[10px] font-black uppercase tracking-[0.2em] text-white">Ver Ficha</span>
                </div>
            </div>

            {/* Info del Juego */}
            <div className="mt-4 px-1">
                <h3 className="line-clamp-1 text-base font-black uppercase italic tracking-tighter text-white transition-colors group-hover:text-primary">
                    {juego.nombre}
                </h3>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {juego.genres && juego.genres.slice(0, 2).map((genre, idx) => (
                        <span key={idx} className="rounded-md bg-white/5 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-white/40 border border-white/5">
                            {genre}
                        </span>
                    ))}
                </div>
            </div>
        </Link>
    );
}
