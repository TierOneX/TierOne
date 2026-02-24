export default function Checkbox({ className = "", ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                "rounded border-white/20 bg-[#0a0a0a] text-[#e31837] shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)] focus:ring-[#e31837] focus:ring-offset-[#0a0a0a] transition-all duration-300 " +
                className
            }
        />
    );
}
