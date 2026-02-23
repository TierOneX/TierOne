
import React from 'react';
import PanelLayout from '@/Components/PanelAdminEcommerce/PanelLayout';
import FilterBar from '@/Components/PanelAdminEcommerce/FilterBar';
import AdminTable from '@/Components/PanelAdminEcommerce/AdminTable';
import { Head, Link, router } from '@inertiajs/react';

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
    );

    return (
        <PanelLayout title="Gestión de Órdenes" activeItem="Órdenes">
            <Head title="Órdenes - Admin Panel" />

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-gray-800">Listado de Órdenes</h2>
                <button
                    onClick={openCreateModal}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                    <span>+</span> Nuevo Pedido
                </button>
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
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Cliente / Usuario</label>
                        <select
                            className={`w-full p-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold ${errors.id_usuario ? 'border-red-500' : 'border-gray-200'}`}
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
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Estado Inicial</label>
                        <select
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                            value={formData.estado}
                            onChange={e => setData('estado', e.target.value)}
                        >
                            <option value="pendiente">Pendiente</option>
                            <option value="procesando">Procesando</option>
                            <option value="entregada">Entregada</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Total Orden (€)</label>
                        <input
                            type="number"
                            step="0.01"
                            className={`w-full p-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold ${errors.total ? 'border-red-500' : 'border-gray-200'}`}
                            value={formData.total}
                            onChange={e => setData('total', e.target.value)}
                            placeholder="0.00"
                        />
                        {errors.total && <p className="text-red-500 text-[10px] mt-1 font-bold uppercase">{errors.total}</p>}
                    </div>

                    <div className="mt-6 flex justify-end gap-3 border-t pt-4">
                        <button
                            type="button"
                            onClick={() => setIsCreateModalOpen(false)}
                            className="px-4 py-2 text-xs font-black text-gray-500 uppercase hover:bg-gray-100 rounded-lg"
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
