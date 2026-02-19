import PanelLayout from '@/Components/PanelAdminEcommerce/PanelLayout';
import FilterBar from '@/Components/PanelAdminEcommerce/FilterBar';
import { Head, Link } from '@inertiajs/react';

const menuItems = [
    {
        title: 'Catálogo', items: [
            { label: 'Productos', icon: '📦', link: route('panel.ecommerce.products') },
            { label: 'Categorías', icon: '🏷️', link: route('panel.ecommerce.categories') },
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

export default function Categories({ categorias = [], filters = {} }) {
    const filtersConfig = [
        { name: 'nombre', label: 'Nombre', type: 'text' },
        {
            name: 'activa',
            label: 'Estado',
            type: 'select',
            options: [{ value: '1', label: 'Activa' }, { value: '0', label: 'Inactiva' }]
        },
    ];

    return (
        <PanelLayout title="Gestión de Categorías" menuItems={menuItems} activeItem="Categorías" user={user}>
            <Head title="Categorías - Admin Panel" />

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-gray-800">Listado de Categorías</h2>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors flex items-center gap-2">
                    <span>+</span> Nueva Categoría
                </button>
            </div>

            {/* BARRA DE FILTROS */}
            <FilterBar
                filtersConfig={filtersConfig}
                currentFilters={filters}
                routeName="panel.ecommerce.categories"
            />

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold">
                            <th className="px-6 py-4">Nombre</th>
                            <th className="px-6 py-4">Slug</th>
                            <th className="px-6 py-4">Descripción</th>
                            <th className="px-6 py-4">Subcategorías</th>
                            <th className="px-6 py-4">Estado</th>
                            <th className="px-6 py-4 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {categorias.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center py-12 text-gray-400">
                                    No se encontraron categorías
                                </td>
                            </tr>
                        ) : categorias.map((cat) => (
                            <tr key={cat.id} className="hover:bg-gray-50 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        {cat.padre && <span className="text-gray-300">└</span>}
                                        <span className="font-medium text-gray-900">{cat.nombre}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500 font-mono">{cat.slug}</td>
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
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cat.activa ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                        {cat.activa ? 'Activa' : 'Inactiva'}
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
        </PanelLayout>
    );
}
