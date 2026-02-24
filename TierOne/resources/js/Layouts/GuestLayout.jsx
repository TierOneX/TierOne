import HydraLogo from "@/Components/Login/HydraLogo";
import KittLine from "@/Components/Login/KittLine";
import { Link } from "@inertiajs/react";

/**
 * GuestLayout
 *
 * Desktop : split full-bleed — panel izquierdo (marca) + panel derecho (form)
 * Móvil   : apilado — logo arriba, card abajo
 *
 * Elementos decorativos:
 *   • Separador vertical rojo — borde derecho del panel izquierdo (right:0)
 *   • KittLine horizontal animada — borde superior de la card
 */
export default function GuestLayout({ children, brandContent }) {
    return (
        <div className="relative h-screen w-screen bg-[#0d0d0d] flex overflow-hidden font-sans antialiased">
            {/* ──────────────────────────────────────────────────
                PANEL IZQUIERDO — Marca / Hero (solo desktop)
            ────────────────────────────────────────────────── */}
            <div className="relative z-10 hidden md:flex md:w-[52%] lg:w-[55%] flex-col items-center justify-center bg-[#0d0d0d]">
                {/* Separador vertical — borde derecho, sin llegar a los extremos */}
                <div
                    className="absolute pointer-events-none z-10"
                    style={{
                        right: 0,
                        top: "8%",
                        bottom: "8%",
                        width: "1px",
                        background:
                            "linear-gradient(to bottom, transparent, #e31837 15%, #e31837 85%, transparent)",
                        boxShadow: "0 0 5px 1px rgba(227,24,55,0.45)",
                    }}
                />

                {/* Ambient glow */}
                <div className="absolute top-1/2 left-[40%] -translate-x-1/2 -translate-y-1/2 w-[35rem] h-[35rem] bg-[#e31837]/6 blur-[180px] rounded-full pointer-events-none" />

                {/* Dot grid */}
                <div
                    className="absolute inset-0 opacity-[0.035] pointer-events-none"
                    style={{
                        backgroundImage:
                            "radial-gradient(#ffffff 0.5px, transparent 0.5px)",
                        backgroundSize: "28px 28px",
                    }}
                />

                {/* Contenido de marca */}
                <div className="relative flex flex-col items-center text-center gap-10 px-12 lg:px-20">
                    <Link
                        href="/"
                        className="block transition-transform duration-500 hover:scale-105"
                    >
                        <HydraLogo size="xl" />
                    </Link>
                    {brandContent}
                </div>

                {/* Esquinas decorativas — esquina superior e inferior izquierda */}
                <div className="absolute top-6 left-6 w-10 h-px  bg-[#e31837]/40" />
                <div className="absolute top-6 left-6 w-px  h-10 bg-[#e31837]/40" />
                <div className="absolute bottom-6 left-6 w-10 h-px bg-[#e31837]/40" />
                <div className="absolute bottom-6 left-6 w-px  h-10 bg-[#e31837]/40" />

                {/* Versión */}
                <p className="absolute bottom-6 right-10 text-[8px] font-bold text-gray-700 uppercase tracking-[0.45em] select-none">
                    V.0.0.0.1 // TIER_ONE
                </p>
            </div>

            {/* ──────────────────────────────────────────────────
                PANEL DERECHO — Formulario
            ────────────────────────────────────────────────── */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 md:p-10 overflow-y-auto bg-[#0a0a0a]">
                {/* Glow sutil lado derecho */}
                <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-[#e31837]/3 blur-[130px] rounded-full pointer-events-none" />

                {/* Logo móvil — oculto en md+ */}
                <div className="md:hidden mb-8 flex flex-col items-center">
                    <Link href="/">
                        <HydraLogo size="sm" />
                    </Link>
                </div>

                {/* Card del formulario */}
                <div className="relative w-full max-w-[410px]">
                    {/* inner: relative + overflow-hidden para que KittLine
                        se recorte limpia en las esquinas redondeadas */}
                    <div className="relative overflow-hidden px-8 py-10 sm:px-10 sm:py-12 bg-[#131313] border border-white/[0.05] rounded-2xl shadow-[0_25px_80px_rgba(0,0,0,0.8)]">
                        {/* KittLine — borde superior de la card */}
                        <KittLine
                            direction="horizontal"
                            speed="fast"
                            opacity={0.95}
                            className="absolute top-0 left-0 right-0"
                            style={{
                                height: "2px",
                                boxShadow: "0 0 14px 5px rgba(227,24,55,0.55)",
                            }}
                        />

                        {/* Esquinas decorativas — inferior izquierda */}
                        <div className="absolute bottom-0 left-0 w-6 h-px bg-[#e31837]/50 rounded-full" />
                        <div className="absolute bottom-0 left-0 w-px  h-6 bg-[#e31837]/50 rounded-full" />

                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
