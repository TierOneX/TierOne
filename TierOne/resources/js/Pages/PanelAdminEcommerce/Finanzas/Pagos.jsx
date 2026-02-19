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
        completado: 'bg-green-50 text-green-700 border-green-200',
        fallido: 'bg-red-50 text-red-700 border-red-200',
        reembolsado: 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return map[estado] ?? 'bg-gray-100 text-gray-800 border-gray-200';
};

export default function Pagos({ pagos, filters = {} }) {
    const { data = [], links = [] } = pagos ?? {};

    const toggleSort = () => {
        const newDir = filters.sort_dir === 'asc' ? 'desc' : 'asc';
        router.get(route('panel.ecommerce.finanzas.pagos'), { ...filters, sort_dir: newDir }, {
            preserveState: true,
            replace: true
        });
    };

    const filtersConfig = [
        {
            name: 'metodo',
            label: 'Método',
            type: 'select',
            options: [
                { value: '', label: 'Todos' },
                { value: 'tarjeta', label: 'Tarjeta' },
                { value: 'paypal', label: 'PayPal' },
                { value: 'transferencia', label: 'Transferencia' },
                { value: 'balance', label: 'Balance' },
            ]
        },
        {
            name: 'estado',
            label: 'Estado',
            type: 'select',
            options: [
                { value: '', label: 'Todos' },
                { value: 'pendiente', label: 'Pendiente' },
                { value: 'completado', label: 'Completado' },
                { value: 'fallido', label: 'Fallido' },
                { value: 'reembolsado', label: 'Reembolsado' },
            ]
        },
        { name: 'fecha_desde', label: 'Desde', type: 'date' },
        { name: 'fecha_hasta', label: 'Hasta', type: 'date' },
    ];

    return (
        <PanelLayout title="Gestión de Pagos" menuItems={menuItems} activeItem="Pagos" user={user}>
            <Head title="Pagos - Admin Panel" />

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-gray-800">Sincronización de Pagos</h2>
            </div>

            <FilterBar
                filtersConfig={filtersConfig}
                currentFilters={filters}
                routeName="panel.ecommerce.finanzas.pagos"
            />

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold">
                            <th className="px-6 py-4">Transacción ID</th>
                            <th className="px-6 py-4">Orden</th>
                            <th className="px-6 py-4">Cliente</th>
                            <th className="px-6 py-4">Método</th>
                            <th className="px-6 py-4 cursor-pointer hover:bg-gray-100 transition-colors group" onClick={toggleSort}>
                                <div className="flex items-center gap-1">
                                    Fecha
                                    <span className="text-gray-400 group-hover:text-blue-600">
                                        {filters.sort_dir === 'asc' ? '🔼' : '🔽'}
                                    </span>
                                </div>
                            </th>
                            <th className="px-6 py-4">Estado</th>
                            <th className="px-6 py-4 text-right">Monto</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {data.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="text-center py-12 text-gray-400">
                                    No se encontraron pagos
                                </td>
                            </tr>
                        ) : data.map((pago) => (
                            <tr key={pago.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-mono text-xs text-gray-600">
                                    {pago.id_transaccion}
                                </td>
                                <td className="px-6 py-4">
                                    <span className="font-bold text-gray-900">#{pago.numero_orden}</span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">{pago.cliente}</td>
                                <td className="px-6 py-4 text-sm text-gray-500 capitalize">{pago.metodo}</td>
                                <td className="px-6 py-4 text-sm text-gray-500">{pago.fecha}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${estadoBadge(pago.estado)}`}>
                                        {pago.estado}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right font-bold text-gray-900">
                                    €{Number(pago.monto).toFixed(2)}
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
