import React from 'react';
import { Play, Eye, Clock } from 'lucide-react';

export default function ClipCarousel({ clips }) {
    if (!clips || clips.length === 0) return null;

    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {clips.map((clip, idx) => (
                <div 
                    key={idx} 
                    className="group relative flex flex-col gap-4 p-4 rounded-3xl bg-white/[0.02] transition-all hover:bg-white/[0.05] hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:-translate-y-1 cursor-pointer"
                    onClick={() => window.open(clip.url, '_blank')}
                >
                    {/* Thumbnail Container — estático, nunca se transforma */}
                    <div className="relative aspect-video overflow-hidden rounded-2xl bg-black">
                        <img 
                            src={clip.thumbnail_url} 
                            alt={clip.title}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100"
                        />
                        
                        {/* Play Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-transparent transition-colors">
                            <div className="h-14 w-14 rounded-full bg-primary/90 text-black flex items-center justify-center shadow-2xl scale-90 group-hover:scale-100 transition-transform shadow-primary/20">
                                <Play size={24} className="fill-current ml-1" />
                            </div>
                        </div>

                        {/* Duration Badge */}
                        <div className="absolute bottom-3 right-3 rounded-lg bg-black/60 px-2 py-1 text-[10px] font-black text-white backdrop-blur-md flex items-center gap-1">
                            <Clock size={10} />
                            {Math.round(clip.duration)}s
                        </div>
                    </div>

                    {/* Meta Info */}
                    <div className="px-1">
                        <h4 className="line-clamp-2 text-base font-black uppercase italic tracking-tighter text-white group-hover:text-primary transition-colors leading-tight mb-2">
                            {clip.title}
                        </h4>
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/30">{clip.broadcaster_name}</span>
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-white/20">
                                <Eye size={12} />
                                <span>{clip.view_count.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Shimmer Effect */}
                    <div className="absolute inset-0 rounded-3xl pointer-events-none transition-all" />
                </div>
            ))}
        </div>
    );
}
