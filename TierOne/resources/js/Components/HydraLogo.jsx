import React from "react";

export default function HydraLogo({ className = "", ...props }) {
    return (
        <div
            className={`flex flex-col items-center justify-center text-center ${className}`}
            {...props}
        >
            <div className="relative flex items-center justify-center">
                {/* Intense Outer Glow Rings */}
                <div className="absolute -inset-10 bg-[#e31837]/25 blur-3xl rounded-full animate-pulse opacity-60"></div>
                <div className="absolute -inset-4 bg-[#e31837]/20 blur-2xl rounded-full"></div>

                {/* Logo Image */}
                <img
                    src="/assets/hydra-logo.png"
                    alt="TierOne Logo"
                    className="relative w-28 h-28 object-contain drop-shadow-[0_0_20px_rgba(227,24,55,0.8)]"
                />
            </div>

            {/* Logo Text - TIER ONE Style */}
            <div className="mt-6">
                <h2 className="text-4xl font-black italic tracking-tighter text-white uppercase flex items-center justify-center">
                    <span className="opacity-90">TIER</span>
                    <span className="text-[#e31837] ml-2 drop-shadow-[0_0_15px_rgba(227,24,55,1)]">
                        ONE
                    </span>
                </h2>
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.5em] mt-2 opacity-80 w-full text-center">
                    Elite Competitive Platform
                </p>
            </div>
        </div>
    );
}
