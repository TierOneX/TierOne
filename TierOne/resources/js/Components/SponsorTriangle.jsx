import { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';

/**
 * Componente SponsorTriangle
 * 
 * @param {string} videoSrc - URL del video a mostrar
 * @param {string} title - Título del sponsor
 * @param {string} subtitle - Subtítulo o marca
 * @param {string} side - 'right' o 'left' (por defecto 'right')
 * @param {string} url - URL a la que redirigir al hacer clic
 */
export default function SponsorTriangle({ 
    videoSrc = "https://assets.mixkit.co/videos/preview/mixkit-gaming-setup-with-neon-lights-and-keyboard-34442-large.mp4",
    title = "Hydra Energy",
    subtitle = "TierOne Partner",
    side = "right",
    url = "/debug-500"
}) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 1000);
        return () => clearTimeout(timer);
    }, []);

    if (!isVisible) return null;

    const sideClasses = side === "right" ? "right-0 pr-2 items-end" : "left-0 pl-2 items-start";
    const labelClasses = side === "right" ? "-left-12 -rotate-90" : "-right-12 rotate-90";
    const clipPath = side === "right" ? 'polygon(100% 0, 100% 100%, 0 100%)' : 'polygon(0 0, 100% 100%, 0 100%)';
    const borderClasses = side === "right" ? "border-r-[4px] border-b-[4px]" : "border-l-[4px] border-b-[4px]";

    return (
        <div className={`fixed top-1/2 z-20 hidden -translate-y-1/2 flex-col gap-2 lg:flex ${sideClasses}`}>
            <div className="relative">
                {/* Etiqueta de Sponsor */}
                <div className={`absolute top-1/2 text-[10px] font-black uppercase tracking-[0.4em] text-white/40 ${labelClasses}`}>
                    Sponsored
                </div>

                {/* Contenedor del Triángulo */}
                <Link 
                    href={url}
                    className="group relative block h-[300px] w-[300px] overflow-hidden transition-all duration-500 hover:scale-[1.02]"
                    style={{
                        clipPath: clipPath,
                        filter: 'drop-shadow(0 20px 50px rgba(0,0,0,0.5))'
                    }}
                >
                    {/* Video de fondo */}
                    <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="h-full w-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-110"
                    >
                        <source src={videoSrc} type="video/mp4" />
                    </video>

                    {/* Overlay Gradiente */}
                    <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 via-transparent to-black/60" />

                    {/* Contenido sobre el video */}
                    <div className={`absolute bottom-6 ${side === "right" ? "right-6 text-right" : "left-6 text-left"}`}>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500">{subtitle}</p>
                        <h4 className="mt-1 text-xl font-black uppercase italic text-white leading-none">
                            {title.split(' ').map((word, i) => (
                                <span key={i}>{word}{i === 0 && <br/>}</span>
                            ))}
                        </h4>
                    </div>

                    {/* Borde decorativo */}
                    <div 
                        className={`absolute inset-0 border-red-600/40 ${borderClasses}`}
                        style={{ clipPath: clipPath }}
                    />
                </Link>
                
                {/* Botón Cerrar */}
                <button 
                    onClick={() => setIsVisible(false)}
                    className={`absolute -top-2 rounded-full bg-black/60 p-1 text-white/50 backdrop-blur-sm transition hover:text-white ${side === "right" ? "right-0" : "left-0"}`}
                >
                    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
