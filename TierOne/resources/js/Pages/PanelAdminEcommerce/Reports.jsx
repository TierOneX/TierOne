
import React, { useState } from 'react';
import PanelLayout from '@/Components/PanelAdminEcommerce/PanelLayout';
import FilterBar from '@/Components/PanelAdminEcommerce/FilterBar';
import AdminTable from '@/Components/PanelAdminEcommerce/AdminTable';
import AdminModal from '@/Components/PanelAdminEcommerce/AdminModal';
import { Head, useForm, router } from '@inertiajs/react';

const estadoBadge = (estado) => {
    const map = {
        pendiente: 'bg-red-50 text-red-700 border border-red-100 font-bold',
        en_revision: 'bg-yellow-50 text-yellow-700 border border-yellow-100 font-bold',
        resuelta: 'bg-green-50 text-green-700 border border-green-100 font-bold',
        desestimada: 'bg-gray-100 text-gray-700 border border-gray-200 font-bold',
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

export default function Reports({ reportes = [], stats = {}, admins = [], usuarios = [], filters = {} }) {
    const [selectedReport, setSelectedReport] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('view'); // 'create', 'view', 'edit'

    const { data: formData, setData, post, put, processing, reset, errors, clearErrors } = useForm({
        // Fields for creation
        id_partida: '',
        id_usuario_reporta: '',
        tipo: 'otro',
        descripcion: '',
        // Fields for resolution
        estado: 'pendiente',
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
    ];

    const columns = [
        { label: 'ID', key: 'id', sortable: false },
        { label: 'Partida', key: 'id_partida', sortable: false },
        { label: 'Tipo', key: 'tipo', sortable: false },
        { label: 'Reportado por', key: 'usuario_reporta', sortable: false },
        { label: 'Estado', key: 'estado', sortable: false },
        { label: 'Fecha', key: 'fecha', sortable: true },
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

    const openCreateModal = () => {
        setModalMode('create');
        setSelectedReport(null);
        reset();
        clearErrors();
        setIsModalOpen(true);
    };

    const openDetails = (reporte, edit = false) => {
        setSelectedReport(reporte);
        setModalMode(edit ? 'edit' : 'view');
        setData({
            estado: reporte.estado,
            resolucion: reporte.resolucion || '',
            id_resuelto_por: reporte.id_resuelto_por || ''
        });
        clearErrors();
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (modalMode === 'create') {
            post(route('panel.ecommerce.reports.store'), {
                onSuccess: () => setIsModalOpen(false)
            });
        } else {
            post(route('panel.ecommerce.reports.update', selectedReport.id), {
                onSuccess: () => {
                    setIsModalOpen(false);
                    setSelectedReport(null);
                },
            });
        }
    };

    const renderRow = (reporte) => (
        <tr key={reporte.id} className="hover:bg-gray-50 transition-colors group">
            <td className="px-6 py-4 font-mono text-sm text-gray-400">#{reporte.id}</td>
            <td className="px-6 py-4 font-mono text-sm text-blue-600 font-bold">#{reporte.id_partida || '—'}</td>
            <td className="px-6 py-4">
                <span className={`inline-flex px-2 py-0.5 rounded text-xs font-bold uppercase ${tipoBadge(reporte.tipo)}`}>
                    {reporte.tipo}
                </span>
            </td>
            <td className="px-6 py-4 text-sm font-bold text-gray-900">{reporte.usuario_reporta}</td>
            <td className="px-6 py-4">
                <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] uppercase border shadow-sm ${estadoBadge(reporte.estado)}`}>
                    {reporte.estado}
                </span>
            </td>
            <td className="px-6 py-4 text-sm text-gray-500">{reporte.fecha_reporte}</td>
            <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => openDetails(reporte, false)}
                        className="p-2 bg-white text-gray-400 hover:text-blue-600 rounded-lg border border-gray-200 hover:border-blue-200 shadow-sm transition-all"
                        title="Ver Detalles"
                    >
                        👁️
                    </button>
                    <button
                        onClick={() => openDetails(reporte, true)}
                        className="p-2 bg-white text-gray-400 hover:text-amber-600 rounded-lg border border-gray-200 hover:border-amber-200 shadow-sm transition-all"
                        title="Gestionar"
                    >
                        ✏️
                    </button>
                </div>
            </td>
        </tr>
    );

    return (
        <PanelLayout title="Reportes de Sistema" activeItem="Reportes">
            <Head title="Reportes - Admin Panel" />

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-white tracking-tight uppercase">Listado de Reportes</h2>
                <button
                    onClick={openCreateModal}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-xs uppercase hover:bg-blue-700 transition-colors shadow-md shadow-blue-200 tracking-widest"
                >
                    + Nuevo Reporte
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                    <p className="text-3xl font-black text-gray-900">{stats.total_reportes ?? 0}</p>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Total Reportes</p>
                </div>
                <div className="bg-white rounded-xl border border-red-100 p-6 shadow-sm bg-gradient-to-br from-white to-red-50/20">
                    <p className="text-3xl font-black text-red-600">{stats.reportes_abiertos ?? 0}</p>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Pendientes</p>
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

            <AdminModal
                show={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={modalMode === 'create' ? 'Crear Nuevo Reporte' : (modalMode === 'edit' ? `Gestión de Reporte #${selectedReport?.id}` : `Detalles del Reporte #${selectedReport?.id}`)}
                maxWidth="max-w-2xl"
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    {modalMode === 'create' ? (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">ID Partida</label>
                                    <input
                                        type="number"
                                        className={`w-full p-4 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-black transition-all ${errors.id_partida ? 'border-red-500' : 'border-gray-200'}`}
                                        value={formData.id_partida}
                                        onChange={e => setData('id_partida', e.target.value)}
                                        placeholder="ID de la partida"
                                    />
                                    {errors.id_partida && <p className="text-red-500 text-[10px] mt-2 font-black uppercase tracking-widest">{errors.id_partida}</p>}
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Usuario Reporta</label>
                                    <select
                                        className={`w-full p-4 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-black transition-all ${errors.id_usuario_reporta ? 'border-red-500' : 'border-gray-200'}`}
                                        value={formData.id_usuario_reporta}
                                        onChange={e => setData('id_usuario_reporta', e.target.value)}
                                    >
                                        <option value="">Seleccionar Usuario</option>
                                        {usuarios.map(u => <option key={u.id} value={u.id}>{u.name} ({u.email})</option>)}
                                    </select>
                                    {errors.id_usuario_reporta && <p className="text-red-500 text-[10px] mt-2 font-black uppercase tracking-widest">{errors.id_usuario_reporta}</p>}
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Tipo de Reporte</label>
                                <select
                                    className={`w-full p-4 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-black transition-all ${errors.tipo ? 'border-red-500' : 'border-gray-200'}`}
                                    value={formData.tipo}
                                    onChange={e => setData('tipo', e.target.value)}
                                >
                                    <option value="trampa">Trampa</option>
                                    <option value="insulto">Insulto</option>
                                    <option value="bug">Bug</option>
                                    <option value="otro">Otro</option>
                                </select>
                                {errors.tipo && <p className="text-red-500 text-[10px] mt-2 font-black uppercase tracking-widest">{errors.tipo}</p>}
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Descripción</label>
                                <textarea
                                    className={`w-full p-4 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-black transition-all min-h-[120px] ${errors.descripcion ? 'border-red-500' : 'border-gray-200'}`}
                                    value={formData.descripcion}
                                    onChange={e => setData('descripcion', e.target.value)}
                                    placeholder="Detalla lo sucedido..."
                                ></textarea>
                                {errors.descripcion && <p className="text-red-500 text-[10px] mt-2 font-black uppercase tracking-widest">{errors.descripcion}</p>}
                            </div>
                        </div>
                    ) : (selectedReport && (
                        <>
                            <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 space-y-4 shadow-sm">
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Partida Relacionada</label>
                                        <p className="font-bold text-blue-600 font-mono text-lg">#{selectedReport.id_partida || '—'}</p>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Usuario que Reporta</label>
                                        <p className="font-bold text-black">{selectedReport.usuario_reporta}</p>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                                        <span>📝</span> Descripción del Problema
                                    </label>
                                    <div className="text-sm text-gray-600 bg-white p-4 rounded-xl border border-gray-100 mt-2 shadow-sm leading-relaxed">
                                        {selectedReport.descripcion}
                                    </div>
                                </div>
                            </div>

                            {modalMode === 'edit' ? (
                                <div className="space-y-4 px-1 mt-6">
                                    <h4 className="font-black text-black border-b border-gray-100 pb-3 flex items-center gap-2 uppercase text-xs tracking-widest">
                                        <span className="bg-blue-50 text-blue-600 p-1 rounded">🛡️</span>
                                        Gestión Administrativa
                                    </h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">Estado del Reporte</label>
                                            <select
                                                value={formData.estado}
                                                onChange={e => setData('estado', e.target.value)}
                                                className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm font-bold text-black outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                                            >
                                                <option value="pendiente">Pendiente</option>
                                                <option value="en_revision">En Revisión</option>
                                                <option value="resuelta">Resuelta</option>
                                                <option value="desestimada">Desestimada</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">Administrador Asignado</label>
                                            <select
                                                value={formData.id_resuelto_por}
                                                onChange={e => setData('id_resuelto_por', e.target.value)}
                                                className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm font-bold text-black outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                                            >
                                                <option value="">Sin Asignar</option>
                                                {admins.map(admin => <option key={admin.id} value={admin.id}>{admin.name}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">Resolución / Comentarios</label>
                                        <textarea
                                            className="w-full bg-white border border-gray-200 rounded-xl p-4 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-blue-500 shadow-sm min-h-[120px]"
                                            value={formData.resolucion}
                                            onChange={e => setData('resolucion', e.target.value)}
                                            placeholder="Detalla las acciones tomadas o el motivo de la resolución..."
                                        ></textarea>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4 px-1 mt-6">
                                    <h4 className="font-black border-b border-gray-100 pb-3 flex items-center gap-2 uppercase text-xs tracking-widest text-black">
                                        <span className="bg-green-50 text-green-600 p-1 rounded">✅</span>
                                        Resolución Actual
                                    </h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Estado</label>
                                            <p className="font-bold uppercase text-amber-600 text-sm mt-1">{selectedReport.estado}</p>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Administrador</label>
                                            <p className="font-bold text-black text-sm mt-1">{admins.find(a => a.id == selectedReport.id_resuelto_por)?.name || 'Sin Asignar'}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Resolución</label>
                                        <div className="text-sm text-gray-500 bg-gray-50 p-4 rounded-xl border border-gray-100 mt-2 min-h-[80px]">
                                            {selectedReport.resolucion || 'No hay resolución registrada aún.'}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    ))}

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-xs font-black text-gray-400 uppercase tracking-widest">{modalMode === 'view' ? 'Cerrar' : 'Cancelar'}</button>
                        {modalMode !== 'view' && (
                            <button type="submit" disabled={processing} className="px-6 py-2 bg-blue-600 text-white rounded-lg font-black hover:bg-blue-700 disabled:opacity-50 uppercase text-xs tracking-widest shadow-md shadow-blue-200">
                                {processing ? 'Guardando...' : (modalMode === 'create' ? 'Crear Reporte' : 'Aplicar Resolución')}
                            </button>
                        )}
                    </div>
                </form>
            </AdminModal>
        </PanelLayout>
    );
}
