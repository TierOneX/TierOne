import { useState, useRef, useEffect } from 'react';

export default function CategoryFilter({ categories, activeCategory, onCategoryChange }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Cerrar al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div ref={dropdownRef}>
            {/* Botón del desplegable */}
            <button
                id="category-dropdown-toggle"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border text-sm font-semibold transition-all ${isOpen
                        ? 'border-red-600 bg-white/10 text-white rounded-b-none'
                        : 'border-gray-700 bg-white/5 text-gray-300 hover:border-gray-500'
                    }`}
            >
                <span>{activeCategory === 'TODOS' ? 'Todas las categorías' : activeCategory}</span>
                <svg
                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Lista desplegable (inline, no absolute) */}
            <div
                className={`overflow-hidden transition-all duration-200 ease-in-out border-x border-gray-700 ${isOpen ? 'max-h-60 border-b rounded-b-lg' : 'max-h-0 border-b-0'
                    }`}
            >
                <div className="bg-[#1a1a1e] max-h-60 overflow-y-auto custom-scrollbar">
                    {categories.map((category) => (
                        <button
                            key={category}
                            id={`category-option-${category.toLowerCase().replace(/\s+/g, '-')}`}
                            onClick={() => {
                                onCategoryChange(category);
                                setIsOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2.5 text-sm font-semibold transition-colors ${activeCategory === category
                                    ? 'bg-red-600/20 text-red-500'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            {category === 'TODOS' ? 'Todas las categorías' : category}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
