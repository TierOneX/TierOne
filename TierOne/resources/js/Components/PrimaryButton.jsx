export default function PrimaryButton({
    className = "",
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center justify-center rounded-lg border border-transparent bg-[#e31837] px-6 py-3 text-xs font-black uppercase tracking-[0.2em] text-white transition-all duration-300 ease-out hover:bg-[#ff1e3c] hover:shadow-[0_0_25px_rgba(227,24,55,0.6)] focus:outline-none focus:ring-2 focus:ring-[#e31837] focus:ring-offset-2 focus:ring-offset-[#0a0a0a] active:scale-95 group ${
                    disabled && "opacity-50 cursor-not-allowed"
                } ` + className
            }
            disabled={disabled}
        >
            <span className="relative z-10 flex items-center">{children}</span>
        </button>
    );
}
