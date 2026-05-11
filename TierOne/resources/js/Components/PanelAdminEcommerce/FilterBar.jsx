import { router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Search, ChevronUp, ChevronDown, SlidersHorizontal, XCircle, CheckCircle2 } from 'lucide-react';

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
        <div className="bg-[#141414] rounded-xl border border-white/5 shadow-2xl mb-6 overflow-hidden">
            <div
                className="px-6 py-3 border-b border-white/5 flex justify-between items-center cursor-pointer hover:bg-white/5 transition-colors"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-600/10 rounded-lg text-red-500 border border-red-500/20">
                        <SlidersHorizontal size={16} />
                    </div>
                    <h3 className="font-black text-white text-sm uppercase tracking-[0.2em] italic font-['Outfit']">Filtros de Búsqueda</h3>
                </div>
                <div className="text-gray-500 hover:text-white transition-colors">
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
            </div>

            {isExpanded && (
                <form onSubmit={handleApply} className="p-6">
                    {/* Búsqueda Global */}
                    <div className="mb-6 group">
                        <label className="text-[10px] font-black text-gray-500 mb-2 ml-1 uppercase tracking-widest flex items-center gap-2 group-focus-within:text-red-500 transition-colors">
                            <Search size={12} /> Búsqueda Global
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Escribe para buscar en ID, nombres, correos..."
                                value={values.search || ''}
                                onChange={(e) => handleChange('search', e.target.value)}
                                className="w-full bg-[#0F0F0F] border border-white/5 rounded-xl px-4 py-4 text-sm text-white focus:outline-none focus:border-red-500/50 focus:bg-[#151515] shadow-inner transition-all placeholder:text-gray-700"
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-700">
                                <Search size={18} />
                            </div>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-1 ml-1 italic">
                            * Escribe cualquier dato (ID, nombre, email...) para buscar de forma general.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {filtersConfig.map((filter) => (
                            <div key={filter.name} className="flex flex-col group">
                                <label className="text-[10px] font-black text-gray-500 mb-2 ml-1 uppercase tracking-widest group-focus-within:text-red-500 transition-colors">
                                    {filter.label}
                                </label>

                                {filter.type === 'select' ? (
                                    <div className="relative">
                                        <select
                                            value={values[filter.name] || ''}
                                            onChange={(e) => handleChange(filter.name, e.target.value)}
                                            className="w-full appearance-none bg-[#0F0F0F] border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500/50 transition-all cursor-pointer"
                                        >
                                            <option value="">Todos</option>
                                            {filter.options?.map(opt => (
                                                <option key={opt.value} value={opt.value} className="bg-[#141414]">{opt.label}</option>
                                            ))}
                                        </select>
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-600">
                                            <ChevronDown size={14} />
                                        </div>
                                    </div>
                                ) : filter.type === 'date' ? (
                                    <input
                                        type="date"
                                        value={values[filter.name] || ''}
                                        onChange={(e) => handleChange(filter.name, e.target.value)}
                                        className="bg-[#0F0F0F] border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500/50 transition-all [color-scheme:dark]"
                                    />
                                ) : (
                                    <input
                                        type={filter.type || 'text'}
                                        placeholder={`Escribe ${filter.label.toLowerCase()}...`}
                                        value={values[filter.name] || ''}
                                        onChange={(e) => handleChange(filter.name, e.target.value)}
                                        className="bg-[#0F0F0F] border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500/50 transition-all placeholder:text-gray-800"
                                    />
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-white/5">
                        <button
                            type="button"
                            onClick={handleReset}
                            className="px-6 py-3 text-xs font-black text-gray-500 hover:text-white uppercase tracking-widest rounded-xl hover:bg-white/5 transition-all flex items-center gap-2"
                        >
                            <XCircle size={14} /> Limpiar Filtros
                        </button>
                        <button
                            type="submit"
                            className="bg-red-600 text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-[0.2em] hover:bg-red-500 shadow-[0_0_20px_rgba(220,38,38,0.2)] hover:shadow-[0_0_25px_rgba(220,38,38,0.4)] transition-all flex items-center gap-2 italic font-['Outfit']"
                        >
                            <CheckCircle2 size={14} /> Aplicar Selección
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}
