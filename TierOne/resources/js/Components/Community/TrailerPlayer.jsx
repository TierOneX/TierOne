import React, { useState } from 'react';

export default function TrailerPlayer({ videos }) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState(videos?.[0]?.video_id);

    if (!videos || videos.length === 0) return null;

    return (
        <>
            <button 
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 rounded-xl bg-white/10 px-8 py-3 font-bold text-white backdrop-blur-md transition-all hover:bg-white/20"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                Ver Trailer
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8">
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
                        onClick={() => setIsOpen(false)}
                    />
                    
                    {/* Modal Content */}
                    <div className="relative w-full max-w-5xl overflow-hidden rounded-3xl bg-[#111111] shadow-2xl ring-1 ring-white/10">
                        <div className="flex items-center justify-between p-6">
                            <h3 className="text-xl font-bold text-white">Trailer Oficial</h3>
                            <button 
                                onClick={() => setIsOpen(false)}
                                className="rounded-lg bg-white/5 p-2 text-white/40 hover:bg-white/10 hover:text-white"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="aspect-video w-full bg-black">
                            <iframe 
                                src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`}
                                className="h-full w-full"
                                allow="autoplay; encrypted-media"
                                allowFullScreen
                            />
                        </div>

                        {videos.length > 1 && (
                            <div className="flex gap-4 overflow-x-auto p-6 hide-scrollbar">
                                {videos.map((v, idx) => (
                                    <button 
                                        key={idx}
                                        onClick={() => setSelectedVideo(v.video_id)}
                                        className={`shrink-0 rounded-xl px-4 py-2 text-sm font-bold transition-all ${
                                            selectedVideo === v.video_id 
                                            ? 'bg-primary text-black' 
                                            : 'bg-white/5 text-white/40 hover:bg-white/10'
                                        }`}
                                    >
                                        {v.name || `Video ${idx + 1}`}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
