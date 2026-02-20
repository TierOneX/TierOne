
import React from 'react';
import { Link } from '@inertiajs/react';

/**
 * AdminTable
 * Componente modular para renderizar tablas en el panel de administración.
 * 
 * Props:
 * - columns: Array de objetos { label, key, sortable }
 * - data: Array de objetos a renderizar
 * - filters: Objeto con filtros actuales (para extracción de sort_by y sort_dir)
 * - onSort: Función callback para manejar la ordenación
 * - renderRow: Función (item, index) => <tr /> para renderizar cada fila
 * - emptyMessage: Mensaje a mostrar si no hay datos
 */
export default function AdminTable({
    columns = [],
    data = [],
    filters = {},
    onSort,
    renderRow,
    emptyMessage = "No se encontraron resultados."
}) {
    const renderSortIcon = (key) => {
        if (!filters.sort_by || filters.sort_by !== key) return '↕️';
        return filters.sort_dir === 'asc' ? '🔼' : '🔽';
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100">
                            {columns.map((col, idx) => (
                                <th
                                    key={idx}
                                    className={`px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider ${col.sortable ? 'cursor-pointer hover:text-blue-600 transition-colors' : ''}`}
                                    onClick={() => col.sortable && onSort && onSort(col.key)}
                                >
                                    <div className="flex items-center gap-1.5">
                                        {col.label}
                                        {col.sortable && (
                                            <span className="inline-flex flex-col text-[10px] leading-[0.5] text-gray-300">
                                                <span className={filters.sort_by === col.key && filters.sort_dir === 'asc' ? 'text-blue-600' : ''}>▴</span>
                                                <span className={filters.sort_by === col.key && filters.sort_dir === 'desc' ? 'text-blue-600' : ''}>▾</span>
                                            </span>
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {data.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} className="px-6 py-12 text-center">
                                    <div className="flex flex-col items-center gap-2">
                                        <span className="text-3xl">🔍</span>
                                        <p className="text-gray-400 font-medium">{emptyMessage}</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            data.map((item, index) => renderRow(item, index))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
