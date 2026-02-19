import PanelLayout from '@/Components/PanelAdminEcommerce/PanelLayout';
import FilterBar from '@/Components/PanelAdminEcommerce/FilterBar';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

const menuItems = [
    {
        title: 'Catálogo', items: [
            { label: 'Productos', icon: '📦', link: route('panel.ecommerce.products') },
            { label: 'Categorías', icon: '🏷️', link: route('panel.ecommerce.categories') },
        ]
    },
    {
        title: 'Ventas', items: [
            { label: 'Órdenes', icon: '📋', link: route('panel.ecommerce.orders') },
        ]
    },
    {
        title: 'Sistema', items: [
            { label: 'Reportes', icon: '⚠️', link: route('panel.ecommerce.reports') },
            { label: 'Configuración', icon: '⚙️', link: '#' },
        ]
    },
];

const user = { name: 'Admin', role: 'Ecommerce Admin', avatar: 'A' };

const estadoBadge = (estado) => {
    const map = {
        pendiente: 'bg-orange-50 text-orange-700 border-orange-200',
        procesando: 'bg-blue-50 text-blue-700 border-blue-200',
        enviada: 'bg-purple-50 text-purple-700 border-purple-200',
        entregada: 'bg-green-50 text-green-700 border-green-200',
        cancelada: 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return map[estado] ?? 'bg-gray-100 text-gray-800 border-gray-200';
};

export default function Orders({ ordenes, filters = {} }) {
    const { data = [], links = [] } = ordenes ?? {};

    const toggleSort = () => {
        const newDir = filters.sort_dir === 'asc' ? 'desc' : 'asc';
        router.get(route('panel.ecommerce.orders'), { ...filters, sort_dir: newDir }, {
            preserveState: true,
            replace: true
        });
    };

    const filtersConfig = [
        { name: 'numero', label: 'Número de Orden', type: 'text' },
        { name: 'cliente', label: 'Cliente', type: 'text' },
        {
            name: 'estado',
            label: 'Estado',
            type: 'select',
            options: [
                { value: 'pendiente', label: 'Pendiente' },
                { value: 'procesando', label: 'Procesando' },
                { value: 'enviada', label: 'Enviada' },
                { value: 'entregada', label: 'Entregada' },
                { value: 'cancelada', label: 'Cancelada' },
            ]
        },
        { name: 'fecha_desde', label: 'Desde Fecha', type: 'date' },
        { name: 'fecha_hasta', label: 'Hasta Fecha', type: 'date' },
        { name: 'total_min', label: 'Monto Mínimo', type: 'number' },
    ];

    return (
        <PanelLayout title="Gestión de Órdenes" menuItems={menuItems} activeItem="Órdenes" user={user}>
            <Head title="Órdenes - Admin Panel" />

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-gray-800">Listado de Órdenes</h2>
            </div>

            {/* BARRA DE FILTROS */}
            <FilterBar
                filtersConfig={filtersConfig}
                currentFilters={filters}
                routeName="panel.ecommerce.orders"
            />

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold">
                            <th className="px-6 py-4">Orden</th>
                            <th className="px-6 py-4 cursor-pointer hover:bg-gray-100 transition-colors group" onClick={toggleSort}>
                                <div className="flex items-center gap-1">
                                    Fecha
                                    <span className="text-gray-400 group-hover:text-blue-600">
                                        {filters.sort_dir === 'asc' ? '🔼' : '🔽'}
                                    </span>
                                </div>
                            </th>
                            <th className="px-6 py-4">Cliente</th>
                            <th className="px-6 py-4">Estado</th>
                            <th className="px-6 py-4">Tracking</th>
                            <th className="px-6 py-4 text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {data.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center py-12 text-gray-400">
                                    No se encontraron órdenes con estos filtros
                                </td>
                            </tr>
                        ) : data.map((orden) => (
                            <tr key={orden.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-bold text-gray-900">
                                    #{orden.numero}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">{orden.fecha}</td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="font-medium text-gray-900">{orden.cliente}</span>
                                        <span className="text-xs text-gray-500">{orden.email}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${estadoBadge(orden.estado)}`}>
                                        {orden.estado}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500 font-mono">
                                    {orden.tracking ?? '—'}
                                </td>
                                <td className="px-6 py-4 text-right font-medium text-gray-900">
                                    €{Number(orden.total).toFixed(2)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
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
