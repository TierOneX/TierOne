import React from 'react';
import { Globe, Facebook, Twitter, Twitch, Instagram, Youtube, ShoppingCart, MessageSquare, ExternalLink } from 'lucide-react';

const CATEGORY_MAP = {
    1: { name: 'Sitio Oficial', icon: <Globe size={18} /> },
    4: { name: 'Facebook', icon: <Facebook size={18} /> },
    5: { name: 'Twitter / X', icon: <Twitter size={18} /> },
    6: { name: 'Twitch', icon: <Twitch size={18} /> },
    8: { name: 'Instagram', icon: <Instagram size={18} /> },
    9: { name: 'YouTube', icon: <Youtube size={18} /> },
    11: { name: 'Steam', icon: <ShoppingCart size={18} /> },
    12: { name: 'Reddit', icon: <MessageSquare size={18} /> },
    13: { name: 'Epic Games', icon: <ShoppingCart size={18} /> },
    16: { name: 'Discord', icon: <MessageSquare size={18} /> },
};

export default function GameWebLinks({ websites }) {
    if (!websites || websites.length === 0) return null;

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Conecta</span>
                <h4 className="text-xl font-black uppercase italic tracking-tighter text-white">Redes y Enlaces</h4>
            </div>
            
            <div className="flex flex-col gap-3">
                {websites.map((site, idx) => {
                    const info = CATEGORY_MAP[site.category] || { name: 'Enlace', icon: <ExternalLink size={18} /> };
                    return (
                        <a 
                            key={idx} 
                            href={site.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center gap-4 rounded-2xl bg-white/[0.03] p-4 text-sm font-bold text-white transition-all hover:bg-white/[0.08] hover:translate-x-1"
                        >
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-white/40 group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                                {info.icon}
                            </div>
                            <span className="flex-1">{info.name}</span>
                            <ExternalLink size={14} className="text-white/10 group-hover:text-white/30 transition-colors" />
                        </a>
                    );
                })}
            </div>
        </div>
    );
}
