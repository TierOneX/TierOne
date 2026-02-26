import { useRef, useState, useEffect, useCallback } from "react";
import { Link } from "@inertiajs/react";

/**
 * Carrusel de juegos:
 * - DESKTOP (lg+): scroll horizontal con múltiples cards visibles
 * - MÓVIL (<lg): 1 card a la vez, flechas fuera, auto-avance cada 4s
 */
export default function GamesCarousel({ games }) {
    // ===== Estado para DESKTOP (scroll) =====
    const scrollRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const checkScroll = () => {
        if (!scrollRef.current) return;
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        setCanScrollLeft(scrollLeft > 10);
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    };

    useEffect(() => {
        checkScroll();
        const el = scrollRef.current;
        if (el) el.addEventListener("scroll", checkScroll);
        return () => el?.removeEventListener("scroll", checkScroll);
    }, []);

    const scrollDesktop = (dir) => {
        if (!scrollRef.current) return;
        // 1 card por click: 230px card + 20px gap = 250px
        scrollRef.current.scrollBy({
            left: dir === "left" ? -250 : 250,
            behavior: "smooth",
        });
    };

    // ===== Estado para MÓVIL (card a card) =====
    const [current, setCurrent] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [imgErrors, setImgErrors] = useState({});
    const total = games?.length || 0;

    const goTo = useCallback(
        (i) => setCurrent(((i % total) + total) % total),
        [total],
    );
    const prev = () => goTo(current - 1);
    const next = useCallback(() => goTo(current + 1), [current, goTo]);

    useEffect(() => {
        if (total <= 1 || isHovered) return;
        const timer = setInterval(next, 4000);
        return () => clearInterval(timer);
    }, [next, total, isHovered]);

    const handleImgError = (id) => setImgErrors((p) => ({ ...p, [id]: true }));

    if (!games || games.length === 0) return null;

    const juego = games[current];

    return (
        <section
            id="games-section"
            className="py-14 lg:py-20"
            style={{ background: "#0a0a0c" }}
        >
            <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
                {/* Header */}
                <div className="flex items-end justify-between mb-8">
                    <div>
                        <p className="text-[#e31837] text-xs font-bold uppercase tracking-[0.25em] mb-2 flex items-center gap-2">
                            <span className="w-5 h-[2px] bg-[#e31837] rounded-full" />
                            NUESTROS JUEGOS
                        </p>
                        <h2 className="text-2xl lg:text-4xl font-black italic uppercase text-white">
                            ELIGE TU{" "}
                            <span className="text-[#e31837]">ARENA</span>
                        </h2>
                    </div>
                    {/* Flechas scroll DESKTOP */}
                    <div className="hidden lg:flex items-center gap-2">
                        <button
                            onClick={() => scrollDesktop("left")}
                            disabled={!canScrollLeft}
                            className={`w-10 h-10 rounded-lg border flex items-center justify-center transition-all ${canScrollLeft ? "border-white/20 text-white hover:bg-white/10" : "border-white/5 text-white/20 cursor-not-allowed"}`}
                        >
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2.5}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15 19l-7-7 7-7"
                                />
                            </svg>
                        </button>
                        <button
                            onClick={() => scrollDesktop("right")}
                            disabled={!canScrollRight}
                            className={`w-10 h-10 rounded-lg border flex items-center justify-center transition-all ${canScrollRight ? "border-white/20 text-white hover:bg-white/10" : "border-white/5 text-white/20 cursor-not-allowed"}`}
                        >
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2.5}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M9 5l7 7-7 7"
                                />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* ==================== DESKTOP: scroll horizontal ==================== */}
                <div className="hidden lg:block relative">
                    {canScrollLeft && (
                        <div
                            className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
                            style={{
                                background:
                                    "linear-gradient(90deg, #0a0a0c, transparent)",
                            }}
                        />
                    )}
                    <div
                        ref={scrollRef}
                        className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide"
                        style={{ scrollSnapType: "x mandatory" }}
                    >
                        {games.map((g) => (
                            <DesktopCard
                                key={g.id}
                                juego={g}
                                imgErrors={imgErrors}
                                onImgError={handleImgError}
                            />
                        ))}
                    </div>
                    {canScrollRight && (
                        <div
                            className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
                            style={{
                                background:
                                    "linear-gradient(270deg, #0a0a0c, transparent)",
                            }}
                        />
                    )}
                </div>

                {/* ==================== MÓVIL: card a card ==================== */}
                <div className="lg:hidden">
                    <div
                        className="flex items-center gap-3"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        {/* Flecha izq */}
                        <button
                            onClick={prev}
                            className="flex-shrink-0 w-9 h-9 rounded-full border border-white/15 text-white/60 hover:text-white hover:border-white/30 hover:bg-white/5 flex items-center justify-center transition-all"
                            aria-label="Anterior"
                        >
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15 19l-7-7 7-7"
                                />
                            </svg>
                        </button>

                        {/* Card */}
                        <div
                            className="flex-1 rounded-xl overflow-hidden border border-white/5"
                            style={{ background: "#141418" }}
                        >
                            <div
                                className="relative h-[160px] overflow-hidden"
                                style={{ background: "#ffffff" }}
                            >
                                {juego.imagen_url && !imgErrors[juego.id] ? (
                                    <img
                                        src={juego.imagen_url}
                                        alt={juego.nombre}
                                        className="absolute inset-0 w-full h-full object-contain object-center"
                                        onError={() => handleImgError(juego.id)}
                                    />
                                ) : (
                                    <div
                                        className="absolute inset-0 flex items-center justify-center"
                                        style={{
                                            background:
                                                "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
                                        }}
                                    >
                                        <span className="text-5xl font-black text-white/5 uppercase select-none">
                                            {juego.nombre?.charAt(0)}
                                        </span>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#141418]" />
                                <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-black/60 text-white backdrop-blur-sm border border-white/10">
                                    {juego.categoria}
                                </span>
                            </div>
                            <div className="p-4">
                                <h3 className="text-white font-black text-lg uppercase tracking-wide mb-1">
                                    {juego.nombre}
                                </h3>
                                {juego.descripcion && (
                                    <p className="text-gray-400 text-xs leading-relaxed line-clamp-2 mb-3">
                                        {juego.descripcion}
                                    </p>
                                )}
                                <Link
                                    href={`/games/${juego.slug}`}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#e31837] hover:bg-[#c2102d] text-white text-[10px] font-black uppercase tracking-widest rounded-lg transition-all"
                                >
                                    VER JUEGO
                                    <svg
                                        className="w-3 h-3"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2.5}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                                        />
                                    </svg>
                                </Link>
                            </div>
                        </div>

                        {/* Flecha der */}
                        <button
                            onClick={next}
                            className="flex-shrink-0 w-9 h-9 rounded-full border border-white/15 text-white/60 hover:text-white hover:border-white/30 hover:bg-white/5 flex items-center justify-center transition-all"
                            aria-label="Siguiente"
                        >
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M9 5l7 7-7 7"
                                />
                            </svg>
                        </button>
                    </div>

                    {/* Dots */}
                    <div className="flex justify-center gap-1.5 mt-4">
                        {games.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => goTo(i)}
                                className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? "w-6 bg-[#e31837]" : "w-1.5 bg-white/15 hover:bg-white/30"}`}
                                aria-label={`Juego ${i + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

/* Card para DESKTOP — scroll horizontal */
function DesktopCard({ juego, imgErrors, onImgError }) {
    return (
        <Link
            href={`/games/${juego.slug}`}
            className="group flex-shrink-0 w-[200px] lg:w-[230px] rounded-xl overflow-hidden border border-white/5 hover:border-[#e31837]/40 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-red-900/10"
            style={{ scrollSnapAlign: "start", background: "#141418" }}
        >
            <div
                className="relative h-[200px] lg:h-[220px] overflow-hidden"
                style={{ background: "#ffffff" }}
            >
                {juego.imagen_url && !imgErrors[juego.id] ? (
                    <img
                        src={juego.imagen_url}
                        alt={juego.nombre}
                        className="absolute inset-0 w-full h-full object-contain object-center transition-transform duration-500 group-hover:scale-105"
                        onError={() => onImgError(juego.id)}
                    />
                ) : (
                    <div
                        className="absolute inset-0 flex items-center justify-center"
                        style={{
                            background:
                                "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
                        }}
                    >
                        <span className="text-4xl font-black text-white/10 uppercase">
                            {juego.nombre?.charAt(0)}
                        </span>
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#141418] via-transparent to-transparent" />
                <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-black/60 text-white backdrop-blur-sm border border-white/10">
                    {juego.categoria}
                </span>
            </div>
            <div className="p-4">
                <h3 className="text-white font-bold text-sm uppercase tracking-wide truncate group-hover:text-[#e31837] transition-colors">
                    {juego.nombre}
                </h3>
                {juego.descripcion && (
                    <p className="text-gray-500 text-xs mt-1.5 line-clamp-2 leading-relaxed">
                        {juego.descripcion}
                    </p>
                )}
            </div>
        </Link>
    );
}
