import React from 'react';
import { Link } from '@inertiajs/react';
import { igdbImageUrl } from '@/Utils/igdb';

export default function GameCard({ juego }) {
    const rating = Math.round(juego.community_rating || juego.critic_rating || 0);
    
    const getRatingColor = (score) => {
        if (score >= 80) return 'text-green-400 border-green-400';
        if (score >= 60) return 'text-yellow-400 border-yellow-400';
        return 'text-red-400 border-red-400';
    };

    return (
        <Link 
            href={route('community.show', juego.slug)}
            className="group relative block overflow-hidden rounded-xl bg-[#1A1A1A] transition-all hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
        >
            {/* Imagen de Portada */}
            <div className="aspect-[3/4] w-full overflow-hidden">
                <img 
                    src={igdbImageUrl(juego.cover_image_id, 't_cover_big')} 
                    alt={juego.nombre}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                {/* Badge de Rating */}
                {rating > 0 && (
                    <div className={`absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full border-2 bg-black/60 font-bold backdrop-blur-md ${getRatingColor(rating)}`}>
                        {rating}
                    </div>
                )}

                {/* Overlay al hacer Hover */}
                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black via-black/20 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <p className="text-xs font-semibold uppercase tracking-wider text-primary">Ver Detalles</p>
                </div>
            </div>

            {/* Info del Juego */}
            <div className="p-4">
                <h3 className="line-clamp-1 text-lg font-bold text-white transition-colors group-hover:text-primary">
                    {juego.nombre}
                </h3>
                <div className="mt-2 flex flex-wrap gap-2">
                    {juego.genres && juego.genres.slice(0, 2).map((genre, idx) => (
                        <span key={idx} className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-medium text-white/60">
                            {genre}
                        </span>
                    ))}
                </div>
            </div>
        </Link>
    );
}
