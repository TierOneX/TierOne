import PanelLayout from '@/Components/PanelAdminEcommerce/PanelLayout';
import FilterBar from '@/Components/PanelAdminEcommerce/FilterBar';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';

const menuItems = [
    {
        title: 'Catálogo', items: [
            { label: 'Productos', icon: '📦', link: route('panel.ecommerce.products') },
            { label: 'Categorías', icon: '🏷️', link: route('panel.ecommerce.categories') },
            { label: 'Proveedores', icon: '🚚', link: route('panel.ecommerce.proveedores') },
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
        pendiente: 'bg-red-100 text-red-700',
        en_revision: 'bg-yellow-100 text-yellow-700',
        resuelta: 'bg-green-100 text-green-700',
        desestimada: 'bg-gray-100 text-gray-700',
    };
    return map[estado] ?? 'bg-gray-100 text-gray-700';
};

const tipoBadge = (tipo) => {
    const map = {
        trampa: 'bg-red-50 text-red-600',
        insulto: 'bg-orange-50 text-orange-600',
        bug: 'bg-blue-50 text-blue-600',
        otro: 'bg-gray-50 text-gray-600',
    };
    return map[tipo] ?? 'bg-gray-50 text-gray-600';
};

export default function Reports({ reportes = [], stats = {}, admins = [], filters = {} }) {
    const [selectedReport, setSelectedReport] = useState(null);
    const { data: formData, setData: setFormData, post, processing, reset } = useForm({
        estado: '',
        resolucion: '',
        id_resuelto_por: ''
    });

    const toggleSort = () => {
        const newDir = filters.sort_dir === 'asc' ? 'desc' : 'asc';
        router.get(route('panel.ecommerce.reports'), { ...filters, sort_dir: newDir }, {
            preserveState: true,
            replace: true
        });
    };

    const openDetails = (reporte) => {
        setSelectedReport(reporte);
        setFormData({
            estado: reporte.estado,
            resolucion: reporte.resolucion || '',
            id_resuelto_por: reporte.id_resuelto_por || ''
        });
    };

    const closeDetails = () => {
        setSelectedReport(null);
        reset();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('panel.ecommerce.reports.update', selectedReport.id), {
            onSuccess: () => closeDetails(),
        });
    };

    const filtersConfig = [
        { name: 'id_partida', label: 'ID Partida', type: 'number' },
        { name: 'id_usuario_reporta', label: 'ID Usuario Reporta', type: 'number' },
        { name: 'id_resuelto_por', label: 'Resuelto por (ID)', type: 'number' },
        {
            name: 'tipo',
            label: 'Tipo',
            type: 'select',
            options: [
                { value: 'trampa', label: 'Trampa' },
                { value: 'insulto', label: 'Insulto' },
                { value: 'bug', label: 'Bug' },
                { value: 'otro', label: 'Otro' },
            ]
        },
        {
            name: 'estado',
            label: 'Estado',
            type: 'select',
            options: [
                { value: 'pendiente', label: 'Pendiente' },
                { value: 'en_revision', label: 'En Revisión' },
                { value: 'resuelta', label: 'Resuelta' },
                { value: 'desestimada', label: 'Desestimada' },
            ]
        },
        { name: 'fecha_desde', label: 'Desde Fecha', type: 'date' },
        { name: 'fecha_hasta', label: 'Hasta Fecha', type: 'date' },
    ];

    return (
        <PanelLayout title="Reportes del Sistema" menuItems={menuItems} activeItem="Reportes" user={user}>
            <Head title="Reportes - Admin Panel" />

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <p className="text-3xl font-black text-gray-900">{stats.total_reportes ?? 0}</p>
                    <p className="text-sm text-gray-500 mt-1">Total Reportes</p>
                </div>
                <div className="bg-white rounded-xl border border-red-100 p-6 shadow-sm">
                    <p className="text-3xl font-black text-red-600">{stats.reportes_abiertos ?? 0}</p>
                    <p className="text-sm text-gray-500 mt-1">Reportes Abiertos</p>
                </div>
            </div>

            {/* BARRA DE FILTROS */}
            <FilterBar
                filtersConfig={filtersConfig}
                currentFilters={filters}
                routeName="panel.ecommerce.reports"
            />

            {/* Reports Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-bold text-gray-800">Reportes Recientes</h3>
                    <span className="text-sm text-gray-500">{reportes.length} reportes</span>
                </div>
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold">
                            <th className="px-6 py-4">ID</th>
                            <th className="px-6 py-4">Partida</th>
                            <th className="px-6 py-4">Tipo</th>
                            <th className="px-6 py-4">Reportado por</th>
                            <th className="px-6 py-4">Estado</th>
                            <th className="px-6 py-4">Resuelto por</th>
                            <th className="px-6 py-4 cursor-pointer hover:bg-gray-100 transition-colors group" onClick={toggleSort}>
                                <div className="flex items-center gap-1">
                                    Fecha
                                    <span className="text-gray-400 group-hover:text-blue-600">
                                        {filters.sort_dir === 'asc' ? '🔼' : '🔽'}
                                    </span>
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {reportes.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="text-center py-12 text-gray-400">
                                    No se encontraron reportes con estos filtros
                                </td>
                            </tr>
                        ) : reportes.map((reporte) => (
                            <tr
                                key={reporte.id}
                                className="hover:bg-gray-50 transition-colors cursor-pointer"
                                onClick={() => openDetails(reporte)}
                            >
                                <td className="px-6 py-4 font-mono text-sm text-gray-500">#{reporte.id}</td>
                                <td className="px-6 py-4 font-mono text-sm text-blue-600 font-bold">
                                    #{reporte.id_partida || '—'}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${tipoBadge(reporte.tipo)}`}>
                                        {reporte.tipo}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                                    {reporte.usuario_reporta}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${estadoBadge(reporte.estado)}`}>
                                        {reporte.estado}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {reporte.resuelto_por}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {reporte.fecha_reporte || '—'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal de detalles */}
            {selectedReport && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-black">Detalles del Reporte #{selectedReport.id}</h2>
                            <button onClick={closeDetails} className="text-gray-400 hover:text-black text-2xl">×</button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-semibold text-black uppercase tracking-wider mb-2">ID Partida</label>
                                    <p className="text-blue-600 font-bold font-mono">#{selectedReport.id_partida || '—'}</p>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-black uppercase tracking-wider mb-2">Usuario que reporta</label>
                                    <p className="text-black font-medium">{selectedReport.usuario_reporta}</p>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-black uppercase tracking-wider mb-2">Tipo de Reporte</label>
                                    <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${tipoBadge(selectedReport.tipo)}`}>
                                        {selectedReport.tipo}
                                    </span>
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs font-semibold text-black uppercase tracking-wider mb-2">Descripción</label>
                                    <p className="text-sm text-black bg-gray-50 p-3 rounded-lg border border-gray-100">
                                        {selectedReport.descripcion}
                                    </p>
                                </div>
                                {selectedReport.evidencia_url && (
                                    <div className="col-span-2">
                                        <label className="block text-xs font-semibold text-black uppercase tracking-wider mb-2">Evidencia</label>
                                        <a
                                            href={selectedReport.evidencia_url}
                                            target="_blank"
                                            className="text-blue-600 text-sm hover:underline flex items-center gap-1"
                                        >
                                            🔗 Ver archivo adjunto
                                        </a>
                                    </div>
                                )}
                            </div>

                            <hr className="border-gray-100" />

                            <div className="space-y-4">
                                <h3 className="font-bold text-black">Gestión del Reporte</h3>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-black mb-1">Estado</label>
                                        <select
                                            value={formData.estado}
                                            onChange={e => setFormData('estado', e.target.value)}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:border-blue-500"
                                        >
                                            <option value="pendiente">Pendiente</option>
                                            <option value="en_revision">En Revisión</option>
                                            <option value="resuelta">Resuelta</option>
                                            <option value="desestimada">Desestimada</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-black mb-1">Resuelto por</label>
                                        <select
                                            value={formData.id_resuelto_por}
                                            onChange={e => setFormData('id_resuelto_por', e.target.value)}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:border-blue-500"
                                        >
                                            <option value="">Pendiente</option>
                                            {admins.map(admin => (
                                                <option key={admin.id} value={admin.id}>{admin.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-black mb-1">Resolución</label>
                                        <textarea
                                            rows="3"
                                            value={formData.resolucion}
                                            onChange={e => setFormData('resolucion', e.target.value)}
                                            placeholder="Escribe la resolución del problema..."
                                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:border-blue-500"
                                        ></textarea>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between items-center pt-4">
                                <div className="text-xs text-black">
                                    {selectedReport.fecha_resolucion && (
                                        <p>Resuelto el: {selectedReport.fecha_resolucion}</p>
                                    )}
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={closeDetails}
                                        className="px-4 py-2 text-sm font-medium text-black hover:text-gray-800"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-blue-700 transition-colors disabled:opacity-50"
                                    >
                                        {processing ? 'Guardando...' : 'Guardar Cambios'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </PanelLayout>
    );
}
