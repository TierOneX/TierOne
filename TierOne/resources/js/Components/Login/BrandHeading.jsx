/**
 * BrandHeading — Heading "Acceso al Sistema" del panel hero izquierdo en desktop.
 * Diseñado para leerse en grande sobre un fondo oscuro completo.
 */
export default function BrandHeading() {
    return (
        <div className="flex flex-col items-center text-center gap-3 max-w-sm">
            <h1 className="text-4xl lg:text-5xl font-black uppercase italic tracking-tight text-white leading-tight">
                ACCESO AL{" "}
                <span className="text-[#e31837] drop-shadow-[0_0_10px_rgba(227,24,55,0.8)]">
                    SISTEMA
                </span>
            </h1>
            <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-[0.45em]">
                Terminal Operativa de TierOne
            </p>
        </div>
    );
}
