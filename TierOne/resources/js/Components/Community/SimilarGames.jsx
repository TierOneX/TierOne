import React from 'react';
import { Link } from '@inertiajs/react';
import { igdbImageUrl } from '@/Utils/igdb';

export default function SimilarGames({ similarGames }) {
    if (!similarGames || similarGames.length === 0) return null;

    return (
        <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white/40">Juegos Similares</h4>
            <div className="grid grid-cols-2 gap-4">
                {similarGames.slice(0, 4).map((sim, idx) => (
                    <Link 
                        key={idx} 
                        href={`/community/${sim.slug}`}
                        className="group"
                    >
                        <div className="aspect-[3/4] overflow-hidden rounded-xl bg-white/5 ring-1 ring-white/10 transition-all group-hover:ring-primary/50 group-hover:shadow-[0_10px_20px_rgba(0,0,0,0.3)]">
                            <img 
                                src={igdbImageUrl(sim.cover_image_id, 't_cover_big')} 
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                alt={sim.name}
                            />
                        </div>
                        <p className="mt-2 line-clamp-1 text-xs font-bold text-white/60 transition-colors group-hover:text-white">
                            {sim.name}
                        </p>
                    </Link>
                ))}
            </div>
        </div>
    );
}
