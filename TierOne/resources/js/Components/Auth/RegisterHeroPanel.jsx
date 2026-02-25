/**
 * RegisterHeroPanel — Panel derecho compacto para la vista de Registro.
 * Diseñado para caber en el panel hero sin overflow, con scroll si es necesario.
 */

const stats = [
    { value: "+5K", label: "Jugadores" },
    { value: "+300", label: "Torneos" },
    { value: "+15", label: "Países" },
];

const benefits = [
    {
        icon: (
            <svg
                viewBox="0 0 24 24"
                fill="none"
                className="w-4 h-4 shrink-0"
                stroke="currentColor"
                strokeWidth={1.5}
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0"
                />
            </svg>
        ),
        title: "Compite",
        desc: "Torneos online con premios reales.",
    },
    {
        icon: (
            <svg
                viewBox="0 0 24 24"
                fill="none"
                className="w-4 h-4 shrink-0"
                stroke="currentColor"
                strokeWidth={1.5}
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
                />
            </svg>
        ),
        title: "Escala",
        desc: "Rankings globales y tu historial.",
    },
    {
        icon: (
            <svg
                viewBox="0 0 24 24"
                fill="none"
                className="w-4 h-4 shrink-0"
                stroke="currentColor"
                strokeWidth={1.5}
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                />
            </svg>
        ),
        title: "Equípate",
        desc: "Tienda gaming con productos exclusivos.",
    },
];

export default function RegisterHeroPanel() {
    return (
        <div className="flex flex-col items-center text-center gap-6 w-full overflow-y-auto max-h-[calc(100vh-12rem)] px-2 py-2">
            {/* Headline */}
            <div className="space-y-1.5 shrink-0">
                <p className="text-[8px] font-black uppercase tracking-[0.4em] text-[#e31837]">
                    Bienvenido
                </p>
                <h2 className="text-3xl font-black uppercase italic tracking-tight text-white leading-none">
                    ÚNETE A <span className="text-[#e31837]">LA ÉLITE</span>
                </h2>
            </div>

            {/* Stats row */}
            <div className="flex items-center gap-6 shrink-0">
                {stats.map((s, i) => (
                    <div key={i} className="flex flex-col items-center gap-0.5">
                        <span className="text-xl font-black text-white">
                            {s.value}
                        </span>
                        <span className="text-[8px] font-bold uppercase tracking-[0.25em] text-gray-500">
                            {s.label}
                        </span>
                    </div>
                ))}
            </div>

            {/* Benefits */}
            <div className="flex flex-col gap-2.5 w-full max-w-[280px] shrink-0">
                {benefits.map((b, i) => (
                    <div
                        key={i}
                        className="flex items-center gap-3 text-left px-3.5 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-[#e31837]/30 transition-colors duration-300"
                    >
                        <span className="text-[#e31837]">{b.icon}</span>
                        <div>
                            <p className="text-[9px] font-black uppercase tracking-[0.15em] text-white leading-none mb-0.5">
                                {b.title}
                            </p>
                            <p className="text-[9px] text-gray-500 leading-snug">
                                {b.desc}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quote */}
            <p className="text-[9px] font-semibold italic text-gray-600 shrink-0">
                "El camino a la cima empieza aquí"
            </p>
        </div>
    );
}
