
import React, { useState } from 'react';
import PanelLayout from '@/Components/PanelAdminEcommerce/PanelLayout';
import FilterBar from '@/Components/PanelAdminEcommerce/FilterBar';
import AdminTable from '@/Components/PanelAdminEcommerce/AdminTable';
import { Head, Link, router, useForm } from '@inertiajs/react';
import AdminModal from '@/Components/PanelAdminEcommerce/AdminModal';

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

export default function Orders({ ordenes, usuarios = [], filters = {} }) {
    const { data = [], links = [] } = ordenes ?? {};
    const [expandedOrder, setExpandedOrder] = useState(null);

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

    const columns = [
        { label: 'Orden', key: 'numero', sortable: false },
        { label: 'Fecha', key: 'fecha', sortable: true },
        { label: 'Cliente', key: 'cliente', sortable: false },
        { label: 'Estado', key: 'estado', sortable: false, align: 'center' },
        { label: 'Tracking', key: 'tracking', sortable: false },
        { label: 'Total', key: 'total', sortable: true, align: 'right' },
        { label: 'Acciones', key: 'acciones', sortable: false, align: 'right' },
    ];

    const handleSort = (key) => {
        let newDir = 'asc';
        if (filters.sort_by === key) {
            newDir = filters.sort_dir === 'asc' ? 'desc' : 'asc';
        }
        router.get(route('panel.ecommerce.orders'), { ...filters, sort_by: key, sort_dir: newDir }, {
            preserveState: true,
            replace: true
        });
    };

    const { data: formData, setData, post, processing, errors, reset, clearErrors } = useForm({
        id_usuario: '',
        estado: 'pendiente',
        total: '',
    });

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const openCreateModal = () => {
        reset();
        clearErrors();
        setIsCreateModalOpen(true);
    };

    const handleCreateSubmit = (e) => {
        e.preventDefault();
        post(route('panel.ecommerce.orders.store'), {
            onSuccess: () => {
                setIsCreateModalOpen(false);
                reset();
            }
        });
    };

    const renderRow = (orden) => (
        <React.Fragment key={orden.id}>
            <tr className="hover:bg-gray-50 transition-colors group">
                <td className="px-6 py-4 font-bold text-gray-900">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setExpandedOrder(expandedOrder === orden.id ? null : orden.id)}
                            className="text-gray-400 hover:text-blue-600 transition-colors"
                        >
                            {expandedOrder === orden.id ? '▼' : '▶'}
                        </button>
                        #{orden.numero}
                    </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{orden.fecha}</td>
                <td className="px-6 py-4">
                    <div className="flex flex-col">
                        <span className="font-medium text-gray-900">{orden.cliente}</span>
                        <span className="text-xs text-gray-400">{orden.email}</span>
                    </div>
                </td>
                <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${estadoBadge(orden.estado)}`}>
                        {orden.estado}
                    </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-400 font-mono">
                    {orden.tracking ?? '—'}
                </td>
                <td className="px-6 py-4 text-right font-black text-black">
                    €{Number(orden.total).toFixed(2)}
                </td>
                <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1 text-gray-400 hover:text-blue-600" title="Ver detalles">👁️</button>
                        <button className="p-1 text-gray-400 hover:text-amber-600" title="Editar">✏️</button>
                        <button className="p-1 text-gray-400 hover:text-red-600" title="Eliminar">🗑️</button>
                    </div>
                </td>
            </tr>
            {expandedOrder === orden.id && (
                <tr className="bg-gray-50">
                    <td colSpan={7} className="px-12 py-4">
                        <div className="border-l-4 border-blue-500/30 pl-4">
                            <h4 className="text-[10px] font-black text-gray-400 uppercase mb-3 tracking-widest">Artículos del Pedido</h4>
                            <div className="space-y-2">
                                {orden.items?.length > 0 ? (
                                    orden.items.map((item) => (
                                        <div key={item.id} className="flex justify-between items-center text-sm border-b border-gray-100 pb-2">
                                            <div className="flex gap-4">
                                                <span className="font-bold text-gray-400">x{item.cantidad}</span>
                                                <span className="text-gray-700 font-medium">{item.producto}</span>
                                            </div>
                                            <div className="flex gap-8">
                                                <span className="text-gray-400 text-xs">€{Number(item.precio).toFixed(2)}/u</span>
                                                <span className="font-bold text-gray-900">€{Number(item.subtotal).toFixed(2)}</span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-xs text-gray-400 italic text-center py-2">No hay detalles disponibles para este pedido.</p>
                                )}
                            </div>
                        </div>
                    </td>
                </tr>
            )}
        </React.Fragment>
    );

    return (
        <PanelLayout title="Gestión de Órdenes" activeItem="orders">
            <Head title="Órdenes - Admin Panel" />

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-white">Listado de Órdenes</h2>
                <div className="flex gap-2">
                    <button className="bg-white border border-gray-200 text-gray-500 px-4 py-2 rounded-lg font-bold text-xs uppercase hover:bg-gray-50 transition-colors tracking-widest">
                        📄 Reporte
                    </button>
                    <button
                        onClick={openCreateModal}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-xs uppercase hover:bg-blue-700 transition-colors shadow-md shadow-blue-200 tracking-widest"
                    >
                        + Crear Pedido
                    </button>
                </div>
            </div>

            <FilterBar
                filtersConfig={filtersConfig}
                currentFilters={filters}
                routeName="panel.ecommerce.orders"
            />

            <AdminTable
                columns={columns}
                data={data}
                filters={filters}
                onSort={handleSort}
                renderRow={renderRow}
                emptyMessage="No se encontraron órdenes con estos filtros."
            />

            {/* Modal de Creación Manual */}
            <AdminModal
                show={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                title="Nueva Orden Manual"
                maxWidth="max-w-md"
            >
                <form onSubmit={handleCreateSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Cliente / Usuario</label>
                        <select
                            className={`w-full p-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-black ${errors.id_usuario ? 'border-red-500' : 'border-gray-200'}`}
                            value={formData.id_usuario}
                            onChange={e => setData('id_usuario', e.target.value)}
                        >
                            <option value="">Seleccionar Usuario</option>
                            {usuarios.map(u => (
                                <option key={u.id} value={u.id}>{u.nombre} ({u.email})</option>
                            ))}
                        </select>
                        {errors.id_usuario && <p className="text-red-500 text-[10px] mt-1 font-bold uppercase">{errors.id_usuario}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Estado Inicial</label>
                        <select
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-black"
                            value={formData.estado}
                            onChange={e => setData('estado', e.target.value)}
                        >
                            <option value="pendiente">Pendiente</option>
                            <option value="procesando">Procesando</option>
                            <option value="entregada">Entregada</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Total Orden (€)</label>
                        <input
                            type="number"
                            step="0.01"
                            className={`w-full p-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-black ${errors.total ? 'border-red-500' : 'border-gray-200'}`}
                            value={formData.total}
                            onChange={e => setData('total', e.target.value)}
                            placeholder="0.00"
                        />
                        {errors.total && <p className="text-red-500 text-[10px] mt-1 font-bold uppercase">{errors.total}</p>}
                    </div>

                    <div className="mt-6 flex justify-end gap-3 border-t border-gray-100 pt-4">
                        <button
                            type="button"
                            onClick={() => setIsCreateModalOpen(false)}
                            className="px-4 py-2 text-xs font-black text-gray-400 uppercase hover:bg-gray-50 rounded-lg"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-2 bg-blue-600 text-white text-xs font-black uppercase rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                            {processing ? 'Creando...' : 'Crear Orden'}
                        </button>
                    </div>
                </form>
            </AdminModal>

            {/* Pagination */}
            {links.length > 3 && (
                <div className="flex justify-center gap-1 mt-6">
                    {links.map((link, i) => (
                        <Link
                            key={i}
                            href={link.url ?? '#'}
                            className={`px-3 py-1 rounded text-sm border ${link.active
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-white text-gray-400 border-gray-200 hover:bg-gray-50'
                                } ${!link.url ? 'opacity-40 pointer-events-none' : ''}`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            )}
        </PanelLayout>
    );
}
