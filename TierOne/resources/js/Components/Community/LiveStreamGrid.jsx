import React from 'react';

const StreamCard = ({ stream }) => (
    <a 
        href={`https://twitch.tv/${stream.user_login}`}
        target="_blank"
        rel="noopener noreferrer"
        className="group block overflow-hidden rounded-xl bg-[#1A1A1A] transition-all hover:-translate-y-1"
    >
        <div className="relative aspect-video w-full overflow-hidden">
            <img 
                src={stream.thumbnail_url} 
                alt={stream.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Live Badge */}
            <div className="absolute left-2 top-2 rounded bg-red-600 px-1.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-tighter">
                LIVE
            </div>
            {/* Viewer Count */}
            <div className="absolute bottom-2 right-2 rounded bg-black/60 px-2 py-0.5 text-xs font-medium text-white backdrop-blur-md">
                {stream.viewer_count.toLocaleString()} viewers
            </div>
        </div>
        <div className="p-3">
            <h4 className="line-clamp-1 text-sm font-bold text-white group-hover:text-primary transition-colors">
                {stream.title}
            </h4>
            <div className="mt-1 flex items-center gap-2">
                <span className="text-xs text-white/40">{stream.user_name}</span>
                <span className="text-[10px] text-white/20">•</span>
                <span className="text-[10px] uppercase text-white/40">{stream.language}</span>
            </div>
        </div>
    </a>
);

export default function LiveStreamGrid({ streams }) {
    if (!streams || streams.length === 0) {
        return (
            <div className="flex h-48 flex-col items-center justify-center rounded-2xl border border-white/5 bg-white/5 text-center">
                <p className="text-white/40">No hay streams en vivo ahora mismo para este juego.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {streams.map((stream, idx) => (
                <StreamCard key={idx} stream={stream} />
            ))}
        </div>
    );
}
