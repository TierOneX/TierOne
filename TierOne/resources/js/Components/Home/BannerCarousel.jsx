import { useState, useEffect, useCallback } from 'react';
import { Link } from '@inertiajs/react';

const banners = [
    {
        id: 1,
        image: '/images/banners/banner1.jpg',
        title: 'DOMINA LA',
        highlight: 'COMPETICI├ôN',
        subtitle: '├Ünete al torneo de League of Legends m├ís prestigioso de la temporada.',
        cta: 'INSCR├ìBETE AHORA',
        ctaLink: '/tournaments',
        badge: 'TORNEO DESTACADO',
    },
    {
        id: 2,
        image: '/images/banners/banner2.jpg',
        title: 'NUEVA COLECCI├ôN',
        highlight: 'STREETWEAR',
        subtitle: 'Descubre nuestra colecci├│n exclusiva de merchandising gaming.',
        cta: 'VER TIENDA',
        ctaLink: '/shop',
        badge: 'MERCH EXCLUSIVO',
    },
    {
        id: 3,
        image: '/images/banners/banner3.jpg',
        title: 'COMPITE EN',
        highlight: 'TIEMPO REAL',
        subtitle: 'Matchmaking inteligente, rankings din├ímicos y partidas competitivas.',
        cta: 'JUGAR AHORA',
        ctaLink: '/matches',
        badge: 'PARTIDAS EN VIVO',
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

    useEffect(() => {
        const timer = setInterval(next, 6000);
        return () => clearInterval(timer);
    }, [next]);

    const banner = banners[current];

    return (
        <section id="hero-banner" className="relative overflow-hidden" style={{ height: '80vh', minHeight: '500px' }}>
            {/* Im├ígenes de fondo con transici├│n */}
            {banners.map((b, i) => (
                <div
                    key={b.id}
                    className="absolute inset-0 transition-opacity duration-700 ease-in-out"
                    style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}
                >
                    <img
                        src={b.image}
                        alt={b.title}
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    {/* Overlay oscuro para legibilidad */}
                    <div className="absolute inset-0" style={{
                        background: 'linear-gradient(90deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.2) 100%)',
                    }} />
                </div>
            ))}

            {/* L├¡nea roja decorativa inferior */}
            <div className="absolute bottom-0 left-0 right-0 h-1 z-20 bg-[#e31837]" />

            {/* Contenido */}
            <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-8 flex items-center h-full">
                <div className="w-full max-w-2xl">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-[0.2em] mb-6 text-[#e31837]"
                        style={{ background: 'rgba(227,24,55,0.1)', border: '1px solid rgba(227,24,55,0.3)', backdropFilter: 'blur(10px)' }}
                    >
                        <span className="w-2 h-2 rounded-full bg-[#e31837] animate-pulse" />
                        {banner.badge}
                    </div>

                    {/* T├¡tulo */}
                    <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black italic uppercase leading-[0.9] mb-6 text-white drop-shadow-lg">
                        {banner.title}<br />
                        <span className="text-[#e31837]">{banner.highlight}</span>
                    </h1>

                    {/* Subt├¡tulo */}
                    <p className="text-gray-300 text-lg lg:text-xl leading-relaxed mb-10 max-w-lg">
                        {banner.subtitle}
                    </p>

                    {/* CTA */}
                    <Link
                        href={banner.ctaLink}
                        className="inline-flex items-center gap-3 px-8 py-4 bg-[#e31837] hover:bg-[#c2102d] text-sm font-black uppercase tracking-widest text-white rounded transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-red-900/40 active:scale-95 group"
                    >
                        {banner.cta}
                        <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                    </Link>
                </div>
            </div>

            {/* Indicadores */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
                {banners.map((_, i) => (
                    <button key={i} onClick={() => goTo(i)} aria-label={`Banner ${i + 1}`}>
                        <div className="h-1 rounded-full transition-all duration-500"
                            style={{
                                width: i === current ? '40px' : '16px',
                                background: i === current ? '#e31837' : 'rgba(255,255,255,0.3)',
                            }}
                        />
                    </button>
                ))}
            </div>

            {/* Flechas desktop */}
            <button onClick={() => goTo((current - 1 + banners.length) % banners.length)}
                className="hidden lg:flex absolute left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 items-center justify-center rounded-full bg-black/30 border border-white/10 text-white/60 hover:text-white hover:bg-black/50 backdrop-blur-sm transition-all"
                aria-label="Anterior">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button onClick={() => goTo((current + 1) % banners.length)}
                className="hidden lg:flex absolute right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 items-center justify-center rounded-full bg-black/30 border border-white/10 text-white/60 hover:text-white hover:bg-black/50 backdrop-blur-sm transition-all"
                aria-label="Siguiente">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </button>
        </section>
    );
}
