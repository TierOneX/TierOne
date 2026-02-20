
import React, { useState } from 'react';
import PanelLayout from '@/Components/PanelAdminEcommerce/PanelLayout';
import FilterBar from '@/Components/PanelAdminEcommerce/FilterBar';
import AdminTable from '@/Components/PanelAdminEcommerce/AdminTable';
import AdminModal from '@/Components/PanelAdminEcommerce/AdminModal';
import { Head, useForm, router } from '@inertiajs/react';

export default function Categories({ categorias = [], filters = {}, todas_categorias = [] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        nombre: '',
        descripcion: '',
        id_parent: '',
        activa: true
    });

    const filtersConfig = [
        { name: 'nombre', label: 'Nombre', type: 'text' },
        {
            name: 'activa',
            label: 'Estado',
            type: 'select',
            options: [{ value: '1', label: 'Activa' }, { value: '0', label: 'Inactiva' }]
        },
    ];

    const columns = [
        { label: 'Nombre', key: 'nombre', sortable: true },
        { label: 'Slug', key: 'slug', sortable: false },
        { label: 'Descripción', key: 'descripcion', sortable: false },
        { label: 'Subcategorías', key: 'subcategorias', sortable: false },
        { label: 'Estado', key: 'activa', sortable: true },
        { label: 'Acciones', key: 'acciones', sortable: false },
    ];

    const openCreateModal = () => {
        setEditingCategory(null);
        reset();
        clearErrors();
        setIsModalOpen(true);
    };

    const openEditModal = (cat) => {
        setEditingCategory(cat);
        setData({
            nombre: cat.nombre || '',
            descripcion: cat.descripcion || '',
            id_parent: cat.padre || '',
            activa: !!cat.activa
        });
        clearErrors();
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingCategory) {
            put(route('panel.ecommerce.categories.update', editingCategory.id), {
                onSuccess: () => setIsModalOpen(false)
            });
        } else {
            post(route('panel.ecommerce.categories.store'), {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                }
            });
        }
    };

    const handleDelete = (id) => {
        if (confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
            router.delete(route('panel.ecommerce.categories.destroy', id));
        }
    };

    const handleSort = (key) => {
        let newDir = 'asc';
        if (filters.sort_by === key) {
            newDir = filters.sort_dir === 'asc' ? 'desc' : 'asc';
        }
        router.get(route('panel.ecommerce.categories'), {
            ...filters,
            sort_by: key,
            sort_dir: newDir
        }, { preserveState: true });
    };

    const renderRow = (cat) => (
        <tr key={cat.id} className="hover:bg-gray-50 transition-colors group">
            <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                    {cat.padre && <span className="text-gray-300">└</span>}
                    <span className="font-medium text-gray-900">{cat.nombre}</span>
                </div>
            </td>
            <td className="px-6 py-4 text-xs text-gray-500 font-mono">{cat.slug}</td>
            <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                {cat.descripcion ?? '—'}
            </td>
            <td className="px-6 py-4 text-sm text-gray-600">
                {cat.subcategorias > 0
                    ? <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium">{cat.subcategorias}</span>
                    : <span className="text-gray-400">—</span>
                }
            </td>
            <td className="px-6 py-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cat.activa ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {cat.activa ? 'Activa' : 'Inactiva'}
                </span>
            </td>
            <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => openEditModal(cat)}
                        className="p-1 text-gray-400 hover:text-blue-600"
                        title="Editar"
                    >
                        ✏️
                    </button>
                    <button
                        onClick={() => handleDelete(cat.id)}
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
        <PanelLayout title="Gestión de Categorías" activeItem="Categorías">
            <Head title="Categorías - Admin Panel" />

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-gray-800">Listado de Categorías</h2>
                <button
                    onClick={openCreateModal}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                    <span>+</span> Nueva Categoría
                </button>
            </div>

            <FilterBar
                filtersConfig={filtersConfig}
                currentFilters={filters}
                routeName="panel.ecommerce.categories"
            />

            <AdminTable
                columns={columns}
                data={categorias}
                filters={filters}
                onSort={handleSort}
                renderRow={renderRow}
                emptyMessage="No se encontraron categorías."
            />

            {/* Modal de Creación/Edición */}
            <AdminModal
                show={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Nombre</label>
                        <input
                            type="text"
                            className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${errors.nombre ? 'border-red-500' : 'border-gray-200'}`}
                            value={data.nombre}
                            onChange={e => setData('nombre', e.target.value)}
                            placeholder="Ej: Camisetas"
                        />
                        {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Categoría Padre (Opcional)</label>
                        <select
                            className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={data.id_parent}
                            onChange={e => setData('id_parent', e.target.value)}
                        >
                            <option value="">— Sin Padre (Categoría Principal) —</option>
                            {todas_categorias.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Descripción</label>
                        <textarea
                            className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            rows="3"
                            value={data.descripcion}
                            onChange={e => setData('descripcion', e.target.value)}
                            placeholder="Descripción de la categoría..."
                        ></textarea>
                    </div>

                    <div className="flex items-center gap-2 py-2">
                        <input
                            type="checkbox"
                            id="activa"
                            className="w-4 h-4 text-blue-600 rounded"
                            checked={data.activa}
                            onChange={e => setData('activa', e.target.checked)}
                        />
                        <label htmlFor="activa" className="text-sm font-medium text-gray-700">Categoría Activa</label>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="px-4 py-2 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                            {editingCategory ? 'Guardar Cambios' : 'Crear Categoría'}
                        </button>
                    </div>
                </form>
            </AdminModal>
        </PanelLayout>
    );
}
