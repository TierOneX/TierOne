
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
        { label: 'Precio Base', key: 'precio', sortable: true },
        { label: 'Stock', key: 'stock', sortable: true },
        { label: 'Estado', key: 'activo', sortable: true },
        { label: 'Acciones', key: 'acciones', sortable: false },
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
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors flex items-center gap-2">
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
