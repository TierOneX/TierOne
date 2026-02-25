import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

export default forwardRef(function TextInput(
    { type = "text", className = "", isFocused = false, ...props },
    ref,
) {
    const localRef = useRef(null);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    return (
        <input
            {...props}
            type={type}
            className={
                "rounded-lg border-white/5 bg-[#0a0a0a] text-xs font-bold uppercase tracking-widest text-[#e31837] shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] focus:border-[#e31837] focus:ring-1 focus:ring-[#e31837] focus:bg-[#121212]/50 placeholder:text-gray-400 placeholder:normal-case placeholder:font-normal transition-all duration-300 " +
                className
            }
            ref={localRef}
        />
    );
});
