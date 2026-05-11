import React from 'react';

export default function ClipCarousel({ clips }) {
    if (!clips || clips.length === 0) return null;

    return (
        <div className="flex gap-6 overflow-x-auto pb-4 hide-scrollbar">
            {clips.map((clip, idx) => (
                <div key={idx} className="min-w-[300px] max-w-[300px] flex flex-col gap-2">
                    <div className="group relative aspect-video overflow-hidden rounded-xl bg-black ring-1 ring-white/10 transition-all hover:ring-primary/50">
                        <img 
                            src={clip.thumbnail_url} 
                            alt={clip.title}
                            className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                            <button 
                                onClick={() => window.open(clip.url, '_blank')}
                                className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-black"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-1" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            </button>
                        </div>
                        <div className="absolute bottom-2 right-2 rounded bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-md">
                            {Math.round(clip.duration)}s
                        </div>
                    </div>
                    <div>
                        <h4 className="line-clamp-1 text-sm font-bold text-white">{clip.title}</h4>
                        <p className="text-xs text-white/40">{clip.broadcaster_name} • {clip.view_count.toLocaleString()} vistas</p>
                    </div>
                </div>
            ))}
            
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
