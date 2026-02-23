
import React, { useState } from 'react';
import PanelLayout from '@/Components/PanelAdminEcommerce/PanelLayout';
import FilterBar from '@/Components/PanelAdminEcommerce/FilterBar';
import AdminTable from '@/Components/PanelAdminEcommerce/AdminTable';
import AdminModal from '@/Components/PanelAdminEcommerce/AdminModal';
import { Head, Link, router, useForm } from '@inertiajs/react';

export default function Proveedores({ proveedores, filters = {} }) {
    const { data = [], links = [] } = proveedores ?? {};

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProveedor, setEditingProveedor] = useState(null);
    const [isReadOnly, setIsReadOnly] = useState(false);

    const { data: formData, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        nombre: '',
        contacto_nombre: '',
        email: '',
        telefono: '',
        direccion: '',
        notas: '',
        activo: true
    });

    const filtersConfig = [
        { name: 'nombre', label: 'Nombre', type: 'text' },
        { name: 'email', label: 'Email', type: 'text' },
        {
            name: 'activo',
            label: 'Estado',
            type: 'select',
            options: [
                { value: '1', label: 'Activo' },
                { value: '0', label: 'Inactivo' }
            ]
        },
    ];

    const columns = [
        { label: 'ID', key: 'id', sortable: false, align: 'right' },
        { label: 'Nombre', key: 'nombre', sortable: false },
        { label: 'Contacto', key: 'contacto_nombre', sortable: false },
        { label: 'Email', key: 'email', sortable: false },
        { label: 'Registro', key: 'fecha_registro', sortable: true },
        { label: 'Estado', key: 'activo', sortable: true, align: 'center' },
        { label: 'Acciones', key: 'acciones', sortable: false, align: 'right' },
    ];

    const handleSort = (key) => {
        let newDir = 'asc';
        if (filters.sort_by === key) {
            newDir = filters.sort_dir === 'asc' ? 'desc' : 'asc';
        }
        router.get(route('panel.ecommerce.proveedores'), { ...filters, sort_by: key, sort_dir: newDir }, {
            preserveState: true,
            replace: true
        });
    };

    const openCreateModal = () => {
        setEditingProveedor(null);
        setIsReadOnly(false);
        reset();
        clearErrors();
        setIsModalOpen(true);
    };

    const openEditModal = (prov) => {
        setEditingProveedor(prov);
        setIsReadOnly(false);
        setData({
            nombre: prov.nombre || '',
            contacto_nombre: prov.contacto_nombre || '',
            email: prov.email || '',
            telefono: prov.telefono || '',
            direccion: prov.direccion || '',
            notas: prov.notas || '',
            activo: !!prov.activo
        });
        clearErrors();
        setIsModalOpen(true);
    };

    const openDetailsModal = (prov) => {
        setEditingProveedor(prov);
        setIsReadOnly(true);
        setData({
            nombre: prov.nombre || '',
            contacto_nombre: prov.contacto_nombre || '',
            email: prov.email || '',
            telefono: prov.telefono || '',
            direccion: prov.direccion || '',
            notas: prov.notas || '',
            activo: !!prov.activo
        });
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingProveedor) {
            put(route('panel.ecommerce.proveedores.update', editingProveedor.id), {
                onSuccess: () => setIsModalOpen(false)
            });
        } else {
            post(route('panel.ecommerce.proveedores.store'), {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                }
            });
        }
    };

    const handleDelete = (id) => {
        if (confirm('¿Estás seguro de que deseas eliminar este proveedor?')) {
            router.delete(route('panel.ecommerce.proveedores.destroy', id));
        }
    };

    const renderRow = (prov) => (
        <tr key={prov.id} className="hover:bg-gray-50 transition-colors group cursor-pointer" onClick={() => openDetailsModal(prov)}>
            <td className="px-6 py-4 font-mono text-xs text-gray-400">#{prov.id}</td>
            <td className="px-6 py-4 font-bold text-gray-900">{prov.nombre}</td>
            <td className="px-6 py-4 text-sm text-gray-600 font-medium">{prov.contacto_nombre}</td>
            <td className="px-6 py-4 text-sm text-gray-900">{prov.email}</td>
            <td className="px-6 py-4 text-sm text-gray-500 font-medium">
                {new Date(prov.fecha_registro).toLocaleDateString()}
            </td>
            <td className="px-6 py-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${prov.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {prov.activo ? 'Activo' : 'Inactivo'}
                </span>
            </td>
            <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={(e) => { e.stopPropagation(); openDetailsModal(prov); }}
                        className="p-1 text-gray-400 hover:text-blue-600"
                        title="Ver Detalles"
                    >
                        👁️
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); openEditModal(prov); }}
                        className="p-1 text-gray-400 hover:text-yellow-600"
                        title="Editar"
                    >
                        ✏️
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(prov.id); }}
                        className="p-1 text-gray-400 hover:text-red-600"
                        title="Eliminar"
                    >
                        🗑️
                    </button>
                </div>
            </td>
        </tr>
    );

    return (
        <PanelLayout title="Gestión de Proveedores" activeItem="Proveedores">
            <Head title="Proveedores - Admin Panel" />

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-gray-800">Listado de Proveedores</h2>
                <button
                    onClick={openCreateModal}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                    <span>+</span> Nuevo Proveedor
                </button>
            </div>

            <FilterBar
                filtersConfig={filtersConfig}
                currentFilters={filters}
                routeName="panel.ecommerce.proveedores"
            />

            <AdminTable
                columns={columns}
                data={data}
                filters={filters}
                onSort={handleSort}
                renderRow={renderRow}
            />

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

            <AdminModal
                show={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={isReadOnly ? 'Detalles del Proveedor' : (editingProveedor ? 'Editar Proveedor' : 'Nuevo Proveedor')}
                maxWidth="max-w-xl"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-black text-black mb-1 uppercase tracking-tight">Nombre Empresa</label>
                            <input
                                type="text"
                                readOnly={isReadOnly}
                                className={`w-full p-2 border rounded-lg outline-none font-bold text-gray-900 ${isReadOnly ? 'bg-gray-50 border-gray-100' : (errors.nombre ? 'border-red-500' : 'border-gray-300')}`}
                                value={formData.nombre}
                                onChange={e => setData('nombre', e.target.value)}
                            />
                            {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-black text-black mb-1 uppercase tracking-tight">Nombre Contacto</label>
                            <input
                                type="text"
                                readOnly={isReadOnly}
                                className={`w-full p-2 border rounded-lg outline-none text-gray-900 ${isReadOnly ? 'bg-gray-50 border-gray-100' : 'border-gray-300'}`}
                                value={formData.contacto_nombre}
                                onChange={e => setData('contacto_nombre', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-black text-black mb-1 uppercase tracking-tight">Email</label>
                            <input
                                type="email"
                                readOnly={isReadOnly}
                                className={`w-full p-2 border rounded-lg outline-none text-gray-900 ${isReadOnly ? 'bg-gray-50 border-gray-100' : (errors.email ? 'border-red-500' : 'border-gray-300')}`}
                                value={formData.email}
                                onChange={e => setData('email', e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-black text-black mb-1 uppercase tracking-tight">Teléfono</label>
                            <input
                                type="text"
                                readOnly={isReadOnly}
                                className={`w-full p-2 border rounded-lg outline-none text-gray-900 ${isReadOnly ? 'bg-gray-50 border-gray-100' : 'border-gray-300'}`}
                                value={formData.telefono}
                                onChange={e => setData('telefono', e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-black text-black mb-1 uppercase tracking-tight">Dirección</label>
                        <input
                            type="text"
                            readOnly={isReadOnly}
                            className={`w-full p-2 border rounded-lg outline-none text-gray-900 ${isReadOnly ? 'bg-gray-50 border-gray-100' : 'border-gray-300'}`}
                            value={formData.direccion}
                            onChange={e => setData('direccion', e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-black text-black mb-1 uppercase tracking-tight">Notas Internas</label>
                        <textarea
                            readOnly={isReadOnly}
                            className={`w-full p-2 border rounded-lg outline-none text-gray-900 ${isReadOnly ? 'bg-gray-50 border-gray-100' : 'border-gray-300'}`}
                            rows="3"
                            value={formData.notas}
                            onChange={e => setData('notas', e.target.value)}
                        ></textarea>
                    </div>

                    {!isReadOnly && (
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="p_activo"
                                checked={formData.activo}
                                onChange={e => setData('activo', e.target.checked)}
                            />
                            <label htmlFor="p_activo" className="text-sm font-bold text-black uppercase">Proveedor Activo</label>
                        </div>
                    )}

                    <div className="flex justify-end gap-3 mt-6 border-t pt-4">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-lg">
                            {isReadOnly ? 'Cerrar' : 'Cancelar'}
                        </button>
                        {!isReadOnly && (
                            <button type="submit" disabled={processing} className="px-6 py-2 bg-blue-600 text-white text-sm font-black rounded-lg hover:bg-blue-700 disabled:opacity-50 shadow-md">
                                {editingProveedor ? 'Guardar Cambios' : 'Crear Proveedor'}
                            </button>
                        )}
                    </div>
                </form>
            </AdminModal>
        </PanelLayout>
    );
}
