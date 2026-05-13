import { Head, Link } from "@inertiajs/react";
import { useEffect, useState } from "react";

const styles = `
    @keyframes pulseGlow {
        0%, 100% { filter: drop-shadow(0 0 8px rgba(227,24,55,0.3)); }
        50%       { filter: drop-shadow(0 0 22px rgba(227,24,55,0.65)); }
    }
    @keyframes floatHydra {
        0%, 100% { transform: translateY(0px); }
        50%       { transform: translateY(-12px); }
    }
    @keyframes scanline {
        0%   { transform: translateY(-100%); }
        100% { transform: translateY(100vh); }
    }
    @keyframes codeRain {
        0%   { opacity: 0; transform: translateY(-20px); }
        10%  { opacity: 1; }
        90%  { opacity: 1; }
        100% { opacity: 0; transform: translateY(20px); }
    }
    @keyframes blink {
        0%, 100% { opacity: 1; }
        50%       { opacity: 0; }
    }
    .hydra-img  { animation: floatHydra 5s ease-in-out infinite, pulseGlow 3s ease-in-out infinite; }
    .scanline   { animation: scanline 7s linear infinite; }
    .cursor     { animation: blink 1s step-end infinite; }
    @keyframes enterUp {
        from { opacity: 0; transform: translateY(24px); }
        to   { opacity: 1; transform: translateY(0); }
    }
    .enter  { animation: enterUp 0.5s cubic-bezier(0.22,1,0.36,1) both; }
    .enter2 { animation: enterUp 0.5s cubic-bezier(0.22,1,0.36,1) 0.12s both; }
    .enter3 { animation: enterUp 0.5s cubic-bezier(0.22,1,0.36,1) 0.22s both; }
    .full-dvh { height: 100dvh; min-height: 100dvh; }
`;

/* Barra de progreso falsa tipo "cargando" */
function FakeProgress() {
    const [pct, setPct] = useState(0);
    useEffect(() => {
        const targets = [23, 47, 61, 79, 88];
        let i = 0;
        const tick = () => {
            if (i < targets.length) {
                setPct(targets[i++]);
                setTimeout(tick, 600 + Math.random() * 800);
            }
        };
        setTimeout(tick, 400);
    }, []);

    return (
        <div className="w-full max-w-xs mx-auto mt-3 sm:mt-5">
            <div className="flex justify-between text-[9px] font-mono text-gray-600 mb-1.5 uppercase tracking-widest">
                <span>Inicializando servidor</span>
                <span className="text-[#e31837]">{pct}%</span>
            </div>
            <div className="h-1 rounded-full bg-white/[0.05] overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-[#e31837] to-[#ff4060] rounded-full transition-all duration-700 ease-out"
                    style={{
                        width: `${pct}%`,
                        boxShadow: "0 0 8px rgba(227,24,55,0.6)",
                    }}
                />
            </div>
        </div>
    );
}

export default function Error({ status }) {
    const is404 = status === 404;
    const is503 = status === 503;

    const title = is404 ? "404" : is503 ? "503" : String(status);
    const heading = is404
        ? "Zona en construcción"
        : is503
          ? "Servicio no disponible"
          : "Algo salió mal";
    const sub = is404
        ? "Esta página todavía está siendo forjada por la Hydra. Pronto abrirá sus puertas."
        : is503
          ? "El servidor está temporalmente fuera de servicio. Estamos trabajando en ello."
          : "Ha ocurrido un error inesperado. Nuestro equipo ya está en ello.";

    return (
        <>
            <Head title={`${title} — TierOne`} />
            <style>{styles}</style>

            {/* Fondo */}
            <div className="relative full-dvh bg-[#080808] flex flex-col items-center justify-center overflow-hidden px-4 py-6">
                {/* Scanline sutil */}
                <div className="scanline pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#e31837]/10 to-transparent z-10" />

                {/* Orbes de fondo */}
                <div className="pointer-events-none absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-[#e31837]/[0.04] blur-[120px]" />
                <div className="pointer-events-none absolute -bottom-40 -right-40 w-[400px] h-[400px] rounded-full bg-[#e31837]/[0.03] blur-[100px]" />

                {/* Grid de puntos */}
                <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                        backgroundImage:
                            "radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)",
                        backgroundSize: "32px 32px",
                    }}
                />

                {/* Contenido */}
                <div className="relative z-20 flex flex-col items-center text-center max-w-lg">
                    {/* Imagen Hydra */}
                    <div className="hydra-img mb-3 sm:mb-5 enter">
                        <img
                            src="/images/hidra_castillo.png"
                            alt="TierOne Hydra"
                            className="w-28 sm:w-40 md:w-52 opacity-90"
                            style={{
                                filter: "brightness(0.95) contrast(1.05)",
                            }}
                        />
                    </div>

                    {/* Número de error */}
                    <div
                        className="enter font-black text-[80px] sm:text-[100px] leading-none tracking-[-4px] select-none"
                        style={{
                            color: "transparent",
                            WebkitTextStroke: "2px rgba(227,24,55,0.5)",
                            textShadow: "0 0 40px rgba(227,24,55,0.2)",
                        }}
                    >
                        {title}
                    </div>

                    {/* Título */}
                    <h1 className="enter2 mt-2 text-lg sm:text-xl font-black uppercase tracking-[0.12em] text-white">
                        {heading}
                    </h1>

                    {/* Descripción */}
                    <p className="enter3 mt-2 text-xs sm:text-sm text-gray-500 leading-relaxed max-w-xs sm:max-w-sm">
                        {sub}
                    </p>

                    {/* Terminal fake */}
                    <div className="enter2 mt-4 w-full max-w-xs rounded-xl bg-[#0d0d0d] border border-white/[0.06] px-3 sm:px-4 py-2.5 text-left font-mono text-[10px] sm:text-[11px] text-gray-600">
                        <span className="text-[#e31837]">tierone@server</span>
                        <span className="text-gray-600">:</span>
                        <span className="text-blue-400">~</span>
                        <span className="text-gray-600">$ </span>
                        <span className="text-gray-400">
                            status --page {title}
                        </span>
                        <br />
                        <span className="text-yellow-600/80">⚠ </span>
                        <span className="text-gray-500">En construcción</span>
                        <span className="cursor text-[#e31837]">█</span>
                    </div>

                    {/* Barra de progreso */}
                    {is404 && <FakeProgress />}

                    {/* Botón volver */}
                    <Link
                        href="/home"
                        className="enter3 mt-4 sm:mt-6 inline-flex items-center gap-2 px-6 py-2.5 bg-[#e31837] hover:bg-[#c41430] text-white text-xs font-black uppercase tracking-widest rounded-lg transition-colors"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            className="w-4 h-4"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                            />
                        </svg>
                        Volver al inicio
                    </Link>
                </div>

                {/* Esquinas decorativas */}
                <div className="pointer-events-none absolute bottom-8 left-8 w-8 h-8 border-l-2 border-b-2 border-[#e31837]/20" />
                <div className="pointer-events-none absolute top-8 right-8 w-8 h-8 border-r-2 border-t-2 border-[#e31837]/20" />
            </div>
        </>
    );
}
