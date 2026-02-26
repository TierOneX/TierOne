
import React, { useEffect } from 'react';

/**
 * AdminModal
 * Componente modular para diálogos de creación y edición.
 * 
 * Props:
 * - show: Booleano para mostrar/ocultar
 * - onClose: Callback al cerrar
 * - title: Título del modal
 * - children: Contenido del modal (formulario, etc.)
 * - maxWidth: Clase de ancho máximo (tailwind)
 */
export default function AdminModal({
    show = false,
    onClose,
    title = "",
    children,
    maxWidth = "max-w-md"
}) {
    // Cerrar con escape
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        if (show) window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [show, onClose]);

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Container */}
            <div className={`relative bg-white w-full ${maxWidth} rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200`}>
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                    >
                        ✕
                    </button>
                </div>

                {/* Content */}
                <div className="px-6 py-6">
                    {children}
                </div>
            </div>
        </div>
    );
}
