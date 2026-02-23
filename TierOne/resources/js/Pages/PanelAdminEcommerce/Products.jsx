
import React, { useState } from 'react';
import PanelLayout from '@/Components/PanelAdminEcommerce/PanelLayout';
import FilterBar from '@/Components/PanelAdminEcommerce/FilterBar';
import AdminTable from '@/Components/PanelAdminEcommerce/AdminTable';
import { Head, Link, router } from '@inertiajs/react';

export default function Products({ productos, categorias = [], filters = {} }) {
    const { data = [], links = [] } = productos ?? {};
    const [expandedProduct, setExpandedProduct] = useState(null);

    const filtersConfig = [
        { name: 'search', label: 'Buscar', type: 'text' },
        {
            name: 'id_categoria',
            label: 'Categoría',
            type: 'select',
            options: [
                { value: '', label: 'Todas' },
                ...categorias.map(c => ({ value: c.id, label: c.nombre }))
            ]
        },
        {
            name: 'destacado',
            label: 'Destacado',
            type: 'select',
            options: [
                { value: '', label: 'Cualquiera' },
                { value: '1', label: 'Sí' },
                { value: '0', label: 'No' }
            ]
        },
    ];

    const columns = [
        { label: 'Producto', key: 'nombre', sortable: false },
        { label: 'Categoría', key: 'id_categoria', sortable: false },
        { label: 'Precio Base', key: 'precio', sortable: true, align: 'right' },
        { label: 'Stock', key: 'stock', sortable: true, align: 'right' },
        { label: 'Estado', key: 'activo', sortable: true, align: 'center' },
        { label: 'Acciones', key: 'acciones', sortable: false, align: 'right' },
    ];

    const handleSort = (key) => {
        let newDir = 'asc';
        if (filters.sort_by === key) {
            newDir = filters.sort_dir === 'asc' ? 'desc' : 'asc';
        }

        router.get(route('panel.ecommerce.products'), {
            ...filters,
            sort_by: key,
            sort_dir: newDir
        }, { preserveState: true });
    };

    const { data: formData, setData, post, processing, errors, reset, clearErrors } = useForm({
        nombre: '',
        id_categoria: '',
        precio_venta: '',
        precio_proveedor: '',
        stock: '0',
        activo: true,
        destacado: false,
        descripcion: '',
    });

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const openCreateModal = () => {
        reset();
        clearErrors();
        setIsCreateModalOpen(true);
    };

    const handleCreateSubmit = (e) => {
        e.preventDefault();
        post(route('panel.ecommerce.products.store'), {
            onSuccess: () => {
                setIsCreateModalOpen(false);
                reset();
            }
        });
    };

    const renderRow = (product) => (
        <React.Fragment key={product.id}>
            <tr className="hover:bg-gray-50 transition-colors group border-b border-gray-50">
                <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setExpandedProduct(expandedProduct === product.id ? null : product.id)}
                            className="text-gray-400 hover:text-blue-600 transition-colors w-4"
                        >
                            {expandedProduct === product.id ? '▼' : '▶'}
                        </button>
                        {product.imagen_principal ? (
                            <img
                                src={product.imagen_principal}
                                alt={product.nombre}
                                className="w-10 h-10 rounded-lg object-cover border border-gray-100"
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                                📦
                            </div>
                        )}
                        <div>
                            <p className="font-medium text-gray-900">{product.nombre}</p>
                            {product.variantes?.length > 0 && (
                                <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded border border-blue-100 uppercase font-bold">
                                    {product.variantes.length} Variantes
                                </span>
                            )}
                        </div>
                    </div>
                </td>
                <td className="px-6 py-4">
                    <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                        {product.categoria?.nombre || 'General'}
                    </span>
                </td>
                <td className="px-6 py-4 font-bold text-gray-900">€{Number(product.precio).toFixed(2)}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{product.stock}</td>
                <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {product.activo ? 'Activo' : 'Pausado'}
                    </span>
                </td>
                <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1 text-gray-400 hover:text-blue-600" title="Editar">✏️</button>
                        <button className="p-1 text-gray-400 hover:text-red-600" title="Eliminar">🗑️</button>
                    </div>
                </td>
            </tr>

            {/* Fila expandida para Variantes */}
            {expandedProduct === product.id && (
                <tr className="bg-gray-50/50">
                    <td colSpan={6} className="px-12 py-4">
                        <div className="border-l-4 border-blue-500 pl-4 py-2">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Variantes de {product.nombre}</h3>
                                <button className="text-xs font-bold text-blue-600 hover:underline">+ Añadir Variante</button>
                            </div>
                            {product.variantes?.length === 0 ? (
                                <p className="text-sm text-gray-400 italic">Este producto no tiene variantes registradas.</p>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {product.variantes.map((v) => (
                                        <div key={v.id} className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm flex flex-col justify-between">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <p className="font-bold text-gray-900">{v.nombre}</p>
                                                    <p className="text-[10px] font-mono text-gray-400 uppercase tracking-tighter">{v.sku || 'SIN SKU'}</p>
                                                </div>
                                                <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${v.disponible ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                                    {v.disponible ? 'OK' : 'AGOTADO'}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center mt-2 border-t border-gray-50 pt-2">
                                                <span className="text-sm font-bold text-blue-600">€{Number(v.precio).toFixed(2)}</span>
                                                <div className="flex gap-2">
                                                    <button className="text-gray-400 hover:text-gray-600">✏️</button>
                                                    <button className="text-gray-400 hover:text-red-500">🗑️</button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </td>
                </tr>
            )}
        </React.Fragment>
    );

    return (
        <PanelLayout title="Gestión de Productos" activeItem="Productos">
            <Head title="Productos - Admin Panel" />

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-gray-800">Listado de Productos</h2>
                <div className="flex gap-2">
                    <button className="bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-lg font-medium text-sm hover:bg-gray-50 transition-colors">
                        📦 Importar CSV
                    </button>
                    <button
                        onClick={openCreateModal}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                        <span>+</span> Nuevo Producto
                    </button>
                </div>
            </div>

            <FilterBar
                filtersConfig={filtersConfig}
                currentFilters={filters}
                routeName="panel.ecommerce.products"
            />

            <AdminTable
                columns={columns}
                data={data}
                filters={filters}
                onSort={handleSort}
                renderRow={renderRow}
                emptyMessage="No se encontraron productos."
            />

            {/* Modal de Creación */}
            <AdminModal
                show={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                title="Nuevo Producto"
                maxWidth="max-w-2xl"
            >
                <form onSubmit={handleCreateSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Nombre del Producto</label>
                            <input
                                type="text"
                                className={`w-full p-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold ${errors.nombre ? 'border-red-500' : 'border-gray-200'}`}
                                value={formData.nombre}
                                onChange={e => setData('nombre', e.target.value)}
                                placeholder="Ej: PlayStation 5 Slim"
                            />
                            {errors.nombre && <p className="text-red-500 text-[10px] mt-1 uppercase font-bold">{errors.nombre}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Categoría</label>
                            <select
                                className={`w-full p-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold ${errors.id_categoria ? 'border-red-500' : 'border-gray-200'}`}
                                value={formData.id_categoria}
                                onChange={e => setData('id_categoria', e.target.value)}
                            >
                                <option value="">Seleccionar Categoría</option>
                                {categorias.map(c => (
                                    <option key={c.id} value={c.id}>{c.nombre}</option>
                                ))}
                            </select>
                            {errors.id_categoria && <p className="text-red-500 text-[10px] mt-1 uppercase font-bold">{errors.id_categoria}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Stock Inicial</label>
                            <input
                                type="number"
                                className={`w-full p-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold ${errors.stock ? 'border-red-500' : 'border-gray-200'}`}
                                value={formData.stock}
                                onChange={e => setData('stock', e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Precio Venta (€)</label>
                            <input
                                type="number"
                                step="0.01"
                                className={`w-full p-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold ${errors.precio_venta ? 'border-red-500' : 'border-gray-200'}`}
                                value={formData.precio_venta}
                                onChange={e => setData('precio_venta', e.target.value)}
                                placeholder="0.00"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Precio Proveedor (€)</label>
                            <input
                                type="number"
                                step="0.01"
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                                value={formData.precio_proveedor}
                                onChange={e => setData('precio_proveedor', e.target.value)}
                                placeholder="0.00"
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Descripción</label>
                            <textarea
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                                rows="3"
                                value={formData.descripcion}
                                onChange={e => setData('descripcion', e.target.value)}
                                placeholder="Breve descripción del producto..."
                            ></textarea>
                        </div>

                        <div className="flex items-center gap-4 py-2">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    checked={formData.activo}
                                    onChange={e => setData('activo', e.target.checked)}
                                />
                                <span className="text-xs font-bold text-gray-700 uppercase group-hover:text-blue-600">Activo</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    checked={formData.destacado}
                                    onChange={e => setData('destacado', e.target.checked)}
                                />
                                <span className="text-xs font-bold text-gray-700 uppercase group-hover:text-blue-600">Destacado</span>
                            </label>
                        </div>
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
                            className="px-6 py-2 bg-blue-600 text-white text-xs font-black uppercase rounded-lg hover:bg-blue-700 shadow-md shadow-blue-200 disabled:opacity-50"
                        >
                            {processing ? 'Guardando...' : 'Crear Producto'}
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
