
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
                { value: 'all', label: 'Todos' },
                { value: '1', label: 'Activo' },
                { value: '0', label: 'Inactivo' }
            ]
        },
    ];

    const columns = [
        { label: 'ID', key: 'id', sortable: false },
        { label: 'Nombre', key: 'nombre', sortable: false },
        { label: 'Contacto', key: 'contacto_nombre', sortable: false },
        { label: 'Email', key: 'email', sortable: false },
        { label: 'Registro', key: 'fecha_registro', sortable: true },
        { label: 'Estado', key: 'activo', sortable: true },
        { label: 'Acciones', key: 'acciones', sortable: false },
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
        reset();
        clearErrors();
        setIsModalOpen(true);
    };

    const openEditModal = (prov) => {
        setEditingProveedor(prov);
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
        <tr key={prov.id} className="hover:bg-gray-50 transition-colors group">
            <td className="px-6 py-4 font-mono text-xs text-gray-400">#{prov.id}</td>
            <td className="px-6 py-4 font-bold text-gray-900">{prov.nombre}</td>
            <td className="px-6 py-4 text-sm text-gray-600">{prov.contacto_nombre}</td>
            <td className="px-6 py-4 text-sm text-gray-500">{prov.email}</td>
            <td className="px-6 py-4 text-sm text-gray-500">
                {new Date(prov.fecha_registro).toLocaleDateString()}
            </td>
            <td className="px-6 py-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${prov.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {prov.activo ? 'Activo' : 'Inactivo'}
                </span>
            </td>
            <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => openEditModal(prov)}
                        className="p-1 text-gray-400 hover:text-blue-600"
                        title="Editar"
                    >
                        ✏️
                    </button>
                    <button
                        onClick={() => handleDelete(prov.id)}
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

            {/* Modal de Creación/Edición */}
            <AdminModal
                show={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingProveedor ? 'Editar Proveedor' : 'Nuevo Proveedor'}
                maxWidth="max-w-xl"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Nombre Empresa</label>
                            <input
                                type="text"
                                className={`w-full p-2 border rounded-lg outline-none ${errors.nombre ? 'border-red-500' : 'border-gray-200'}`}
                                value={formData.nombre}
                                onChange={e => setData('nombre', e.target.value)}
                            />
                            {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Nombre Contacto</label>
                            <input
                                type="text"
                                className={`w-full p-2 border rounded-lg outline-none ${errors.contacto_nombre ? 'border-red-500' : 'border-gray-200'}`}
                                value={formData.contacto_nombre}
                                onChange={e => setData('contacto_nombre', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                className={`w-full p-2 border rounded-lg outline-none ${errors.email ? 'border-red-500' : 'border-gray-200'}`}
                                value={formData.email}
                                onChange={e => setData('email', e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Teléfono</label>
                            <input
                                type="text"
                                className="w-full p-2 border border-gray-200 rounded-lg outline-none"
                                value={formData.telefono}
                                onChange={e => setData('telefono', e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Dirección</label>
                        <input
                            type="text"
                            className="w-full p-2 border border-gray-200 rounded-lg outline-none"
                            value={formData.direccion}
                            onChange={e => setData('direccion', e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Notas Internas</label>
                        <textarea
                            className="w-full p-2 border border-gray-200 rounded-lg outline-none"
                            rows="3"
                            value={formData.notas}
                            onChange={e => setData('notas', e.target.value)}
                        ></textarea>
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="p_activo"
                            checked={formData.activo}
                            onChange={e => setData('activo', e.target.checked)}
                        />
                        <label htmlFor="p_activo" className="text-sm font-medium text-gray-700">Proveedor Activo</label>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 rounded-lg">
                            Cancelar
                        </button>
                        <button type="submit" disabled={processing} className="px-6 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50">
                            {editingProveedor ? 'Guardar Cambios' : 'Crear Proveedor'}
                        </button>
                    </div>
                </form>
            </AdminModal>
        </PanelLayout>
    );
}
