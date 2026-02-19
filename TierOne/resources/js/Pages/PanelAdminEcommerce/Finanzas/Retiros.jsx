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

const estadoBadge = (estado) => {
    const map = {
        pendiente: 'bg-orange-50 text-orange-700 border-orange-200',
        procesando: 'bg-blue-50 text-blue-700 border-blue-200',
        completado: 'bg-green-50 text-green-700 border-green-200',
        rechazado: 'bg-red-50 text-red-700 border-red-200',
    };
    return map[estado] ?? 'bg-gray-100 text-gray-800 border-gray-200';
};

export default function Retiros({ retiros, filters = {} }) {
    const { data = [], links = [] } = retiros ?? {};

    const toggleSort = () => {
        const newDir = filters.sort_dir === 'asc' ? 'desc' : 'asc';
        router.get(route('panel.ecommerce.finanzas.retiros'), { ...filters, sort_dir: newDir }, {
            preserveState: true,
            replace: true
        });
    };

    const filtersConfig = [
        {
            name: 'estado',
            label: 'Estado',
            type: 'select',
            options: [
                { value: '', label: 'Todos' },
                { value: 'pendiente', label: 'Pendiente' },
                { value: 'procesando', label: 'Procesando' },
                { value: 'completado', label: 'Completado' },
                { value: 'rechazado', label: 'Rechazado' },
            ]
        },
        {
            name: 'metodo',
            label: 'Método',
            type: 'select',
            options: [
                { value: '', label: 'Todos' },
                { value: 'paypal', label: 'PayPal' },
                { value: 'transferencia', label: 'Transferencia' },
                { value: 'cripto', label: 'Cripto' },
            ]
        },
    ];

    return (
        <PanelLayout title="Gestión de Retiros" menuItems={menuItems} activeItem="Retiros" user={user}>
            <Head title="Retiros - Admin Panel" />

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-gray-800">Solicitudes de Retiro</h2>
            </div>

            <FilterBar
                filtersConfig={filtersConfig}
                currentFilters={filters}
                routeName="panel.ecommerce.finanzas.retiros"
            />

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold">
                            <th className="px-6 py-4">Usuario</th>
                            <th className="px-6 py-4">Método</th>
                            <th className="px-6 py-4">Detalles</th>
                            <th className="px-6 py-4 cursor-pointer hover:bg-gray-100 transition-colors group" onClick={toggleSort}>
                                <div className="flex items-center gap-1">
                                    Solicitud
                                    <span className="text-gray-400 group-hover:text-blue-600">
                                        {filters.sort_dir === 'asc' ? '🔼' : '🔽'}
                                    </span>
                                </div>
                            </th>
                            <th className="px-6 py-4">Estado</th>
                            <th className="px-6 py-4 text-right">Monto</th>
                            <th className="px-6 py-4 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {data.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="text-center py-12 text-gray-400">
                                    No se encontraron solicitudes de retiro
                                </td>
                            </tr>
                        ) : data.map((r) => (
                            <tr key={r.id} className="hover:bg-gray-50 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="font-medium text-gray-900">{r.usuario}</div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500 capitalize">{r.metodo}</td>
                                <td className="px-6 py-4 text-sm text-gray-500 truncate max-w-xs" title={r.detalles}>
                                    {r.detalles}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">{r.fecha_solicitud}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium border ${estadoBadge(r.estado)}`}>
                                        {r.estado}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right font-bold text-gray-900">
                                    {Number(r.monto).toFixed(2)}€
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {r.estado === 'pendiente' && (
                                            <>
                                                <button className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 transition-colors">Aprobar</button>
                                                <button className="text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 transition-colors">Rechazar</button>
                                            </>
                                        )}
                                        <button className="p-1 text-gray-400 hover:text-blue-600" title="Ver detalles">👁️</button>
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
