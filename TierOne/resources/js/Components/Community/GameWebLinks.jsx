import React from 'react';

const CATEGORY_MAP = {
    1: { name: 'Sitio Oficial', icon: '🌐' },
    4: { name: 'Facebook', icon: 'FB' },
    5: { name: 'Twitter / X', icon: '𝕏' },
    6: { name: 'Twitch', icon: '🟣' },
    8: { name: 'Instagram', icon: '📸' },
    9: { name: 'YouTube', icon: '🔴' },
    11: { name: 'Steam', icon: '🎮' },
    12: { name: 'Reddit', icon: '🟧' },
    13: { name: 'Epic Games', icon: 'EG' },
    16: { name: 'Discord', icon: '💬' },
};

export default function GameWebLinks({ websites }) {
    if (!websites || websites.length === 0) return null;

    return (
        <div className="flex flex-col gap-2">
            <h4 className="mb-2 text-xs font-bold uppercase tracking-widest text-white/40">Enlaces Oficiales</h4>
            <div className="flex flex-col gap-3">
                {websites.map((site, idx) => {
                    const info = CATEGORY_MAP[site.category] || { name: 'Enlace', icon: '🔗' };
                    return (
                        <a 
                            key={idx} 
                            href={site.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 rounded-lg bg-white/5 p-3 text-sm font-medium text-white transition-all hover:bg-white/10 hover:text-primary"
                        >
                            <span className="text-lg">{info.icon}</span>
                            <span>{info.name}</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="ml-auto h-4 w-4 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                        </a>
                    );
                })}
            </div>
        </div>
    );
}
