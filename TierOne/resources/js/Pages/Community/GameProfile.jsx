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

export default function GameProfile({ juego, liveStreams, topClips, torneos }) {
    const [activeTab, setActiveTab] = useState('about');

    const tabs = [
        { id: 'about', name: 'Sobre el Juego', icon: '📝' },
        { id: 'live', name: `En Vivo (${liveStreams?.length || 0})`, icon: '🔴' },
        { id: 'clips', name: 'Clips', icon: '🎬' },
        { id: 'gallery', name: 'Galería', icon: '🖼️' },
    ];

    return (
        <MainLayout>
            <Head title={`${juego.nombre} - Comunidad TierOne`} />

            <GameHero juego={juego} />

            <div className="container mx-auto px-4 py-12">
                <div className="flex flex-col gap-8 lg:flex-row">
                    {/* COLUMNA PRINCIPAL */}
                    <div className="flex-1 overflow-hidden">
                        {/* TABS SELECTOR */}
                        <div className="mb-8 flex gap-4 overflow-x-auto border-b border-white/5 pb-px hide-scrollbar">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex shrink-0 items-center gap-2 border-b-2 px-4 py-4 text-sm font-bold transition-all ${
                                        activeTab === tab.id 
                                        ? 'border-primary text-primary' 
                                        : 'border-transparent text-white/40 hover:text-white'
                                    }`}
                                >
                                    <span>{tab.icon}</span>
                                    <span>{tab.name}</span>
                                </button>
                            ))}
                        </div>

                        {/* CONTENIDO DE TABS */}
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {activeTab === 'about' && (
                                <div className="space-y-12">
                                    {/* Sinopsis */}
                                    <div className="prose prose-invert max-w-none">
                                        <h3 className="text-2xl font-black uppercase tracking-tighter text-white">Historia y Sinopsis</h3>
                                        <p className="text-lg leading-relaxed text-white/60">
                                            {juego.summary || 'No hay descripción disponible para este juego.'}
                                        </p>
                                        {juego.storyline && (
                                            <>
                                                <h4 className="mt-8 text-xl font-bold text-white">Trama</h4>
                                                <p className="text-white/60">{juego.storyline}</p>
                                            </>
                                        )}
                                    </div>

                                    {/* Torneos */}
                                    {torneos?.length > 0 && (
                                        <div>
                                            <h3 className="mb-6 text-2xl font-black uppercase tracking-tighter text-white">Torneos Activos</h3>
                                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                                {torneos.map((torneo) => (
                                                    <Link 
                                                        key={torneo.id} 
                                                        href={`/torneos/${torneo.id}`} 
                                                        className="group flex flex-col rounded-2xl bg-white/5 p-4 transition-all hover:bg-white/10"
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-xs font-bold uppercase tracking-widest text-primary">{torneo.estado}</span>
                                                            <span className="text-xs text-white/40">{torneo.inscripciones_count} / {torneo.max_participantes} jugadores</span>
                                                        </div>
                                                        <h4 className="mt-2 text-lg font-bold text-white group-hover:text-primary transition-colors">{torneo.nombre}</h4>
                                                        <div className="mt-4 flex items-center justify-between">
                                                            <span className="text-xl font-black text-white">{torneo.premio_total}€ <span className="text-xs font-normal text-white/40">Pool</span></span>
                                                            <span className="rounded-lg bg-primary/20 px-4 py-2 text-xs font-bold text-primary">Inscribirse</span>
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'live' && (
                                <div>
                                    <h3 className="mb-6 text-2xl font-black uppercase tracking-tighter text-white">Streams en Vivo</h3>
                                    <LiveStreamGrid streams={liveStreams} />
                                </div>
                            )}

                            {activeTab === 'gallery' && (
                                <div>
                                    <h3 className="mb-6 text-2xl font-black uppercase tracking-tighter text-white">Galería de Imágenes</h3>
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                        {juego.screenshot_ids?.map((id, idx) => (
                                            <div key={idx} className="overflow-hidden rounded-xl bg-white/5 aspect-video group">
                                                <img 
                                                    src={igdbImageUrl(id, 't_screenshot_big')} 
                                                    alt={`Screenshot ${idx}`}
                                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 cursor-pointer"
                                                    onClick={() => window.open(igdbImageUrl(id, 't_original'), '_blank')}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'clips' && (
                                <div>
                                    <h3 className="mb-6 text-2xl font-black uppercase tracking-tighter text-white">Mejores Momentos</h3>
                                    <ClipCarousel clips={topClips} />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* SIDEBAR */}
                    <div className="w-full space-y-12 lg:w-80">
                        {/* Links */}
                        <GameWebLinks websites={juego.websites} />

                        {/* Similar Games */}
                        <SimilarGames similarGames={juego.similar_game_ids} />

                        {/* Merch Promo */}
                        <div className="rounded-2xl bg-gradient-to-br from-primary/20 to-transparent p-6 ring-1 ring-primary/30">
                            <h4 className="text-lg font-black uppercase italic tracking-tighter text-white">Merch Exclusivo</h4>
                            <p className="mt-2 text-sm text-white/60">¿Eres fan de {juego.nombre}? ¡Consigue el merchandising oficial de TierOne!</p>
                            <Link 
                                href="/tienda" 
                                className="mt-6 block w-full rounded-xl bg-primary py-3 text-center text-sm font-bold text-black transition-transform hover:scale-105 active:scale-95"
                            >
                                Ver Tienda
                            </Link>
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
