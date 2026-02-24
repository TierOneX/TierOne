import HydraLogo from "@/Components/HydraLogo";
import { Link } from "@inertiajs/react";

export default function GuestLayout({ children }) {
    return (
        <div className="relative h-screen bg-[#0a0a0a] flex flex-col md:flex-row overflow-hidden font-sans antialiased text-gray-200">
            {/* Geometric Background (Grid Pattern) - Global */}
            <div
                className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage: `radial-gradient(#ffffff 0.5px, transparent 0.5px)`,
                    backgroundSize: "30px 30px",
                }}
            ></div>

            {/* 
                LEFT PANEL: Branding & Visuals 
                Visible on md+ as a side panel, on mobile as a top header.
            */}
            <div className="relative z-10 w-full md:w-[40%] lg:w-[35%] flex flex-col items-center justify-center p-8 md:p-6 bg-gradient-to-b from-[#121212]/50 to-transparent md:bg-transparent">
                {/* Subtle Neon Glow (Left specific) */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#e31837]/10 blur-[130px] rounded-full pointer-events-none"></div>

                <div className="relative transition-all duration-500 hover:scale-105 flex flex-col items-center justify-center w-full">
                    <Link
                        href="/"
                        className="flex flex-col items-center justify-center"
                    >
                        <HydraLogo className="scale-75 sm:scale-90 lg:scale-100" />
                    </Link>
                </div>

                {/* System Status Decorative Element (Desktop only) */}
                <div className="hidden md:flex mt-8 flex-col items-center gap-2 opacity-20 select-none">
                    <div className="flex gap-1">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="w-1 h-2 bg-[#e31837] rounded-full animate-pulse"
                                style={{ animationDelay: `${i * 0.2}s` }}
                            ></div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 
                RIGHT PANEL: Content Container
            */}
            <div className="relative z-10 w-full md:w-[60%] lg:w-[65%] flex flex-col items-center justify-center p-4 md:p-8 min-h-[50vh] md:min-h-screen">
                {/* Futuristic Container - Tighter max-width and padding */}
                <div className="relative w-full max-w-[400px] px-6 py-8 sm:px-8 sm:py-10 bg-[#121212]/95 backdrop-blur-2xl border border-white/5 rounded-3xl shadow-[0_0_100px_rgba(0,0,0,1)] overflow-hidden transition-all duration-300">
                    {/* Cyberpunk Accents */}
                    <div className="absolute top-0 left-0 w-8 h-[2px] bg-[#e31837] opacity-60"></div>
                    <div className="absolute top-0 left-0 w-[2px] h-8 bg-[#e31837] opacity-60"></div>

                    <div className="absolute bottom-0 right-0 w-8 h-[2px] bg-[#e31837] opacity-60"></div>
                    <div className="absolute bottom-0 right-0 w-[2px] h-8 bg-[#e31837] opacity-60"></div>

                    {children}
                </div>

                {/* Footer Sync Status */}
                <div className="mt-6 md:mt-8 text-center text-[8px] text-gray-700 font-black uppercase tracking-[0.5em] opacity-30">
                    V.4.0.2 // SYSTEM_READY
                </div>
            </div>

            {/* Global Ambient Glows */}
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#e31837]/5 blur-[120px] rounded-full pointer-events-none"></div>
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#e31837]/5 blur-[120px] rounded-full pointer-events-none"></div>
        </div>
    );
}
