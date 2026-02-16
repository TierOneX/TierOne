import { useState, useEffect, useCallback } from 'react';
import { Link } from '@inertiajs/react';

const banners = [
    {
        id: 1,
        title: 'DOMINA LA',
        highlight: 'COMPETICIÓN',
        subtitle: 'Únete al torneo de League of Legends más prestigioso de la temporada. Premios increíbles te esperan.',
        cta: 'INSCRÍBETE AHORA',
        ctaLink: '/tournaments',
        badge: 'TORNEO DESTACADO',
        gradient: 'linear-gradient(135deg, #0B0B0B 0%, #1a0a0a 40%, #E10600 100%)',
        accentColor: '#E10600',
    },
    {
        id: 2,
        title: 'NUEVA COLECCIÓN',
        highlight: 'STREETWEAR',
        subtitle: 'Descubre nuestra colección exclusiva de merchandising gaming. Diseños limitados para verdaderos competidores.',
        cta: 'VER TIENDA',
        ctaLink: '/shop',
        badge: 'MERCH EXCLUSIVO',
        gradient: 'linear-gradient(135deg, #0B0B0B 0%, #0a0a1a 40%, #1a1aff 100%)',
        accentColor: '#4040ff',
    },
    {
        id: 3,
        title: 'COMPITE EN',
        highlight: 'TIEMPO REAL',
        subtitle: 'Matchmaking inteligente, rankings dinámicos y partidas competitivas. Tu nivel, tus rivales.',
        cta: 'JUGAR AHORA',
        ctaLink: '/matches',
        badge: 'PARTIDAS EN VIVO',
        gradient: 'linear-gradient(135deg, #0B0B0B 0%, #0a1a0a 40%, #00c853 100%)',
        accentColor: '#00c853',
    },
];

export default function BannerCarousel() {
    const [current, setCurrent] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const goTo = useCallback((index) => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setCurrent(index);
        setTimeout(() => setIsTransitioning(false), 700);
    }, [isTransitioning]);

    const next = useCallback(() => {
        goTo((current + 1) % banners.length);
    }, [current, goTo]);

    // Auto-play
    useEffect(() => {
        const timer = setInterval(next, 6000);
        return () => clearInterval(timer);
    }, [next]);

    const banner = banners[current];

    return (
        <section id="hero-banner" className="relative overflow-hidden" style={{ minHeight: '75vh' }}>
            {/* Background con transición */}
            {banners.map((b, i) => (
                <div
                    key={b.id}
                    className="absolute inset-0 transition-opacity duration-700 ease-in-out"
                    style={{
                        background: b.gradient,
                        opacity: i === current ? 1 : 0,
                        zIndex: i === current ? 1 : 0,
                    }}
                />
            ))}

            {/* Efecto de partículas decorativo */}
            <div className="absolute inset-0 z-[2]" style={{ opacity: 0.06 }}>
                <div className="absolute w-[500px] h-[500px] rounded-full"
                    style={{
                        background: `radial-gradient(circle, ${banner.accentColor} 0%, transparent 70%)`,
                        top: '-10%',
                        right: '-5%',
                        animation: 'float 20s infinite',
                    }}
                />
                <div className="absolute w-[300px] h-[300px] rounded-full"
                    style={{
                        background: `radial-gradient(circle, ${banner.accentColor} 0%, transparent 70%)`,
                        bottom: '10%',
                        left: '-5%',
                        animation: 'float 15s infinite reverse',
                    }}
                />
            </div>

            {/* Patrón grid decorativo */}
            <div className="absolute inset-0 z-[2]" style={{
                backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
                backgroundSize: '60px 60px',
            }} />

            {/* Contenido */}
            <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-8 flex items-center" style={{ minHeight: '75vh' }}>
                <div className="w-full max-w-2xl py-20 lg:py-0">
                    {/* Badge */}
                    <div
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-[0.2em] mb-6 transition-all duration-500"
                        style={{
                            background: 'rgba(11,11,11,0.7)',
                            border: `1px solid ${banner.accentColor}40`,
                            backdropFilter: 'blur(10px)',
                            color: banner.accentColor,
                        }}
                    >
                        <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: banner.accentColor }} />
                        {banner.badge}
                    </div>

                    {/* Título */}
                    <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black italic uppercase leading-[0.95] mb-6 text-white">
                        {banner.title}<br />
                        <span className="transition-colors duration-500" style={{ color: banner.accentColor }}>
                            {banner.highlight}
                        </span>
                    </h1>

                    {/* Subtítulo */}
                    <p className="text-gray-400 text-base lg:text-lg leading-relaxed mb-8 max-w-lg">
                        {banner.subtitle}
                    </p>

                    {/* CTA */}
                    <Link
                        href={banner.ctaLink}
                        className="inline-flex items-center gap-3 px-8 py-4 text-sm font-black uppercase tracking-widest text-white rounded-md transition-all duration-300 hover:-translate-y-0.5 active:scale-95 group"
                        style={{
                            background: banner.accentColor,
                            boxShadow: `0 10px 30px ${banner.accentColor}50`,
                        }}
                    >
                        {banner.cta}
                        <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                    </Link>
                </div>
            </div>

            {/* Indicadores (dots) */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
                {banners.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => goTo(i)}
                        className="relative group"
                        aria-label={`Ir al banner ${i + 1}`}
                    >
                        <div
                            className="h-1.5 rounded-full transition-all duration-500"
                            style={{
                                width: i === current ? '40px' : '16px',
                                background: i === current ? banner.accentColor : 'rgba(255,255,255,0.25)',
                            }}
                        />
                    </button>
                ))}
            </div>

            {/* Flechas navegación (solo desktop) */}
            <button
                onClick={() => goTo((current - 1 + banners.length) % banners.length)}
                className="hidden lg:flex absolute left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-all duration-200"
                aria-label="Banner anterior"
            >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            <button
                onClick={() => goTo((current + 1) % banners.length)}
                className="hidden lg:flex absolute right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-all duration-200"
                aria-label="Banner siguiente"
            >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
            </button>
        </section>
    );
}
