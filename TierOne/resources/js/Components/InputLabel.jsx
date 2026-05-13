export default function InputLabel({
    value,
    className = "",
    children,
    ...props
}) {
    return (
        <label
            {...props}
            className={
                `block text-sm font-bold uppercase tracking-wider text-gray-400 mb-1 ` +
                className
            }
        >
            {value ? value : children}
        </label>
    );
}
