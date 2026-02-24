import React from "react";

/**
 * KittLine — Línea roja animada estilo "Coche Fantástico" (KITT).
 * Un brillo viaja de un extremo al otro en bucle infinito.
 *
 * Props:
 *   direction  "horizontal" | "vertical"   default "horizontal"
 *   className  clases de posicionamiento / tamaño
 *   speed      "slow" | "normal" | "fast"  default "normal"
 *   opacity    number 0-1                  default 0.55
 *   style      estilos extra (ej: boxShadow)
 */
export default function KittLine({
    direction = "horizontal",
    className = "",
    speed = "normal",
    opacity = 0.55,
    style = {},
}) {
    const isVertical = direction === "vertical";
    const durations = { slow: "3.5s", normal: "2.2s", fast: "1.2s" };
    const dur = durations[speed] ?? durations.normal;

    /* ── Keyframes ──────────────────────────────────────────────────────── */
    const keyframes = isVertical
        ? `@keyframes kitt-v {
            0%   { top: -20%; opacity: 0; }
            8%   { opacity: 1; }
            92%  { opacity: 1; }
            100% { top: 110%; opacity: 0; }
          }`
        : `@keyframes kitt-h {
            0%   { left: -20%; opacity: 0; }
            8%   { opacity: 1; }
            92%  { opacity: 1; }
            100% { left: 110%; opacity: 0; }
          }`;

    /* ── Traveler (el "ojo" de KITT) ────────────────────────────────────── */
    const travelerStyle = isVertical
        ? {
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            width: "200%",
            height: "20%",
            background: "radial-gradient(ellipse 60% 50% at 50% 50%, #ff4060 0%, #e31837 25%, rgba(227,24,55,0.15) 70%, transparent 100%)",
            filter: "blur(3px)",
            animation: `kitt-v ${dur} ease-in-out infinite`,
            borderRadius: "50%",
        }
        : {
            position: "absolute",
            top: "50%",
            transform: "translateY(-50%)",
            height: "800%",
            width: "20%",
            background: "radial-gradient(ellipse 50% 60% at 50% 50%, #ff4060 0%, #e31837 20%, rgba(227,24,55,0.25) 60%, transparent 100%)",
            filter: "blur(6px)",
            animation: `kitt-h ${dur} ease-in-out infinite`,
            borderRadius: "50%",
        };

    /* ── Track (línea base estática) ────────────────────────────────────── */
    const trackStyle = isVertical
        ? { background: `linear-gradient(to bottom, transparent, rgba(227,24,55,${opacity * 0.65}), transparent)` }
        : { background: `linear-gradient(to right,  transparent, rgba(227,24,55,${opacity * 0.65}), transparent)` };

    return (
        <>
            <style>{keyframes}</style>

            {/*
             * Wrapper exterior — el className controla el posicionamiento.
             * overflow:visible aquí para que el boxShadow no se corte.
             */}
            <div className={className} style={{ pointerEvents: "none", ...style }}>

                {/*
                 * Track interior — overflow:hidden limita la animación a los
                 * límites del track. Separado del wrapper para no cortar el glow.
                 */}
                <div className="absolute inset-0 overflow-hidden" style={trackStyle}>
                    <div style={travelerStyle} />
                </div>

            </div>
        </>
    );
}
