import { router } from '@inertiajs/react';
import { useState, useEffect } from 'react';

/**
 * Componente modular para filtrado dinámico en el Panel Administrativo.
 * 
 * @param {Array} filtersConfig - Configuración de los filtros: [{ name, label, type, options }]
 * @param {Object} currentFilters - Filtros actuales (provenientes de props del controlador)
 * @param {string} routeName - Nombre de la ruta para aplicar los filtros
 */
export default function FilterBar({ filtersConfig, currentFilters = {}, routeName }) {
    const [values, setValues] = useState(currentFilters);
    const [isExpanded, setIsExpanded] = useState(false);

    // Sincronizar estado local con los filtros actuales cuando cambian (ej. al limpiar)
    useEffect(() => {
        setValues(currentFilters);
    }, [currentFilters]);

    const handleChange = (name, value) => {
        setValues(prev => ({ ...prev, [name]: value }));
    };

    const handleApply = (e) => {
        e.preventDefault();
        router.get(route(routeName), values, {
            preserveState: true,
            replace: true
        });
    };

    const handleReset = () => {
        const resetValues = {};
        filtersConfig.forEach(f => resetValues[f.name] = '');
        setValues(resetValues);
        router.get(route(routeName), {}, {
            preserveState: true,
            replace: true
        });
    };

    const hasFilters = filtersConfig && filtersConfig.length > 0;

    if (!hasFilters) return null;

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-6 overflow-hidden">
            <div
                className="px-6 py-3 border-b border-gray-100 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-2">
                    <span className="text-lg">🔍</span>
                    <h3 className="font-bold text-black text-sm uppercase tracking-wider">Filtros de Búsqueda</h3>
                </div>
                <div className="text-black text-sm">
                    {isExpanded ? '🔼 Ocultar' : '🔽 Mostrar'}
                </div>
            </div>

            {isExpanded && (
                <form onSubmit={handleApply} className="p-6">
                    {/* Búsqueda Global */}
                    <div className="mb-6">
                        <label className="text-xs font-bold text-black mb-1 ml-1 uppercase tracking-wider flex items-center gap-2">
                            <span>🔍</span> Búsqueda Global
                        </label>
                        <input
                            type="text"
                            placeholder="Buscar en todas las columnas..."
                            value={values.search || ''}
                            onChange={(e) => handleChange('search', e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-black focus:outline-none focus:border-blue-500 shadow-sm"
                        />
                        <p className="text-[10px] text-gray-400 mt-1 ml-1 italic">
                            * Escribe cualquier dato (ID, nombre, email...) para buscar de forma general.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {filtersConfig.map((filter) => (
                            <div key={filter.name} className="flex flex-col">
                                <label className="text-xs font-semibold text-black mb-1 ml-1 uppercase">
                                    {filter.label}
                                </label>

                                {filter.type === 'select' ? (
                                    <select
                                        value={values[filter.name] || ''}
                                        onChange={(e) => handleChange(filter.name, e.target.value)}
                                        className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:border-blue-500"
                                    >
                                        <option value="">Todos</option>
                                        {filter.options?.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                ) : filter.type === 'date' ? (
                                    <input
                                        type="date"
                                        value={values[filter.name] || ''}
                                        onChange={(e) => handleChange(filter.name, e.target.value)}
                                        className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:border-blue-500"
                                    />
                                ) : (
                                    <input
                                        type={filter.type || 'text'}
                                        placeholder={`Buscar por ${filter.label.toLowerCase()}...`}
                                        value={values[filter.name] || ''}
                                        onChange={(e) => handleChange(filter.name, e.target.value)}
                                        className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:border-blue-500"
                                    />
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-50">
                        <button
                            type="button"
                            onClick={handleReset}
                            className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            Limpiar
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-blue-700 shadow-sm transition-colors"
                        >
                            Aplicar Filtros
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}
