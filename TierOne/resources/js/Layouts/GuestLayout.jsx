import HydraLogo from "@/Components/Auth/HydraLogo";
import KittLine from "@/Components/Auth/KittLine";
import ParticleCanvas from "@/Components/Auth/ParticleCanvas";
import { Link } from "@inertiajs/react";
import { useEffect, useState } from "react";

const styles = `
    @keyframes pageEnter {
        from { opacity: 0; transform: translateY(18px) scale(0.98); }
        to   { opacity: 1; transform: translateY(0)    scale(1);    }
    }
    @keyframes pixelSweepLine {
        0%   { top: -2%;    opacity: 0; }
        5%   { opacity: 1; }
        95%  { opacity: 1; }
        100% { top: 102%;   opacity: 0; }
    }
    @keyframes pixelGridClear {
        0%   { clip-path: inset(0 0 0 0); }
        100% { clip-path: inset(100% 0 0 0); }
    }
    @keyframes orb1 {
        0%, 100% { transform: translate(0, 0)      scale(1);    opacity: 0.55; }
        33%       { transform: translate(60px, -40px) scale(1.15); opacity: 0.7;  }
        66%       { transform: translate(-30px, 50px) scale(0.9);  opacity: 0.45; }
    }
    @keyframes orb2 {
        0%, 100% { transform: translate(0, 0)       scale(1);    opacity: 0.35; }
        40%       { transform: translate(-50px, 30px) scale(1.2);  opacity: 0.5;  }
        75%       { transform: translate(40px, -60px) scale(0.85); opacity: 0.3;  }
    }
    @keyframes orb3 {
        0%, 100% { transform: translate(0, 0)       scale(1);   opacity: 0.25; }
        50%       { transform: translate(30px, -20px) scale(1.1); opacity: 0.4;  }
    }
    @keyframes logoFloat {
        0%, 100% { transform: translateY(0px); }
        50%       { transform: translateY(-6px); }
    }
    @keyframes cardBreath {
        0%, 100% { box-shadow: 0 25px 80px rgba(0,0,0,0.8), 0 0 0px rgba(227,24,55,0); }
        50%       { box-shadow: 0 25px 80px rgba(0,0,0,0.8), 0 0 30px rgba(227,24,55,0.08); }
    }
    .page-enter         { animation: pageEnter 420ms cubic-bezier(0.22,1,0.36,1) both; }
    .pixel-sweep-active .pixel-sweep-line   { animation: pixelSweepLine 2s cubic-bezier(0.65, 0, 0.35, 1) forwards; }
    .pixel-sweep-active .pixel-grid-overlay { animation: pixelGridClear 2s cubic-bezier(0.65, 0, 0.35, 1) forwards; }
    
    .pixel-grid {
        background-image: 
            linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px);
        background-size: 32px 32px;
    }
    .orb-1          { animation: orb1 18s ease-in-out infinite; }
    .orb-2          { animation: orb2 22s ease-in-out infinite 3s; }
    .orb-3          { animation: orb3 14s ease-in-out infinite 7s; }
    .logo-float     { animation: logoFloat 5s ease-in-out infinite; }
    .card-breath    { animation: cardBreath 4s ease-in-out infinite; }
`;

export default function GuestLayout({
    children,
    brandContent,
    toggleSlot,
    reverse = false,
}) {
    const [isLoading, setIsLoading] = useState(true);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        // 1. Esperar un poco a que el DOM esté listo (página cargada en segundo plano)
        const startTimer = setTimeout(() => setIsAnimating(true), 150);

        // 2. Terminar isLoading después de que la animación de 2s haya completado sustancialmente
        const endTimer = setTimeout(() => setIsLoading(false), 2200);

        return () => {
            clearTimeout(startTimer);
            clearTimeout(endTimer);
        };
    }, []);
    /* ── Panel izquierdo: logo + TIER ONE centrado + brandContent ── */
    const BrandPanel = (
        <div className="relative z-10 hidden lg:flex lg:w-[55%] flex-col items-center justify-start pt-16 bg-[#0d0d0d] overflow-hidden">
            <ParticleCanvas />

            <div className="orb-1 absolute top-[20%] left-[30%] w-[28rem] h-[28rem] bg-[#e31837]/10 blur-[140px] rounded-full pointer-events-none" />
            <div className="orb-2 absolute bottom-[15%] right-[20%] w-[22rem] h-[22rem] bg-[#e31837]/07 blur-[120px] rounded-full pointer-events-none" />
            <div className="orb-3 absolute top-[50%] left-[60%] w-[16rem] h-[16rem] bg-white/[0.03] blur-[100px] rounded-full pointer-events-none" />

            <div className="scanline-sweep absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#e31837]/30 to-transparent pointer-events-none z-10" />

            <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage:
                        "radial-gradient(#ffffff 0.5px, transparent 0.5px)",
                    backgroundSize: "28px 28px",
                }}
            />

            {/* Línea vertical separadora */}
            <div
                className="absolute pointer-events-none z-10"
                style={{
                    [reverse ? "left" : "right"]: 0,
                    top: "8%",
                    bottom: "8%",
                    width: "1px",
                    background:
                        "linear-gradient(to bottom, transparent, #e31837 15%, #e31837 85%, transparent)",
                    boxShadow: "0 0 5px 1px rgba(227,24,55,0.45)",
                }}
            />

            {/* Logo + TIER ONE centrado */}
            <div className="relative z-10 flex flex-col items-center justify-center text-center gap-8 px-10 lg:px-16 w-full">
                <Link href="/" className="logo-float flex justify-center">
                    <HydraLogo size="xl" />
                </Link>
                {brandContent}
            </div>

            {/* Esquinas decorativas */}
            <div className="absolute top-6 left-6 w-10 h-px  bg-[#e31837]/40 z-10" />
            <div className="absolute top-6 left-6 w-px  h-10 bg-[#e31837]/40 z-10" />
            <div className="absolute bottom-6 left-6 w-10 h-px bg-[#e31837]/40 z-10" />
            <div className="absolute bottom-6 left-6 w-px  h-10 bg-[#e31837]/40 z-10" />

            <p className="absolute bottom-5 right-10 text-[8px] font-bold text-gray-700 uppercase tracking-[0.45em] select-none z-10">
                V.0.0.0.1 // TIER_ONE
            </p>
        </div>
    );

    /* ── Panel derecho: toggle + formulario ── */
    const FormPanel = (
        <div className="relative z-10 flex-1 flex flex-col bg-[#0a0a0a] overflow-hidden">
            <style>{styles}</style>

            <div className="orb-2 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30rem] h-[30rem] bg-[#e31837]/4 blur-[150px] rounded-full pointer-events-none" />

            {/* MÓVIL/TABLET: logo + TIER ONE centrado + toggle */}
            <div className="lg:hidden flex flex-col items-center gap-2 px-6 pt-20 pb-0 text-center">
                <Link href="/" className="flex justify-center logo-float">
                    <HydraLogo size="xl" />
                </Link>
                {toggleSlot && <div className="mt-8">{toggleSlot}</div>}
                <Link
                    href="/"
                    className="mt-2 inline-flex items-center gap-1.5 text-[10px] text-gray-500 hover:text-white transition-colors font-bold uppercase tracking-[0.2em] opacity-80"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-3 h-3"
                    >
                        <path
                            fillRule="evenodd"
                            d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z"
                            clipRule="evenodd"
                        />
                    </svg>
                    Volver al Inicio
                </Link>
            </div>

            {/* DESKTOP: Navegación agrupada arriba izquierda */}
            <div className="hidden lg:flex absolute top-6 left-8 z-20 items-center gap-6">
                {toggleSlot}
                <Link
                    href="/"
                    className="inline-flex items-center gap-1.5 text-[10px] text-gray-500 hover:text-white transition-colors font-bold uppercase tracking-[0.2em] opacity-80"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-3 h-3"
                    >
                        <path
                            fillRule="evenodd"
                            d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z"
                            clipRule="evenodd"
                        />
                    </svg>
                    Inicio
                </Link>
            </div>

            {/* Formulario centrado */}
            <div className="flex-1 flex items-center justify-center px-4 pt-1 pb-4 lg:p-10 lg:mt-8 page-enter overflow-y-auto">
                <div className="relative w-full max-w-[520px]">
                    <div
                        className="card-breath relative overflow-hidden
                        px-6 py-8 sm:px-10 sm:py-10 lg:px-12 lg:py-12
                        bg-[#131313] border border-white/[0.05] rounded-2xl
                        shadow-[0_25px_80px_rgba(0,0,0,0.8)]"
                    >
                        <KittLine
                            direction="horizontal"
                            speed="fast"
                            opacity={1}
                            className="absolute top-0 left-0 right-0 z-10"
                            style={{
                                height: "2px",
                                boxShadow: "0 0 16px 6px rgba(227,24,55,0.7)",
                            }}
                        />
                        <div className="absolute bottom-0 left-0 w-6 h-px bg-[#e31837]/50 rounded-full" />
                        <div className="absolute bottom-0 left-0 w-px  h-6 bg-[#e31837]/50 rounded-full" />

                        {children}
                    </div>
                </div>
            </div>

            {/* Global Ambient Glows */}
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#e31837]/5 blur-[120px] rounded-full pointer-events-none"></div>
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#e31837]/5 blur-[120px] rounded-full pointer-events-none"></div>
        </div>
    );

    return (
        <div className="relative h-screen w-screen bg-[#0d0d0d] flex overflow-hidden font-sans antialiased">
            {/* Overlay de Carga Inicial (Pixel Sweep) */}
            {isLoading && (
                <div
                    className={`fixed inset-0 z-[9999] pointer-events-none ${isAnimating ? "pixel-sweep-active" : ""}`}
                >
                    {/* El fondo de cuadrados borrosos que desaparece */}
                    <div className="pixel-grid-overlay absolute inset-0 bg-[#0d0d0d] overflow-hidden">
                        <div className="pixel-grid absolute inset-0 opacity-20" />
                        <div className="absolute inset-0 backdrop-blur-lg" />
                    </div>
                    {/* Línea de escaneo horizontal */}
                    <div className="pixel-sweep-line absolute left-0 right-0 h-[4px] bg-[#e31837] shadow-[0_0_40px_10px_rgba(227,24,55,1)] z-[10000]">
                        <div className="absolute inset-0 bg-white/20 blur-[1px]" />
                    </div>
                </div>
            )}

            {reverse ? (
                <>
                    {FormPanel}
                    {BrandPanel}
                </>
            ) : (
                <>
                    {BrandPanel}
                    {FormPanel}
                </>
            )}
        </div>
    );
}
