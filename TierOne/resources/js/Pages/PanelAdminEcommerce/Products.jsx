
import React, { useState } from 'react';
import PanelLayout from '@/Components/PanelAdminEcommerce/PanelLayout';
import FilterBar from '@/Components/PanelAdminEcommerce/FilterBar';
import AdminTable from '@/Components/PanelAdminEcommerce/AdminTable';
import { Head, Link, router, useForm } from '@inertiajs/react';
import AdminModal from '@/Components/PanelAdminEcommerce/AdminModal';

export default function Products({ productos, categorias = [], filters = {} }) {
    const { data = [], links = [] } = productos ?? {};
    const [expandedProduct, setExpandedProduct] = useState(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

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
        { label: 'P. Coste', key: 'precio_proveedor', sortable: true, align: 'right' },
        { label: 'P. Venta', key: 'precio_venta', sortable: true, align: 'right' },
        { label: 'Ventas', key: 'ventas_totales', sortable: true, align: 'right' },
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
        }, { preserveState: true, replace: true });
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
            <tr className="hover:bg-gray-50 transition-colors group border-b border-gray-100">
                <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setExpandedProduct(expandedProduct === product.id ? null : product.id)}
                            className="text-gray-400 hover:text-blue-600 transition-colors w-4 text-xs"
                        >
                            {expandedProduct === product.id ? '▼' : '▶'}
                        </button>
                        {product.imagen_principal ? (
                            <img
                                src={product.imagen_principal}
                                alt={product.nombre}
                                className="w-10 h-10 rounded-lg object-cover border border-gray-200 shadow-sm"
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 border border-gray-100">
                                📦
                            </div>
                        )}
                        <div>
                            <p className="font-bold text-gray-900 text-sm">{product.nombre}</p>
                            <div className="flex gap-1 mt-1">
                                <span className="text-[9px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded border border-gray-200 uppercase font-black tracking-tighter">
                                    {product.categoria?.nombre || 'General'}
                                </span>
                                {product.variantes?.length > 0 && (
                                    <span className="text-[9px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded border border-blue-100 uppercase font-black tracking-tighter">
                                        {product.variantes.length} Variantes
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </td>
                <td className="px-6 py-4 font-bold text-gray-400 text-right">€{Number(product.precio_proveedor).toFixed(2)}</td>
                <td className="px-6 py-4 font-black text-black text-right">€{Number(product.precio_venta).toFixed(2)}</td>
                <td className="px-6 py-4 text-sm text-gray-500 text-right font-mono">{product.ventas_totales}</td>
                <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${product.activo ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'}`}>
                        {product.activo ? 'Activo' : 'Pausado'}
                    </span>
                </td>
                <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 bg-white text-gray-400 hover:text-blue-600 rounded-lg border border-gray-200 hover:border-blue-200 shadow-sm" title="Editar">✏️</button>
                        <button className="p-2 bg-white text-gray-400 hover:text-red-600 rounded-lg border border-gray-200 hover:border-red-200 shadow-sm" title="Eliminar">🗑️</button>
                    </div>
                </td>
            </tr>

            {/* Fila expandida para Variantes */}
            {expandedProduct === product.id && (
                <tr className="bg-gray-50/50">
                    <td colSpan={6} className="px-12 py-6">
                        <div className="border-l-2 border-blue-500/30 pl-6 py-2">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Variantes Disponibles</h3>
                                <button className="text-[10px] font-black text-blue-600 hover:text-blue-700 uppercase tracking-widest bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 transition-all">
                                    + Añadir Variante
                                </button>
                            </div>
                            {product.variantes?.length === 0 ? (
                                <p className="text-sm text-gray-400 italic font-medium">Este producto no tiene variantes registradas.</p>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {product.variantes.map((v) => (
                                        <div key={v.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between group/v transition-all hover:border-blue-400/30">
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <p className="font-black text-black text-sm uppercase tracking-tight">{v.nombre}</p>
                                                    <p className="text-[9px] font-mono text-gray-400 uppercase mt-0.5">{v.sku || 'SIN SKU'}</p>
                                                </div>
                                                <span className={`text-[9px] px-1.5 py-0.5 rounded font-black border tracking-tighter ${v.disponible ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                                                    {v.disponible ? 'DISPONIBLE' : 'AGOTADO'}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center mt-3 border-t border-gray-50 pt-3">
                                                <span className="text-sm font-black text-blue-600">€{Number(v.precio).toFixed(2)}</span>
                                                <div className="flex gap-1 opacity-0 group-hover/v:opacity-100 transition-opacity">
                                                    <button className="p-1.5 text-gray-400 hover:text-black transition-colors">✏️</button>
                                                    <button className="p-1.5 text-gray-400 hover:text-red-500 transition-colors">🗑️</button>
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
                <h2 className="text-lg font-bold text-white">Listado de Productos</h2>
                <div className="flex gap-2">
                    <button className="bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-lg font-bold text-xs uppercase hover:bg-gray-50 transition-colors tracking-widest ">
                        📦 Importar
                    </button>
                    <button
                        onClick={openCreateModal}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-xs uppercase hover:bg-blue-700 transition-colors flex items-center gap-2 tracking-widest shadow-md shadow-blue-200"
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
                <form onSubmit={handleCreateSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-5">
                        <div className="col-span-2">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Nombre del Producto</label>
                            <input
                                type="text"
                                className={`w-full p-4 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-black font-bold transition-all ${errors.nombre ? 'border-red-500' : 'border-gray-200'}`}
                                value={formData.nombre}
                                onChange={e => setData('nombre', e.target.value)}
                                placeholder="Ej: PlayStation 5 Slim"
                            />
                            {errors.nombre && <p className="text-red-500 text-[10px] mt-2 uppercase font-black tracking-widest">{errors.nombre}</p>}
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Categoría</label>
                            <select
                                className={`w-full p-4 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-black font-bold transition-all ${errors.id_categoria ? 'border-red-500' : 'border-gray-200'}`}
                                value={formData.id_categoria}
                                onChange={e => setData('id_categoria', e.target.value)}
                            >
                                <option value="">Seleccionar Categoría</option>
                                {categorias.map(c => (
                                    <option key={c.id} value={c.id}>{c.nombre}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Stock Inicial</label>
                            <input
                                type="number"
                                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-black font-bold"
                                value={formData.stock}
                                onChange={e => setData('stock', e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Precio Venta (€)</label>
                            <input
                                type="number"
                                step="0.01"
                                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-black font-black text-lg"
                                value={formData.precio_venta}
                                onChange={e => setData('precio_venta', e.target.value)}
                                placeholder="0.00"
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Precio Proveedor (€)</label>
                            <input
                                type="number"
                                step="0.01"
                                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-gray-500 font-bold"
                                value={formData.precio_proveedor}
                                onChange={e => setData('precio_proveedor', e.target.value)}
                                placeholder="0.00"
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Descripción</label>
                            <textarea
                                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-black min-h-[120px]"
                                rows="3"
                                value={formData.descripcion}
                                onChange={e => setData('descripcion', e.target.value)}
                                placeholder="Breve descripción del producto..."
                            ></textarea>
                        </div>

                        <div className="flex items-center gap-6 py-2 bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    checked={formData.activo}
                                    onChange={e => setData('activo', e.target.checked)}
                                />
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover:text-blue-600 transition-colors">Activo</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    checked={formData.destacado}
                                    onChange={e => setData('destacado', e.target.checked)}
                                />
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover:text-amber-600 transition-colors">Destacado</span>
                            </label>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end gap-3 border-t border-gray-100 pt-6">
                        <button
                            type="button"
                            onClick={() => setIsCreateModalOpen(false)}
                            className="px-5 py-2.5 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:bg-gray-50 rounded-xl transition-all"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-8 py-2.5 bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.15em] rounded-xl hover:bg-blue-700 shadow-md shadow-blue-200 disabled:opacity-50 transition-all"
                        >
                            {processing ? 'Procesando...' : 'Crear Producto'}
                        </button>
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
