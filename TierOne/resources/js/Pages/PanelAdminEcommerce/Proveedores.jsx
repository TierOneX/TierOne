import PanelLayout from '@/Components/PanelAdminEcommerce/PanelLayout';
import FilterBar from '@/Components/PanelAdminEcommerce/FilterBar';
import { Head, Link, router } from '@inertiajs/react';
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

export default function Proveedores({ proveedores, filters = {} }) {
    const { data = [], links = [] } = proveedores ?? {};

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProveedor, setEditingProveedor] = useState(null);

    const toggleSort = () => {
        const newDir = filters.sort_dir === 'asc' ? 'desc' : 'asc';
        router.get(route('panel.ecommerce.proveedores'), { ...filters, sort_dir: newDir }, {
            preserveState: true,
            replace: true
        });
    };

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

    return (
        <PanelLayout title="Gestión de Proveedores" menuItems={menuItems} activeItem="Proveedores" user={user}>
            <Head title="Proveedores - Admin Panel" />

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-gray-800">Listado de Proveedores</h2>
                <button
                    onClick={() => { setEditingProveedor(null); setIsModalOpen(true); }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                    <span>+</span> Nuevo Proveedor
                </button>
            </div>

            {/* BARRA DE FILTROS */}
            <FilterBar
                filtersConfig={filtersConfig}
                currentFilters={filters}
                routeName="panel.ecommerce.proveedores"
            />

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold">
                            <th className="px-6 py-4">ID</th>
                            <th className="px-6 py-4">Nombre</th>
                            <th className="px-6 py-4">Contacto</th>
                            <th className="px-6 py-4">Email</th>
                            <th className="px-6 py-4 cursor-pointer hover:bg-gray-100 transition-colors group" onClick={toggleSort}>
                                <div className="flex items-center gap-1">
                                    Registro
                                    <span className="text-gray-400 group-hover:text-blue-600">
                                        {filters.sort_dir === 'asc' ? '🔼' : '🔽'}
                                    </span>
                                </div>
                            </th>
                            <th className="px-6 py-4 text-center">Estado</th>
                            <th className="px-6 py-4 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {data.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="text-center py-12 text-gray-400">
                                    No se encontraron proveedores
                                </td>
                            </tr>
                        ) : data.map((prov) => (
                            <tr key={prov.id} className="hover:bg-gray-50 transition-colors group">
                                <td className="px-6 py-4 font-mono text-xs text-gray-400">#{prov.id}</td>
                                <td className="px-6 py-4 font-bold text-gray-900">{prov.nombre}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{prov.contacto_nombre}</td>
                                <td className="px-6 py-4 text-sm text-gray-500">{prov.email}</td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {new Date(prov.fecha_registro).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${prov.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {prov.activo ? 'Activo' : 'Inactivo'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-1 text-gray-400 hover:text-blue-600" title="Editar">✏️</button>
                                        <button className="p-1 text-gray-400 hover:text-red-600" title="Eliminar">🗑️</button>
                                    </div>
                                </td>
                            </tr>
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
