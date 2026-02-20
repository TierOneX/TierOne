
import React, { useState } from 'react';
import PanelLayout from '@/Components/PanelAdminEcommerce/PanelLayout';
import FilterBar from '@/Components/PanelAdminEcommerce/FilterBar';
import AdminTable from '@/Components/PanelAdminEcommerce/AdminTable';
import AdminModal from '@/Components/PanelAdminEcommerce/AdminModal';
import { Head, useForm, router } from '@inertiajs/react';

const estadoBadge = (estado) => {
    const map = {
        pendiente: 'bg-red-100 text-red-700 font-bold',
        en_revision: 'bg-yellow-100 text-yellow-700 font-bold',
        resuelta: 'bg-green-100 text-green-700 font-bold',
        desestimada: 'bg-gray-100 text-gray-700 font-bold',
    };
    return map[estado] ?? 'bg-gray-100 text-gray-700 font-bold';
};

const tipoBadge = (tipo) => {
    const map = {
        trampa: 'bg-red-50 text-red-600 border border-red-100',
        insulto: 'bg-orange-50 text-orange-600 border border-orange-100',
        bug: 'bg-blue-50 text-blue-600 border border-blue-100',
        otro: 'bg-gray-50 text-gray-600 border border-gray-100',
    };
    return map[tipo] ?? 'bg-gray-50 text-gray-600';
};

export default function Reports({ reportes = [], stats = {}, admins = [], filters = {} }) {
    const [selectedReport, setSelectedReport] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data: formData, setData, post, processing, reset } = useForm({
        estado: '',
        resolucion: '',
        id_resuelto_por: ''
    });

    const filtersConfig = [
        { name: 'id_partida', label: 'Partida', type: 'number' },
        {
            name: 'tipo',
            label: 'Tipo',
            type: 'select',
            options: [
                { value: '', label: 'Todos' },
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
                { value: '', label: 'Cualquiera' },
                { value: 'pendiente', label: 'Pendiente' },
                { value: 'en_revision', label: 'En Revisión' },
                { value: 'resuelta', label: 'Resuelta' },
                { value: 'desestimada', label: 'Desestimada' },
            ]
        },
    ];

    const columns = [
        { label: 'ID', key: 'id', sortable: false },
        { label: 'Tipo', key: 'tipo', sortable: false },
        { label: 'Estado', key: 'estado', sortable: false },
        { label: 'Fecha', key: 'fecha', sortable: true },
        { label: 'Reportado por', key: 'usuario_reporta', sortable: false },
        { label: 'Resuelto por', key: 'resuelto_por', sortable: false },
        { label: 'Acciones', key: 'acciones', sortable: false },
    ];

    const handleSort = (key) => {
        let newDir = 'asc';
        if (filters.sort_by === key) {
            newDir = filters.sort_dir === 'asc' ? 'desc' : 'asc';
        }
        router.get(route('panel.ecommerce.reports'), { ...filters, sort_by: key, sort_dir: newDir }, {
            preserveState: true,
            replace: true
        });
    };

    const openDetails = (reporte) => {
        setSelectedReport(reporte);
        setData({
            estado: reporte.estado,
            resolucion: reporte.resolucion || '',
            id_resuelto_por: reporte.id_resuelto_por || ''
        });
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('panel.ecommerce.reports.update', selectedReport.id), {
            onSuccess: () => {
                setIsModalOpen(false);
                setSelectedReport(null);
            },
        });
    };

    const renderRow = (reporte) => (
        <tr key={reporte.id} className="hover:bg-gray-50 transition-colors cursor-pointer group" onClick={() => openDetails(reporte)}>
            <td className="px-6 py-4 font-mono text-sm text-gray-400">#{reporte.id}</td>
            <td className="px-6 py-4 font-mono text-sm text-blue-600 font-bold">#{reporte.id_partida || '—'}</td>
            <td className="px-6 py-4">
                <span className={`inline-flex px-2 py-0.5 rounded text-xs font-bold uppercase ${tipoBadge(reporte.tipo)}`}>
                    {reporte.tipo}
                </span>
            </td>
            <td className="px-6 py-4 text-sm font-medium text-gray-900">{reporte.usuario_reporta}</td>
            <td className="px-6 py-4">
                <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] uppercase border shadow-sm ${estadoBadge(reporte.estado)}`}>
                    {reporte.estado}
                </span>
            </td>
            <td className="px-6 py-4 text-sm text-gray-500">{reporte.fecha_reporte}</td>
            <td className="px-6 py-4 text-right">
                <button className="text-gray-400 group-hover:text-blue-600 transition-colors">👁️ Ver</button>
            </td>
        </tr>
    );

    return (
        <PanelLayout title="Reportes de Sistema" activeItem="Reportes">
            <Head title="Reportes - Admin Panel" />

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <p className="text-3xl font-black text-gray-900">{stats.total_reportes ?? 0}</p>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Total Reportes</p>
                </div>
                <div className="bg-white rounded-xl border border-red-100 p-6 shadow-sm bg-gradient-to-br from-white to-red-50/30">
                    <p className="text-3xl font-black text-red-600">{stats.reportes_abiertos ?? 0}</p>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Pendientes</p>
                </div>
            </div>

            <FilterBar
                filtersConfig={filtersConfig}
                currentFilters={filters}
                routeName="panel.ecommerce.reports"
            />

            <AdminTable
                columns={columns}
                data={reportes}
                filters={filters}
                onSort={handleSort}
                renderRow={renderRow}
            />

            {/* Modal de detalles y gestión */}
            <AdminModal
                show={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={`Gestión de Reporte #${selectedReport?.id}`}
                maxWidth="max-w-2xl"
            >
                {selectedReport && (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase">Partida</label>
                                    <p className="font-bold text-blue-600 font-mono">#{selectedReport.id_partida || '—'}</p>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase">Reportado por</label>
                                    <p className="font-bold text-gray-900">{selectedReport.usuario_reporta}</p>
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase">Descripción del Problema</label>
                                <p className="text-sm text-gray-700 bg-white p-3 rounded-lg border border-gray-100 mt-1 italic">
                                    "{selectedReport.descripcion}"
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="font-bold text-gray-900 border-b pb-2">Resolución Administrativa</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Nuevo Estado</label>
                                    <select
                                        value={formData.estado}
                                        onChange={e => setData('estado', e.target.value)}
                                        className="w-full bg-white border border-gray-200 rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="pendiente">Pendiente</option>
                                        <option value="en_revision">En Revisión</option>
                                        <option value="resuelta">Resuelta</option>
                                        <option value="desestimada">Desestimada</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Asignado a Administrativo</label>
                                    <select
                                        value={formData.id_resuelto_por}
                                        onChange={e => setData('id_resuelto_por', e.target.value)}
                                        className="w-full bg-white border border-gray-200 rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Sin Asignar</option>
                                        {admins.map(admin => <option key={admin.id} value={admin.id}>{admin.name}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Notas de Resolución</label>
                                <textarea
                                    className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                    rows="4"
                                    value={formData.resolucion}
                                    onChange={e => setData('resolucion', e.target.value)}
                                    placeholder="Explica qué se ha hecho para resolver el reporte..."
                                ></textarea>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-bold text-gray-500">Cancelar</button>
                            <button type="submit" disabled={processing} className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50">
                                {processing ? 'Guardando...' : 'Aplicar Resolución'}
                            </button>
                        </div>
                    </form>
                )}
            </AdminModal>
        </PanelLayout>
    );
}
