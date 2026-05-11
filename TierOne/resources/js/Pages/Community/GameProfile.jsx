import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import GameHero from '@/Components/Community/GameHero';
import LiveStreamGrid from '@/Components/Community/LiveStreamGrid';
import GameWebLinks from '@/Components/Community/GameWebLinks';
import TrailerPlayer from '@/Components/Community/TrailerPlayer';
import ClipCarousel from '@/Components/Community/ClipCarousel';
import SimilarGames from '@/Components/Community/SimilarGames';
import { igdbImageUrl } from '@/Utils/igdb';
import { Info, Radio, Film, Image as ImageIcon, Trophy, ShoppingBag, ChevronRight } from 'lucide-react';

export default function GameProfile({ juego, liveStreams, topClips, torneos }) {
    const [activeTab, setActiveTab] = useState('about');

    const tabs = [
        { id: 'about', name: 'Información', icon: <Info size={18} /> },
        { id: 'live', name: `En Vivo (${liveStreams?.length || 0})`, icon: <Radio size={18} /> },
        { id: 'clips', name: 'Clips', icon: <Film size={18} /> },
        { id: 'gallery', name: 'Galería', icon: <ImageIcon size={18} /> },
    ];

    return (
        <MainLayout>
            <Head title={`${juego.nombre} - Comunidad TierOne`} />

            <GameHero juego={juego} />

            <div className="container mx-auto px-4 py-16">
                <div className="flex flex-col gap-12 lg:flex-row">
                    {/* COLUMNA PRINCIPAL */}
                    <div className="flex-1 min-w-0">
                        {/* TABS SELECTOR PREMIUM */}
                        <div className="mb-12 flex gap-2 overflow-x-auto border-b border-white/5 pb-px hide-scrollbar">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex shrink-0 items-center gap-2.5 px-6 py-4 text-sm font-black uppercase tracking-widest transition-all relative ${
                                        activeTab === tab.id 
                                        ? 'text-primary' 
                                        : 'text-white/30 hover:text-white'
                                    }`}
                                >
                                    {tab.icon}
                                    <span>{tab.name}</span>
                                    {activeTab === tab.id && (
                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary shadow-[0_0_10px_rgba(227,24,55,0.8)]" />
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* CONTENIDO DE TABS CON ANIMACIÓN */}
                        <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
                            {activeTab === 'about' && (
                                <div className="space-y-16">
                                    {/* Sinopsis */}
                                    <div className="relative">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="h-8 w-1 bg-primary rounded-full" />
                                            <h3 className="text-3xl font-black uppercase italic tracking-tighter text-white">Historia y Detalles</h3>
                                        </div>
                                        <div className="prose prose-invert max-w-none">
                                            <p className="text-xl leading-relaxed text-white/50 font-medium">
                                                {juego.summary || 'No hay descripción disponible para este juego.'}
                                            </p>
                                            {juego.storyline && (
                                                <div className="mt-10 p-8 rounded-3xl bg-white/[0.02] border border-white/5 relative overflow-hidden group">
                                                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                                        <Info size={120} />
                                                    </div>
                                                    <h4 className="text-xl font-black uppercase italic tracking-tighter text-white mb-4">La Trama</h4>
                                                    <p className="text-white/40 leading-relaxed relative z-10">{juego.storyline}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Torneos Activos */}
                                    {torneos?.length > 0 && (
                                        <div>
                                            <div className="flex items-center justify-between mb-8">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-1 bg-primary rounded-full" />
                                                    <h3 className="text-3xl font-black uppercase italic tracking-tighter text-white">Próximos Torneos</h3>
                                                </div>
                                                <Link href="/torneos" className="text-xs font-black uppercase tracking-widest text-white/30 hover:text-primary transition-colors">Ver todos</Link>
                                            </div>
                                            
                                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                                {torneos.map((torneo) => (
                                                    <Link 
                                                        key={torneo.id} 
                                                        href={`/torneos/${torneo.id}`} 
                                                        className="group relative overflow-hidden rounded-3xl bg-[#141414] p-6 border border-white/5 transition-all hover:border-primary/30 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
                                                    >
                                                        <div className="flex items-center justify-between mb-6">
                                                            <div className="px-3 py-1 rounded-lg bg-primary/10 border border-primary/20 text-[10px] font-black uppercase tracking-widest text-primary">
                                                                {torneo.estado}
                                                            </div>
                                                            <div className="flex items-center gap-2 text-white/30 text-[10px] font-bold">
                                                                <Trophy size={12} />
                                                                <span>{torneo.inscripciones_count} / {torneo.max_participantes}</span>
                                                            </div>
                                                        </div>
                                                        
                                                        <h4 className="text-xl font-black uppercase italic tracking-tighter text-white group-hover:text-primary transition-colors mb-6 leading-none">
                                                            {torneo.nombre}
                                                        </h4>
                                                        
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex flex-col">
                                                                <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Premio Total</span>
                                                                <span className="text-2xl font-black text-white">{torneo.premio_total}€</span>
                                                            </div>
                                                            <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/30 group-hover:bg-primary group-hover:text-black transition-all">
                                                                <ChevronRight size={20} />
                                                            </div>
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'live' && (
                                <div className="space-y-8">
                                    <div className="flex items-center gap-3 mb-8">
                                        <div className="h-8 w-1 bg-primary rounded-full" />
                                        <h3 className="text-3xl font-black uppercase italic tracking-tighter text-white">Transmisiones en Vivo</h3>
                                    </div>
                                    <LiveStreamGrid streams={liveStreams} />
                                </div>
                            )}

                            {activeTab === 'gallery' && (
                                <div className="space-y-8">
                                    <div className="flex items-center gap-3 mb-8">
                                        <div className="h-8 w-1 bg-primary rounded-full" />
                                        <h3 className="text-3xl font-black uppercase italic tracking-tighter text-white">Galería de Capturas</h3>
                                    </div>
                                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                        {juego.screenshot_ids?.map((id, idx) => (
                                            <div 
                                                key={idx} 
                                                className="overflow-hidden rounded-2xl bg-[#141414] aspect-video group cursor-zoom-in border border-white/5 relative shadow-xl"
                                                onClick={() => window.open(igdbImageUrl(id, 't_original'), '_blank')}
                                            >
                                                <img 
                                                    src={igdbImageUrl(id, 't_screenshot_big')} 
                                                    alt={`Screenshot ${idx}`}
                                                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <div className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white">
                                                        <ImageIcon size={20} />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'clips' && (
                                <div className="space-y-8">
                                    <div className="flex items-center gap-3 mb-8">
                                        <div className="h-8 w-1 bg-primary rounded-full" />
                                        <h3 className="text-3xl font-black uppercase italic tracking-tighter text-white">Mejores Momentos</h3>
                                    </div>
                                    <ClipCarousel clips={topClips} />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* SIDEBAR PREMIUM */}
                    <div className="w-full space-y-12 lg:w-96 shrink-0">
                        {/* Box de Enlaces con Iconos Lucide */}
                        <div className="p-8 rounded-[2.5rem] bg-[#141414] border border-white/5 shadow-2xl">
                            <GameWebLinks websites={juego.websites} />
                        </div>

                        {/* Similar Games */}
                        <div className="px-2">
                            <SimilarGames similarGames={juego.similar_game_ids} />
                        </div>

                        {/* Merch Promo / Banner Premium */}
                        <div className="relative group overflow-hidden rounded-[2.5rem] p-8 shadow-2xl transition-all hover:-translate-y-2">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary to-[#ff4b2b] opacity-10 group-hover:opacity-20 transition-opacity" />
                            <div className="absolute -right-12 -bottom-12 h-48 w-48 bg-primary/20 rounded-full blur-[60px] group-hover:bg-primary/40 transition-all" />
                            
                            <div className="relative z-10 flex flex-col gap-4">
                                <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center text-black shadow-lg shadow-primary/30">
                                    <ShoppingBag size={24} />
                                </div>
                                <h4 className="text-2xl font-black uppercase italic tracking-tighter text-white">Fan Merch</h4>
                                <p className="text-sm text-white/50 leading-relaxed">
                                    Lleva tu pasión a otro nivel. Consigue el merchandising oficial de **{juego.nombre}** en nuestra tienda exclusiva.
                                </p>
                                <Link 
                                    href="/shop" 
                                    className="mt-6 inline-flex items-center justify-center gap-3 rounded-2xl bg-white text-black px-8 py-4 font-black uppercase italic tracking-widest text-xs transition-all hover:bg-primary hover:text-white hover:shadow-[0_10px_20px_rgba(227,24,55,0.3)] active:scale-95"
                                >
                                    Visitar Tienda
                                    <ChevronRight size={18} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}} />
        </MainLayout>
    );
}
