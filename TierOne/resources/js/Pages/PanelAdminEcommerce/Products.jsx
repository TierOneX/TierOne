import PanelLayout from '@/Components/PanelAdminEcommerce/PanelLayout';
import FilterBar from '@/Components/PanelAdminEcommerce/FilterBar';
import { Head, Link, router } from '@inertiajs/react';
import React, { useState } from 'react';

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
            { label: 'Pagos', icon: '💳', link: route('panel.ecommerce.finanzas.pagos') },
            { label: 'Transacciones', icon: '📊', link: route('panel.ecommerce.finanzas.transacciones') },
            { label: 'Retiros', icon: '🏦', link: route('panel.ecommerce.finanzas.retiros') },
            { label: 'Reseñas', icon: '⭐', link: route('panel.ecommerce.reviews') },
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

export default function Products({ productos, categorias = [], filters = {} }) {
    const { data = [], links = [] } = productos ?? {};
    const [expandedProduct, setExpandedProduct] = useState(null);

    const toggleSort = () => {
        const newDir = filters.sort_dir === 'asc' ? 'desc' : 'asc';
        router.get(route('panel.ecommerce.products'), { ...filters, sort_dir: newDir }, {
            preserveState: true,
            replace: true
        });
    };

    const filtersConfig = [
        { name: 'nombre', label: 'Nombre', type: 'text' },
        {
            name: 'id_categoria',
            label: 'Categoría',
            type: 'select',
            options: categorias.map(c => ({ value: c.id, label: c.nombre }))
        },
        {
            name: 'activo',
            label: 'Estado',
            type: 'select',
            options: [{ value: '1', label: 'Activo' }, { value: '0', label: 'Inactivo' }]
        },
        {
            name: 'destacado',
            label: 'Destacado',
            type: 'select',
            options: [{ value: '1', label: 'Sí' }, { value: '0', label: 'No' }]
        },
        { name: 'precio_min', label: 'Precio Min', type: 'number' },
        { name: 'precio_max', label: 'Precio Max', type: 'number' },
    ];

    return (
        <PanelLayout title="Gestión de Productos" menuItems={menuItems} activeItem="Productos" user={user}>
            <Head title="Productos - Admin Panel" />

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-gray-800">Listado de Productos</h2>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors flex items-center gap-2">
                    <span>+</span> Nuevo Producto
                </button>
            </div>

            {/* BARRA DE FILTROS */}
            <FilterBar
                filtersConfig={filtersConfig}
                currentFilters={filters}
                routeName="panel.ecommerce.products"
            />

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold">
                            <th className="px-6 py-4">Producto</th>
                            <th className="px-6 py-4">Categoría</th>
                            <th className="px-6 py-4">Precio Venta</th>
                            <th className="px-6 py-4">Ventas</th>
                            <th className="px-6 py-4">Rating</th>
                            <th className="px-6 py-4 cursor-pointer hover:bg-gray-100 transition-colors group" onClick={toggleSort}>
                                <div className="flex items-center gap-1">
                                    Registro
                                    <span className="text-gray-400 group-hover:text-blue-600">
                                        {filters.sort_dir === 'asc' ? '🔼' : '🔽'}
                                    </span>
                                </div>
                            </th>
                            <th className="px-6 py-4">Estado</th>
                            <th className="px-6 py-4 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {data.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="text-center py-12 text-gray-400">
                                    No se encontraron productos con los filtros aplicados
                                </td>
                            </tr>
                        ) : data.map((product) => (
                            <React.Fragment key={product.id}>
                                <tr className="hover:bg-gray-50 transition-colors group">
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
                                                    alt=""
                                                    className="w-10 h-10 rounded-lg object-cover bg-gray-100"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-lg">
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
                                    <td className="px-6 py-4 text-sm text-gray-600">{product.categoria}</td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                        €{Number(product.precio_venta).toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{product.ventas_totales}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        ⭐ {Number(product.rating_promedio ?? 0).toFixed(1)}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {product.fecha_creacion}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.activo
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                            }`}>
                                            {product.activo ? 'Activo' : 'Inactivo'}
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
                                        <td colSpan={8} className="px-12 py-4">
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
                        ))}
                    </tbody>
                </table>
            </div>

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
