import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import TrendingBar from '@/Components/Community/TrendingBar';
import GameCard from '@/Components/Community/GameCard';
import { Search, LayoutGrid, Gamepad2, Sparkles } from 'lucide-react';
import { igdbImageUrl } from '@/Utils/igdb';

export default function Index({ juegos, topGames }) {
    const [search, setSearch] = useState('');

    const filteredJuegos = juegos.filter(j => 
        j.nombre.toLowerCase().includes(search.toLowerCase())
    );

    const featuredGame = juegos.length > 0 ? juegos[0] : null;

    return (
        <MainLayout>
            <Head title="Comunidad Gaming - TierOne" />

            <div className="min-h-screen bg-[#0a0a0a] pb-20">
                {/* Hero Section Cinematic */}
                <section className="relative min-h-[500px] w-full overflow-hidden flex items-center justify-center">
                    {/* Background con Parallax effect simulado */}
                    {featuredGame && (
                        <div className="absolute inset-0 z-0">
                            <img 
                                src={igdbImageUrl(featuredGame.artwork_ids?.[0] || featuredGame.screenshot_ids?.[0] || featuredGame.cover_image_id, 't_1080p')} 
                                className="h-full w-full object-cover brightness-[0.2] scale-110"
                                alt="Featured"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent" />
                        </div>
                    )}
                    
                    {/* Partículas decorativas (simuladas con blobs de color) */}
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse pointer-events-none" />
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#ff4b2b]/10 rounded-full blur-[120px] animate-pulse pointer-events-none" style={{ animationDelay: '2s' }} />

                    <div className="container relative z-10 mx-auto px-4 text-center">
                        <div className="flex justify-center mb-6 animate-in fade-in zoom-in duration-700">
                            <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl">
                                <Sparkles size={16} className="text-primary" />
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/70">Comunidad Oficial TierOne</span>
                            </div>
                        </div>

                        <h1 className="text-5xl font-black uppercase italic leading-[0.85] tracking-tighter text-white sm:text-9xl animate-in slide-in-from-bottom-8 duration-700">
                            Universo <br /> <span className="text-primary">Gaming</span>
                        </h1>
                        
                        <p className="mt-8 max-w-2xl mx-auto text-base sm:text-xl text-white/40 font-medium leading-relaxed animate-in fade-in duration-1000 delay-300">
                            Explora la base de datos más completa, conecta con streamers en vivo 
                            y domina los torneos más competitivos del mercado.
                        </p>

                        {/* Buscador Estilo Minimal/Premium */}
                        <div className="mt-12 w-full max-w-2xl mx-auto animate-in slide-in-from-bottom-4 duration-700 delay-500">
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-[#ff4b2b] rounded-2xl blur opacity-25 group-focus-within:opacity-50 transition duration-500" />
                                <div className="relative flex items-center">
                                    <div className="absolute left-6 text-white/20 group-focus-within:text-primary transition-colors">
                                        <Search size={20} />
                                    </div>
                                    <input 
                                        type="text" 
                                        placeholder="Busca tu próximo desafío..."
                                        className="h-16 w-full rounded-2xl border-none bg-black px-14 text-white placeholder:text-white/20 transition-all focus:ring-0 shadow-2xl"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                    {search && (
                                        <button 
                                            onClick={() => setSearch('')}
                                            className="absolute right-6 text-white/40 hover:text-white"
                                        >
                                            Limpiar
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="container mx-auto px-4">
                    {/* Trending Section */}
                    <TrendingBar topGames={topGames} />

                    {/* All Games Section */}
                    <div className="mt-24">
                        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest">
                                    <LayoutGrid size={16} />
                                    <span>Biblioteca Digital</span>
                                </div>
                                <h2 className="text-4xl font-black uppercase italic tracking-tighter text-white sm:text-6xl">
                                    Explorar <span className="text-primary">Catálogo</span>
                                </h2>
                            </div>
                            
                            <div className="flex items-center gap-4 text-white/30 text-xs font-bold uppercase tracking-widest bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                                <Gamepad2 size={16} />
                                <span>{filteredJuegos.length} Juegos encontrados</span>
                            </div>
                        </div>

                        {filteredJuegos.length > 0 ? (
                            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 animate-in fade-in slide-in-from-bottom-12 duration-1000">
                                {filteredJuegos.map(juego => (
                                    <GameCard key={juego.id} juego={juego} />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-32 text-center rounded-[3rem] bg-white/[0.02] border border-dashed border-white/10">
                                <div className="h-24 w-24 rounded-full bg-white/5 flex items-center justify-center mb-8">
                                    <Search size={40} className="text-white/10" />
                                </div>
                                <h3 className="text-2xl font-black uppercase tracking-tighter text-white/60">No hay coincidencias</h3>
                                <p className="text-white/30 mt-3 max-w-sm">No pudimos encontrar ningún juego con ese nombre. Prueba con algo más genérico o revisa la ortografía.</p>
                                <button 
                                    onClick={() => setSearch('')}
                                    className="mt-8 px-8 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold transition-all"
                                >
                                    Mostrar todos los juegos
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
