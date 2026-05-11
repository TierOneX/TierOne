import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import TrendingBar from '@/Components/Community/TrendingBar';
import GameCard from '@/Components/Community/GameCard';
import { igdbImageUrl } from '@/Utils/igdb';

export default function Index({ juegos, topGames }) {
    const [search, setSearch] = useState('');
    
    // Filtrar juegos locales por búsqueda
    const filteredJuegos = juegos.filter(j => 
        j.nombre.toLowerCase().includes(search.toLowerCase())
    );

    // Seleccionar un juego destacado para el Hero (si hay)
    const featuredGame = juegos.length > 0 ? juegos[0] : null;

    return (
        <MainLayout>
            <Head title="Comunidad Gaming - TierOne" />

            {/* HERO SECTION */}
            <section className="relative h-[400px] w-full overflow-hidden sm:h-[500px]">
                {/* Background Image con Blur */}
                {featuredGame && (
                    <div className="absolute inset-0 z-0">
                        <img 
                            src={igdbImageUrl(featuredGame.artwork_ids?.[0] || featuredGame.screenshot_ids?.[0] || featuredGame.cover_image_id, 't_1080p')} 
                            className="h-full w-full object-cover blur-sm brightness-[0.4]"
                            alt="Featured"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
                    </div>
                )}

                <div className="container relative z-10 mx-auto flex h-full flex-col items-center justify-center px-4 text-center">
                    <h1 className="text-4xl font-black uppercase italic tracking-tighter text-white sm:text-7xl">
                        Comunidad <span className="text-primary">TierOne</span>
                    </h1>
                    <p className="mt-4 max-w-2xl text-lg text-white/60">
                        Explora tus juegos favoritos, mira streams en vivo y mantente al día con lo último en el mundo del gaming.
                    </p>

                    {/* Buscador Estilo Glassmorphism */}
                    <div className="mt-8 w-full max-w-xl">
                        <div className="relative">
                            <input 
                                type="text" 
                                placeholder="Buscar un juego..."
                                className="h-14 w-full rounded-2xl border-none bg-white/10 px-6 text-white backdrop-blur-xl transition-all focus:bg-white/15 focus:ring-2 focus:ring-primary/50"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-4 py-12">
                {/* TRENDING BAR (TWITCH DATA) */}
                <TrendingBar topGames={topGames} />

                {/* GRID DE JUEGOS EN TIERONE */}
                <div className="mt-16">
                    <div className="mb-8 flex items-end justify-between">
                        <div>
                            <h2 className="text-3xl font-black uppercase tracking-tighter text-white">Explorar Juegos</h2>
                            <p className="text-white/40">Toda la base de datos de TierOne enriquecida por IGDB</p>
                        </div>
                        <div className="hidden sm:block">
                            {/* Opcional: Filtros de categoría */}
                        </div>
                    </div>

                    {filteredJuegos.length > 0 ? (
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                            {filteredJuegos.map(juego => (
                                <GameCard key={juego.id} juego={juego} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex h-64 flex-col items-center justify-center rounded-3xl border border-white/5 bg-white/5 text-center backdrop-blur-sm">
                            <p className="text-xl font-bold text-white/40">No se encontraron juegos con ese nombre</p>
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}
