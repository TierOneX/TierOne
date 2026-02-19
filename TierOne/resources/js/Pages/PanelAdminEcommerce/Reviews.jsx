import PanelLayout from '@/Components/PanelAdminEcommerce/PanelLayout';
import FilterBar from '@/Components/PanelAdminEcommerce/FilterBar';
import { Head, Link, router } from '@inertiajs/react';

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

export default function Reviews({ reviews, filters = {} }) {
    const { data = [], links = [] } = reviews ?? {};

    const toggleSort = () => {
        const newDir = filters.sort_dir === 'asc' ? 'desc' : 'asc';
        router.get(route('panel.ecommerce.reviews'), { ...filters, sort_dir: newDir }, {
            preserveState: true,
            replace: true
        });
    };

    const filtersConfig = [
        {
            name: 'calificacion',
            label: 'Estrellas',
            type: 'select',
            options: [
                { value: '', label: 'Todas' },
                { value: '5', label: '5 Estrellas' },
                { value: '4', label: '4 Estrellas' },
                { value: '3', label: '3 Estrellas' },
                { value: '2', label: '2 Estrellas' },
                { value: '1', label: '1 Estrella' },
            ]
        },
        {
            name: 'verificado',
            label: 'Compra Verificada',
            type: 'select',
            options: [
                { value: '', label: 'Todos' },
                { value: '1', label: 'Sí' },
                { value: '0', label: 'No' },
            ]
        },
    ];

    const deleteReview = (id) => {
        if (confirm('¿Estás seguro de que deseas eliminar esta reseña?')) {
            router.delete(route('panel.ecommerce.reviews.destroy', id));
        }
    };

    return (
        <PanelLayout title="Moderación de Reseñas" menuItems={menuItems} activeItem="Reseñas" user={user}>
            <Head title="Reseñas - Admin Panel" />

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-gray-800">Comentarios de Clientes</h2>
            </div>

            <FilterBar
                filtersConfig={filtersConfig}
                currentFilters={filters}
                routeName="panel.ecommerce.reviews"
            />

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold">
                            <th className="px-6 py-4">Producto</th>
                            <th className="px-6 py-4">Usuario</th>
                            <th className="px-6 py-4">Calificación</th>
                            <th className="px-6 py-4">Comentario</th>
                            <th className="px-6 py-4 cursor-pointer hover:bg-gray-100 transition-colors group" onClick={toggleSort}>
                                <div className="flex items-center gap-1">
                                    Fecha
                                    <span className="text-gray-400 group-hover:text-blue-600">
                                        {filters.sort_dir === 'asc' ? '🔼' : '🔽'}
                                    </span>
                                </div>
                            </th>
                            <th className="px-6 py-4 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {data.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center py-12 text-gray-400">
                                    No se encontraron reseñas
                                </td>
                            </tr>
                        ) : data.map((r) => (
                            <tr key={r.id} className="hover:bg-gray-50 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="text-sm font-bold text-gray-900">{r.producto}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm text-gray-600 flex items-center gap-1">
                                        {r.usuario}
                                        {r.verificado && <span className="text-blue-500" title="Compra verificada">✅</span>}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex text-yellow-400">
                                        {[...Array(5)].map((_, i) => (
                                            <span key={i}>{i < r.calificacion ? '⭐' : '☆'}</span>
                                        ))}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500 max-w-md">
                                    <p className="line-clamp-2">{r.comentario}</p>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">{r.fecha}</td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => deleteReview(r.id)}
                                            className="p-1 text-gray-400 hover:text-red-600"
                                            title="Eliminar Reseña"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

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
