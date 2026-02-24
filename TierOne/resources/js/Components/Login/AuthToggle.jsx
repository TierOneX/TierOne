import { router } from "@inertiajs/react";
import { useState } from "react";

/**
 * AuthToggle — Pill animado con transición spring y efectos de clic.
 */
export default function AuthToggle({ active = "login" }) {
    const isLogin = active === "login";
    const [clicking, setClicking] = useState(null); // "login" | "register" | null

    const navigate = (to) => {
        if (to === active) return;
        setClicking(to);
        setTimeout(
            () => router.visit(to === "login" ? "/login" : "/register"),
            280,
        );
    };

    return (
        <>
            {/* Keyframes inyectados inline */}
            <style>{`
                @keyframes thumbGlow {
                    0%   { box-shadow: 0 0 0px 0px rgba(227,24,55,0); }
                    50%  { box-shadow: 0 0 18px 6px rgba(227,24,55,0.55); }
                    100% { box-shadow: 0 0 8px 2px rgba(227,24,55,0.25); }
                }
                @keyframes pillPulse {
                    0%   { border-color: rgba(255,255,255,0.08); }
                    40%  { border-color: rgba(227,24,55,0.6); }
                    100% { border-color: rgba(255,255,255,0.08); }
                }
                @keyframes labelFlash {
                    0%   { opacity: 1; }
                    40%  { opacity: 0.4; }
                    100% { opacity: 1; }
                }
                .toggle-thumb {
                    transition: transform 360ms cubic-bezier(0.34, 1.56, 0.64, 1);
                }
                .toggle-thumb-glow {
                    animation: thumbGlow 600ms ease forwards;
                }
                .toggle-pill-pulse {
                    animation: pillPulse 500ms ease forwards;
                }
                .label-flash {
                    animation: labelFlash 280ms ease forwards;
                }
            `}</style>

            <div
                className={[
                    "inline-flex items-center bg-white/[0.05] border border-white/[0.08] rounded-full p-[3px] relative cursor-pointer select-none",
                    clicking !== null ? "toggle-pill-pulse" : "",
                ].join(" ")}
            >
                {/* Thumb deslizante con spring */}
                <span
                    className={[
                        "toggle-thumb absolute inset-[3px] w-[calc(50%-3px)] rounded-full bg-[#e31837]",
                        clicking !== null ? "toggle-thumb-glow" : "",
                    ].join(" ")}
                    style={{
                        transform: isLogin
                            ? "translateX(0)"
                            : "translateX(100%)",
                    }}
                />

                {/* LOGIN */}
                <button
                    type="button"
                    onClick={() => navigate("login")}
                    className={[
                        "relative z-10 px-6 py-1.5 rounded-full text-[9px] font-black uppercase",
                        "transition-colors duration-200 min-w-[72px] text-center",
                        isLogin
                            ? "text-white"
                            : "text-gray-500 hover:text-gray-300",
                        clicking === "login" ? "label-flash" : "",
                    ].join(" ")}
                >
                    Login
                </button>

                {/* REGISTRO */}
                <button
                    type="button"
                    onClick={() => navigate("register")}
                    className={[
                        "relative z-10 px-6 py-1.5 rounded-full text-[9px] font-black uppercase",
                        "transition-colors duration-200 min-w-[72px] text-center",
                        !isLogin
                            ? "text-white"
                            : "text-gray-500 hover:text-gray-300",
                        clicking === "register" ? "label-flash" : "",
                    ].join(" ")}
                >
                    Registro
                </button>
            </div>
        </>
    );
}
