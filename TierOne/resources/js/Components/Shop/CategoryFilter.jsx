import { useRef, useState, useEffect } from 'react';

export default function CategoryFilter({ categories, activeCategory, onCategoryChange }) {
    const scrollRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    // Comprobar si hay scroll disponible en cada dirección
    const checkScroll = () => {
        const el = scrollRef.current;
        if (!el) return;
        setCanScrollLeft(el.scrollLeft > 5);
        setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 5);
    };

    useEffect(() => {
        checkScroll();
        const el = scrollRef.current;
        if (el) {
            el.addEventListener('scroll', checkScroll, { passive: true });
            window.addEventListener('resize', checkScroll);
        }
        return () => {
            if (el) el.removeEventListener('scroll', checkScroll);
            window.removeEventListener('resize', checkScroll);
        };
    }, [categories]);

    const scroll = (direction) => {
        const el = scrollRef.current;
        if (!el) return;
        const amount = 200;
        el.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
    };

    return (
        <div className="relative group/filter">
            {/* Flecha izquierda */}
            {canScrollLeft && (
                <button
                    onClick={() => scroll('left')}
                    className="absolute left-0 top-0 bottom-4 z-10 w-10 flex items-center justify-center bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent transition-opacity"
                    aria-label="Desplazar categorías a la izquierda"
                >
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
            )}

            {/* Lista de categorías */}
            <div
                ref={scrollRef}
                className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide scroll-smooth px-1"
            >
                {categories.map((category) => (
                    <button
                        key={category}
                        id={`category-pill-${category.toLowerCase().replace(/\s+/g, '-')}`}
                        onClick={() => onCategoryChange(category)}
                        className={`px-6 py-2.5 rounded-full font-bold text-sm whitespace-nowrap transition-all duration-200 border ${activeCategory === category
                                ? 'bg-white text-black border-white shadow-lg shadow-white/10'
                                : 'bg-transparent text-gray-400 border-gray-700 hover:border-gray-500 hover:text-white'
                            }`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* Flecha derecha */}
            {canScrollRight && (
                <button
                    onClick={() => scroll('right')}
                    className="absolute right-0 top-0 bottom-4 z-10 w-10 flex items-center justify-center bg-gradient-to-l from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent transition-opacity"
                    aria-label="Desplazar categorías a la derecha"
                >
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            )}
        </div>
    );
}
