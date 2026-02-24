import { useState } from 'react';

/**
 * Galería de imágenes del producto.
 * Desktop: thumbnails a la izquierda + imagen grande.
 * Mobile: carrusel con dots.
 */
export default function ProductGallery({ imagenes, imagenPrincipal, nombre }) {
    // Construir array de todas las imágenes
    const allImages = [];
    if (imagenPrincipal) allImages.push(imagenPrincipal);
    if (imagenes && imagenes.length > 0) {
        imagenes.forEach((img) => {
            if (img.url !== imagenPrincipal) allImages.push(img.url);
        });
    }
    // Garantizar al menos 1 imagen (placeholder)
    if (allImages.length === 0) allImages.push(null);

    const [activeIndex, setActiveIndex] = useState(0);
    const [imgError, setImgError] = useState({});

    const handleError = (index) => {
        setImgError((prev) => ({ ...prev, [index]: true }));
    };

    const Placeholder = () => (
        <div className="w-full h-full flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #1C1C20 0%, #252528 100%)' }}>
            <svg className="w-20 h-20 text-white/10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a1.5 1.5 0 001.5-1.5V5.25a1.5 1.5 0 00-1.5-1.5H3.75a1.5 1.5 0 00-1.5 1.5v14.25a1.5 1.5 0 001.5 1.5z" />
            </svg>
        </div>
    );

    return (
        <div>
            {/* === DESKTOP: thumbnails + imagen grande === */}
            <div className="hidden md:flex gap-4">
                {/* Thumbnails */}
                {allImages.length > 1 && (
                    <div className="flex flex-col gap-3 w-20 shrink-0">
                        {allImages.map((src, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveIndex(i)}
                                className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${activeIndex === i
                                        ? 'border-red-600 opacity-100'
                                        : 'border-transparent opacity-50 hover:opacity-80'
                                    }`}
                            >
                                {src && !imgError[i] ? (
                                    <img src={src} alt={`${nombre} ${i + 1}`} className="w-full h-full object-cover" onError={() => handleError(i)} />
                                ) : (
                                    <Placeholder />
                                )}
                            </button>
                        ))}
                    </div>
                )}

                {/* Imagen principal grande */}
                <div className="flex-1 aspect-square rounded-xl overflow-hidden" style={{ background: '#1C1C20' }}>
                    {allImages[activeIndex] && !imgError[activeIndex] ? (
                        <img
                            src={allImages[activeIndex]}
                            alt={nombre}
                            className="w-full h-full object-cover"
                            onError={() => handleError(activeIndex)}
                        />
                    ) : (
                        <Placeholder />
                    )}
                </div>
            </div>

            {/* === MOBILE: carrusel con dots === */}
            <div className="md:hidden">
                <div className="relative aspect-square rounded-xl overflow-hidden" style={{ background: '#1C1C20' }}>
                    {allImages[activeIndex] && !imgError[activeIndex] ? (
                        <img
                            src={allImages[activeIndex]}
                            alt={nombre}
                            className="w-full h-full object-cover"
                            onError={() => handleError(activeIndex)}
                        />
                    ) : (
                        <Placeholder />
                    )}

                    {/* Flechas sobre la imagen */}
                    {allImages.length > 1 && (
                        <>
                            <button
                                onClick={() => setActiveIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1))}
                                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                            </button>
                            <button
                                onClick={() => setActiveIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1))}
                                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                            </button>
                        </>
                    )}
                </div>

                {/* Dots */}
                {allImages.length > 1 && (
                    <div className="flex justify-center gap-2 mt-4">
                        {allImages.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveIndex(i)}
                                className={`rounded-full transition-all ${activeIndex === i
                                        ? 'w-6 h-2 bg-red-600'
                                        : 'w-2 h-2 bg-gray-600 hover:bg-gray-400'
                                    }`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
