
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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('view'); // 'create', 'view', 'edit'
    const [selectedOrder, setSelectedOrder] = useState(null);

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

    const { data: formData, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        id_usuario: '',
        estado: 'pendiente',
        total: '',
        tracking_number: '',
        transportista: '',
    });

    const openCreateModal = () => {
        setModalMode('create');
        setSelectedOrder(null);
        reset();
        clearErrors();
        setIsModalOpen(true);
    };

    const openViewModal = (orden) => {
        setModalMode('view');
        setSelectedOrder(orden);
        setData({
            id_usuario: orden.id_usuario || '',
            estado: orden.estado || 'pendiente',
            total: orden.total || '',
            tracking_number: orden.tracking || '',
            transportista: orden.transportista || '',
        });
        setIsModalOpen(true);
    };

    const openEditModal = (orden) => {
        setModalMode('edit');
        setSelectedOrder(orden);
        setData({
            id_usuario: orden.id_usuario || '',
            estado: orden.estado || 'pendiente',
            total: orden.total || '',
            tracking_number: orden.tracking || '',
            transportista: orden.transportista || '',
        });
        clearErrors();
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (modalMode === 'create') {
            post(route('panel.ecommerce.orders.store'), {
                onSuccess: () => setIsModalOpen(false)
            });
        } else if (modalMode === 'edit') {
            put(route('panel.ecommerce.orders.update', selectedOrder.id), {
                onSuccess: () => setIsModalOpen(false)
            });
        }
    };

    const handleDelete = (id) => {
        if (confirm('¿Estás seguro de eliminar este pedido? Esta acción no se puede deshacer.')) {
            router.delete(route('panel.ecommerce.orders.destroy', id));
        }
    };

    const renderRow = (orden) => (
        <React.Fragment key={orden.id}>
            <tr className="hover:bg-gray-50 transition-colors group cursor-pointer" onClick={() => openViewModal(orden)}>
                <td className="px-6 py-4 font-bold text-gray-900">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={(e) => { e.stopPropagation(); setExpandedOrder(expandedOrder === orden.id ? null : orden.id); }}
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
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${estadoBadge(orden.estado)}`}>
                        {orden.estado}
                    </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-400 font-mono">
                    {orden.tracking ?? '—'}
                </td>
                <td className="px-6 py-4 text-right font-black text-black">
                    €{Number(orden.total).toFixed(2)}
                </td>
                <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={() => openViewModal(orden)}
                            className="p-2 bg-white text-gray-400 hover:text-blue-600 rounded-lg border border-gray-200 hover:border-blue-200 shadow-sm"
                            title="Ver detalles"
                        >
                            👁️
                        </button>
                        <button
                            onClick={() => openEditModal(orden)}
                            className="p-2 bg-white text-gray-400 hover:text-amber-600 rounded-lg border border-gray-200 hover:border-amber-200 shadow-sm"
                            title="Editar"
                        >
                            ✏️
                        </button>
                        <button
                            onClick={() => handleDelete(orden.id)}
                            className="p-2 bg-white text-gray-400 hover:text-red-600 rounded-lg border border-gray-200 hover:border-red-200 shadow-sm"
                            title="Eliminar"
                        >
                            🗑️
                        </button>
                    </div>
                </td>
            </tr>
            {expandedOrder === orden.id && (
                <tr className="bg-gray-50/50">
                    <td colSpan={7} className="px-12 py-6">
                        <div className="border-l-2 border-blue-500/30 pl-6 py-2">
                            <h4 className="text-[10px] font-black text-gray-400 uppercase mb-4 tracking-[0.2em]">Artículos del Pedido</h4>
                            <div className="space-y-3">
                                {orden.items?.length > 0 ? (
                                    orden.items.map((item) => (
                                        <div key={item.id} className="flex justify-between items-center text-sm bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                                            <div className="flex gap-4 items-center">
                                                <span className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center font-black text-blue-600 text-[10px]">x{item.cantidad}</span>
                                                <span className="text-gray-900 font-bold">{item.producto}</span>
                                            </div>
                                            <div className="flex gap-8 items-center">
                                                <span className="text-gray-400 text-[10px] font-black uppercase">€{Number(item.precio).toFixed(2)}/u</span>
                                                <span className="font-black text-gray-900">€{Number(item.subtotal).toFixed(2)}</span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-xs text-gray-400 italic font-medium">No hay detalles disponibles para este pedido.</p>
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
                <h2 className="text-lg font-bold text-white tracking-tight uppercase">Listado de Órdenes</h2>
                <div className="flex gap-2">
                    <button className="bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-lg font-bold text-xs uppercase hover:bg-gray-50 transition-colors tracking-widest shadow-sm">
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

            {/* Modal de CRUD para Órdenes */}
            <AdminModal
                show={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={modalMode === 'create' ? 'Nueva Orden Manual' : (modalMode === 'edit' ? 'Gestionar Pedido' : 'Detalles de la Orden')}
                maxWidth="max-w-2xl"
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-5">
                        <div className={modalMode === 'create' ? 'col-span-2' : ''}>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Cliente / Usuario</label>
                            {modalMode === 'create' ? (
                                <select
                                    className={`w-full p-4 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-black transition-all ${errors.id_usuario ? 'border-red-500' : 'border-gray-200'}`}
                                    value={formData.id_usuario}
                                    onChange={e => setData('id_usuario', e.target.value)}
                                >
                                    <option value="">Seleccionar Usuario</option>
                                    {usuarios.map(u => (
                                        <option key={u.id} value={u.id}>{u.nombre} ({u.email})</option>
                                    ))}
                                </select>
                            ) : (
                                <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl">
                                    <p className="font-bold text-gray-900 text-sm">{selectedOrder?.cliente}</p>
                                    <p className="text-xs text-gray-400 mt-1">{selectedOrder?.email}</p>
                                </div>
                            )}
                            {errors.id_usuario && <p className="text-red-500 text-[10px] mt-2 font-black uppercase tracking-widest">{errors.id_usuario}</p>}
                        </div>

                        {modalMode !== 'create' && (
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Número de Seguimiento</label>
                                <input
                                    type="text"
                                    readOnly={modalMode === 'view'}
                                    className={`w-full p-4 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-black transition-all border-gray-200 ${modalMode === 'view' ? 'opacity-70 cursor-not-allowed' : ''}`}
                                    value={formData.tracking_number}
                                    onChange={e => setData('tracking_number', e.target.value)}
                                    placeholder="Ej: TRACK123456"
                                />
                            </div>
                        )}

                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Estado del Pedido</label>
                            <select
                                disabled={modalMode === 'view'}
                                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-black disabled:opacity-70 disabled:cursor-not-allowed"
                                value={formData.estado}
                                onChange={e => setData('estado', e.target.value)}
                            >
                                <option value="pendiente">Pendiente</option>
                                <option value="procesando">Procesando</option>
                                <option value="enviada">Enviada</option>
                                <option value="entregada">Entregada</option>
                                <option value="cancelada">Cancelada</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Total de la Orden (€)</label>
                            <input
                                type="number"
                                step="0.01"
                                readOnly={modalMode === 'view'}
                                className={`w-full p-4 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-black text-lg transition-all ${errors.total ? 'border-red-500' : 'border-gray-200'} ${modalMode === 'view' ? 'opacity-70 cursor-not-allowed' : ''}`}
                                value={formData.total}
                                onChange={e => setData('total', e.target.value)}
                                placeholder="0.00"
                            />
                            {errors.total && <p className="text-red-500 text-[10px] mt-2 font-black uppercase tracking-widest">{errors.total}</p>}
                        </div>

                        {modalMode === 'view' && selectedOrder?.items?.length > 0 && (
                            <div className="col-span-2 mt-4">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Artículos Incluidos</label>
                                <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                                    {selectedOrder.items.map((item, idx) => (
                                        <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                                            <span className="text-sm font-bold text-gray-700">{item.producto} <span className="text-gray-400 font-black text-[10px] ml-1">x{item.cantidad}</span></span>
                                            <span className="font-black text-black">€{Number(item.subtotal).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mt-8 flex justify-end gap-3 border-t border-gray-100 pt-6">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="px-5 py-2.5 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:bg-gray-50 rounded-xl transition-all"
                        >
                            {modalMode === 'view' ? 'Cerrar' : 'Cancelar'}
                        </button>
                        {modalMode !== 'view' && (
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-8 py-2.5 bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.15em] rounded-xl hover:bg-blue-700 shadow-md shadow-blue-200 disabled:opacity-50 transition-all"
                            >
                                {processing ? 'Procesando...' : (modalMode === 'create' ? 'Crear Orden' : 'Guardar Cambios')}
                            </button>
                        )}
                    </div>
                </form>
            </AdminModal>

            {/* Pagination */}
            {links.length > 3 && (
                <div className="flex justify-center gap-1 mt-8">
                    {links.map((link, i) => (
                        <Link
                            key={i}
                            href={link.url ?? '#'}
                            className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-tighter transition-all border ${link.active
                                ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                                : 'bg-white text-gray-400 border-gray-200 hover:bg-gray-50 hover:text-black'
                                } ${!link.url ? 'opacity-30 pointer-events-none' : ''}`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            )}
        </PanelLayout>
    );
}
