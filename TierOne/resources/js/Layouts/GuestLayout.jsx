import HydraLogo from "@/Components/Auth/HydraLogo";
import KittLine from "@/Components/Auth/KittLine";
import ParticleCanvas from "@/Components/Auth/ParticleCanvas";
import { Link } from "@inertiajs/react";

const styles = `
    @keyframes pageEnter {
        from { opacity: 0; transform: translateY(18px) scale(0.98); }
        to   { opacity: 1; transform: translateY(0)    scale(1);    }
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
    @keyframes scanline {
        0%   { top: -4px;    opacity: 0; }
        5%   { opacity: 0.6; }
        95%  { opacity: 0.6; }
        100% { top: 100%;    opacity: 0; }
    }
    @keyframes logoFloat {
        0%, 100% { transform: translateY(0px); }
        50%       { transform: translateY(-6px); }
    }
    @keyframes cardBreath {
        0%, 100% { box-shadow: 0 25px 80px rgba(0,0,0,0.8), 0 0 0px rgba(227,24,55,0); }
        50%       { box-shadow: 0 25px 80px rgba(0,0,0,0.8), 0 0 30px rgba(227,24,55,0.08); }
    }
    .page-enter     { animation: pageEnter 420ms cubic-bezier(0.22,1,0.36,1) both; }
    .orb-1          { animation: orb1 18s ease-in-out infinite; }
    .orb-2          { animation: orb2 22s ease-in-out infinite 3s; }
    .orb-3          { animation: orb3 14s ease-in-out infinite 7s; }
    .scanline-sweep { animation: scanline 7s linear infinite; }
    .logo-float     { animation: logoFloat 5s ease-in-out infinite; }
    .card-breath    { animation: cardBreath 4s ease-in-out infinite; }
`;

export default function GuestLayout({
    children,
    brandContent,
    toggleSlot,
    reverse = false,
}) {
    const BrandPanel = (
        <div className="relative z-10 hidden md:flex md:w-[52%] lg:w-[55%] flex-col items-center justify-center bg-[#0d0d0d] overflow-hidden">
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

            <div className="relative z-10 flex flex-col items-center text-center gap-8 px-10 lg:px-16 w-full overflow-y-auto max-h-full py-10">
                <Link href="/" className="logo-float block shrink-0">
                    <HydraLogo size="xl" />
                </Link>
                {brandContent}
            </div>

            <div className="absolute top-6 left-6 w-10 h-px  bg-[#e31837]/40 z-10" />
            <div className="absolute top-6 left-6 w-px  h-10 bg-[#e31837]/40 z-10" />
            <div className="absolute bottom-6 left-6 w-10 h-px bg-[#e31837]/40 z-10" />
            <div className="absolute bottom-6 left-6 w-px  h-10 bg-[#e31837]/40 z-10" />

            <p className="absolute bottom-5 right-10 text-[8px] font-bold text-gray-700 uppercase tracking-[0.45em] select-none z-10">
                V.0.0.0.1 // TIER_ONE
            </p>
        </div>
    );

    const FormPanel = (
        <div className="relative z-10 flex-1 flex flex-col bg-[#0a0a0a] overflow-hidden">
            <style>{styles}</style>

            <div className="orb-2 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30rem] h-[30rem] bg-[#e31837]/4 blur-[150px] rounded-full pointer-events-none" />

            {/* MÓVIL */}
            <div className="md:hidden flex flex-col items-start gap-4 px-6 pt-6 pb-2">
                <Link href="/">
                    <HydraLogo size="sm" />
                </Link>
                {toggleSlot && <div>{toggleSlot}</div>}
            </div>

            {/* DESKTOP — toggle arriba izquierda */}
            {toggleSlot && (
                <div className="hidden md:block absolute top-6 left-8 z-20">
                    {toggleSlot}
                </div>
            )}

            <div className="flex-1 flex items-center justify-center p-6 md:p-10 md:mt-10 page-enter">
                <div className="relative w-full max-w-[410px]">
                    <div className="card-breath relative overflow-hidden px-8 py-10 sm:px-10 sm:py-12 bg-[#131313] border border-white/[0.05] rounded-2xl shadow-[0_25px_80px_rgba(0,0,0,0.8)]">
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
                        <div className="absolute bottom-0 left-0 w-6 h-px bg-[#e31837]/50 rounded-full" />
                        <div className="absolute bottom-0 left-0 w-px  h-6 bg-[#e31837]/50 rounded-full" />
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="relative h-screen w-screen bg-[#0d0d0d] flex overflow-hidden font-sans antialiased">
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
