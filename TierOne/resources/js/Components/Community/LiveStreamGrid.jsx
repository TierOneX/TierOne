import React from 'react';
import { Users, Play, Globe } from 'lucide-react';

const StreamCard = ({ stream }) => {
    const formattedViewers = new Intl.NumberFormat('es-ES').format(stream.viewer_count);

    return (
        <a 
            href={`https://twitch.tv/${stream.user_login}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex flex-col overflow-hidden rounded-2xl bg-[#141414] border border-white/5 transition-all duration-300 hover:border-primary/30 hover:shadow-[0_15px_30px_rgba(0,0,0,0.4)]"
        >
            <div className="relative aspect-video w-full overflow-hidden">
                <img 
                    src={stream.thumbnail_url} 
                    alt={stream.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Status Badge */}
                <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-lg bg-red-600 px-2 py-1 text-[10px] font-black text-white uppercase tracking-tighter animate-pulse shadow-lg">
                    <div className="h-1.5 w-1.5 rounded-full bg-white" />
                    EN VIVO
                </div>

                {/* Viewer Count Glass */}
                <div className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-xl bg-black/60 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-md border border-white/10">
                    <Users size={12} className="text-primary" />
                    {formattedViewers}
                </div>

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-black scale-75 group-hover:scale-100 transition-transform duration-300">
                        <Play size={20} fill="currentColor" />
                    </div>
                </div>
            </div>

            <div className="p-4 flex-1 flex flex-col">
                <h4 className="line-clamp-2 text-sm font-bold text-white group-hover:text-primary transition-colors leading-relaxed">
                    {stream.title}
                </h4>
                
                <div className="mt-auto pt-4 flex items-center justify-between border-t border-white/5">
                    <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                            {stream.user_name[0]}
                        </div>
                        <span className="text-xs font-medium text-white/50">{stream.user_name}</span>
                    </div>
                    
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-white/30 uppercase tracking-widest">
                        <Globe size={10} />
                        {stream.language === 'es' ? 'Español' : stream.language.toUpperCase()}
                    </div>
                </div>
            </div>
        </a>
    );
};

export default function LiveStreamGrid({ streams }) {
    if (!streams || streams.length === 0) {
        return (
            <div className="flex h-64 flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-white/[0.02] text-center p-8">
                <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                    <MonitorPlay className="text-white/20" size={32} />
                </div>
                <h4 className="text-lg font-bold text-white/60">Sin transmisiones actuales</h4>
                <p className="text-sm text-white/30 max-w-xs mt-2">No hay streams en vivo ahora mismo para este juego. ¡Vuelve en unos minutos!</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {streams.map((stream, idx) => (
                <StreamCard key={idx} stream={stream} />
            ))}
        </div>
    );
}
