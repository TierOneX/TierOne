
import React from 'react';
import PanelLayout from '@/Components/PanelAdminEcommerce/PanelLayout';
import FilterBar from '@/Components/PanelAdminEcommerce/FilterBar';
import AdminTable from '@/Components/PanelAdminEcommerce/AdminTable';
import { Head, Link, router } from '@inertiajs/react';

const tipoBadge = (tipo) => {
    const map = {
        deposito: 'bg-green-50 text-green-700 border-green-200',
        retiro: 'bg-red-50 text-red-700 border-red-200',
        premio: 'bg-yellow-50 text-yellow-700 border-yellow-200',
        compra: 'bg-blue-50 text-blue-700 border-blue-200',
        reembolso: 'bg-gray-50 text-gray-700 border-gray-200',
        comision: 'bg-purple-50 text-purple-700 border-purple-200',
    };
    return map[tipo] ?? 'bg-gray-100 text-gray-800 border-gray-200';
};

export default function Transacciones({ transacciones, filters = {} }) {
    const { data = [], links = [] } = transacciones ?? {};

    const filtersConfig = [
        {
            name: 'tipo',
            label: 'Tipo',
            type: 'select',
            options: [
                { value: '', label: 'Todos' },
                { value: 'deposito', label: 'Depósito' },
                { value: 'retiro', label: 'Retiro' },
                { value: 'premio', label: 'Premio' },
                { value: 'compra', label: 'Compra' },
                { value: 'reembolso', label: 'Reembolso' },
                { value: 'comision', label: 'Comisión' },
            ]
        },
        { name: 'fecha_desde', label: 'Desde', type: 'date' },
        { name: 'fecha_hasta', label: 'Hasta', type: 'date' },
    ];

    const columns = [
        { label: 'Usuario', key: 'usuario', sortable: false },
        { label: 'Tipo', key: 'tipo', sortable: false },
        { label: 'Descripción', key: 'descripcion', sortable: false },
        { label: 'Fecha', key: 'fecha', sortable: true },
        { label: 'Monto', key: 'monto', sortable: true },
        { label: 'Balance Nuevo', key: 'balance_nuevo', sortable: false },
    ];

    const handleSort = (key) => {
        let newDir = 'asc';
        if (filters.sort_by === key) {
            newDir = filters.sort_dir === 'asc' ? 'desc' : 'asc';
        }
        router.get(route('panel.ecommerce.finanzas.transacciones'), { ...filters, sort_by: key, sort_dir: newDir }, {
            preserveState: true,
            replace: true
        });
    };

    const renderRow = (t) => (
        <tr key={t.id} className="hover:bg-gray-50 transition-colors">
            <td className="px-6 py-4 text-sm font-medium text-gray-900">{t.usuario}</td>
            <td className="px-6 py-4">
                <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium border ${tipoBadge(t.tipo)}`}>
                    {t.tipo}
                </span>
            </td>
            <td className="px-6 py-4 text-sm text-gray-500">{t.descripcion}</td>
            <td className="px-6 py-4 text-sm text-gray-500">{t.fecha}</td>
            <td className={`px-6 py-4 text-right font-bold ${t.monto < 0 ? 'text-red-600' : 'text-green-600'}`}>
                {t.monto > 0 && '+'}{Number(t.monto).toFixed(2)}€
            </td>
            <td className="px-6 py-4 text-right font-mono text-sm text-gray-900">
                {Number(t.balance_nuevo).toFixed(2)}€
            </td>
        </tr>
    );

    return (
        <PanelLayout title="Historial de Transacciones" activeItem="Transacciones">
            <Head title="Transacciones - Admin Panel" />

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-gray-800">Libro de Movimientos</h2>
            </div>

            <FilterBar
                filtersConfig={filtersConfig}
                currentFilters={filters}
                routeName="panel.ecommerce.finanzas.transacciones"
            />

            <AdminTable
                columns={columns}
                data={data}
                filters={filters}
                onSort={handleSort}
                renderRow={renderRow}
            />

            {links.length > 3 && (
                <div className="flex justify-center gap-1 mt-6">
                    {links.map((link, i) => (
                        <Link
                            key={i}
                            href={link.url ?? '#'}
                            className={`px-3 py-1 rounded text-sm border ${link.active
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                } ${!link.url ? 'opacity-40 pointer-events-none' : ''}`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            )}
        </PanelLayout>
    );
}
