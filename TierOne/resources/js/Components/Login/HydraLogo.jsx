import React from "react";

/**
 * HydraLogo — Logo principal de TierOne.
 * Solo drop-shadow para el efecto neón — sin capas de blur que creen fondo visible.
 *
 * Props:
 *   size = "sm" | "lg" | "xl"   (default "lg")
 */
export default function HydraLogo({ size = "lg", className = "", ...props }) {
    const cfg = {
        sm: { img: "w-16 h-16", title: "text-2xl", sub: "text-[8px]" },
        lg: { img: "w-24 h-24", title: "text-4xl", sub: "text-[9px]" },
        xl: { img: "w-36 h-36", title: "text-5xl", sub: "text-[10px]" },
    }[size] ?? { img: "w-24 h-24", title: "text-4xl", sub: "text-[9px]" };

    return (
        <div
            className={`flex flex-col items-center text-center ${className}`}
            {...props}
        >
            {/* Logo image — cero relleno de fondo, solo drop-shadow */}
            <img
                src="/assets/hydra-logo.png"
                alt="TierOne Logo"
                className={`${cfg.img} object-contain select-none
                            drop-shadow-[0_0_22px_rgba(227,24,55,0.75)]`}
            />

            {/* Text */}
            <div className="mt-4">
                <h2
                    className={`${cfg.title} font-black italic tracking-tighter text-white uppercase leading-none`}
                >
                    TIER
                    <span className="text-[#e31837] drop-shadow-[0_0_12px_rgba(227,24,55,0.9)]">
                        {" "}
                        ONE
                    </span>
                </h2>
                <p
                    className={`${cfg.sub} font-bold text-gray-500 uppercase tracking-[0.45em] mt-2`}
                >
                    Elite Competitive Platform
                </p>
            </div>
        </div>
    );
}
