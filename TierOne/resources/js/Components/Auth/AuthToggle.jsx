import { router } from "@inertiajs/react";
import { useState } from "react";

/**
 * AuthToggle — Botones Login / Registro con transición de barra roja full-screen.
 * Al hacer clic, una línea roja barre la pantalla de izquierda a derecha
 * y luego navega a la página destino.
 */
export default function AuthToggle({ active = "login" }) {
    const isLogin = active === "login";
    const [transitioning, setTransitioning] = useState(false);

    const navigate = (to) => {
        if (to === active || transitioning) return;
        setTransitioning(true);
        // Fundido rápido a negro antes de navegar
        setTimeout(() => {
            router.visit(to === "login" ? "/login" : "/register", {
                replace: true,
            });
        }, 400);
    };

    const btnBase =
        "relative z-10 px-8 py-2.5 text-sm font-black uppercase tracking-widest transition-colors duration-200 rounded-full";

    return (
        <>
            <style>{`
                @keyframes fadeToBlack {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }
                .fade-to-black {
                    animation: fadeToBlack 350ms ease forwards;
                }
                .pixel-grid-simple {
                    background-image: 
                        linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px);
                    background-size: 32px 32px;
                }
            `}</style>

            {/* Overlay de salida (Cierre a negro) */}
            {transitioning && (
                <div className="fixed inset-0 z-[9999] pointer-events-none fade-to-black bg-[#0d0d0d]">
                    <div className="pixel-grid-simple absolute inset-0 opacity-20" />
                    <div className="absolute inset-0 backdrop-blur-sm" />
                </div>
            )}

            {/* Botones */}
            <div className="inline-flex items-center gap-1 bg-white/[0.05] border border-white/[0.08] rounded-full p-[4px]">
                <button
                    type="button"
                    onClick={() => navigate("login")}
                    className={[
                        btnBase,
                        isLogin
                            ? "bg-[#e31837] text-white shadow-[0_0_12px_rgba(227,24,55,0.5)]"
                            : "text-gray-400 hover:text-white",
                    ].join(" ")}
                >
                    Login
                </button>
                <button
                    type="button"
                    onClick={() => navigate("register")}
                    className={[
                        btnBase,
                        !isLogin
                            ? "bg-[#e31837] text-white shadow-[0_0_12px_rgba(227,24,55,0.5)]"
                            : "text-gray-400 hover:text-white",
                    ].join(" ")}
                >
                    Registro
                </button>
            </div>
        </>
    );
}
