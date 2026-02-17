import PanelLayout from '@/Components/PanelAdminEcommerce/PanelLayout';
import { Head } from '@inertiajs/react';

export default function Orders() {
    // Mock Order Data
    const orders = [
        { id: 'ORD-2401', customer: 'John Doe', email: 'john@example.com', date: 'Oct 24, 2023', total: 89.97, status: 'Pending', items: 3 },
        { id: 'ORD-2400', customer: 'María Silva', email: 'maria@example.com', date: 'Oct 24, 2023', total: 45.00, status: 'Processing', items: 1 },
        { id: 'ORD-2399', customer: 'Pedro García', email: 'pedro@example.com', date: 'Oct 23, 2023', total: 124.50, status: 'Shipped', items: 5 },
        { id: 'ORD-2398', customer: 'Anna Smith', email: 'anna@example.com', date: 'Oct 23, 2023', total: 210.00, status: 'Delivered', items: 2 },
        { id: 'ORD-2397', customer: 'Lucas Brown', email: 'lucas@example.com', date: 'Oct 22, 2023', total: 35.00, status: 'Cancelled', items: 1 },
    ];

    // Configuración del Menú (Copiar en cada archivo o extraer a un helper/contexto)
    const menuItems = [
        { title: 'Catálogo', items: [{ label: 'Productos', icon: '📦', link: route('panel.ecommerce.products') }, { label: 'Categorías', icon: '🏷️', link: '#' }] },
        { title: 'Ventas', items: [{ label: 'Órdenes', icon: '📋', link: route('panel.ecommerce.orders'), badge: '4' }, { label: 'Clientes', icon: '👥', link: '#' }] },
        { title: 'Logística', items: [{ label: 'Proveedores', icon: '🚚', link: '#' }, { label: 'Inventario', icon: '📊', link: '#' }] },
        { title: 'Sistema', items: [{ label: 'Reportes', icon: '⚠️', link: route('panel.ecommerce.reports') }, { label: 'Configuración', icon: '⚙️', link: '#' }] }
    ];

    const user = { name: 'Admin User', role: 'Ecommerce Admin', avatar: 'A' };

    return (
        <PanelLayout title="Gestión de Órdenes" menuItems={menuItems} activeItem="Órdenes" user={user}>
            <Head title="Orders - Admin Panel" />

            {/* Filters */}
            <div className="flex gap-4 mb-6 border-b border-gray-200 pb-1">
                <button className="px-4 py-2 text-sm font-medium text-blue-600 border-b-2 border-blue-600">Todas</button>
                <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">Pendientes</button>
                <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">Procesando</button>
                <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">Enviadas</button>
                <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">Completadas</button>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold">
                            <th className="px-6 py-4">Orden</th>
                            <th className="px-6 py-4">Fecha</th>
                            <th className="px-6 py-4">Cliente</th>
                            <th className="px-6 py-4">Estado</th>
                            <th className="px-6 py-4">Items</th>
                            <th className="px-6 py-4 text-right">Total</th>
                            <th className="px-6 py-4"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {orders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-bold text-gray-900">
                                    <a href="#" className="hover:text-blue-600 hover:underline">{order.id}</a>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">{order.date}</td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="font-medium text-gray-900">{order.customer}</span>
                                        <span className="text-xs text-gray-500">{order.email}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${order.status === 'Pending' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                                            order.status === 'Processing' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                order.status === 'Shipped' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                                                    order.status === 'Delivered' ? 'bg-green-50 text-green-700 border-green-200' :
                                                        'bg-gray-100 text-gray-800 border-gray-200'
                                        }`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">{order.items} items</td>
                                <td className="px-6 py-4 text-right font-medium text-gray-900">${order.total.toFixed(2)}</td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-gray-400 hover:text-gray-600">⋮</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </PanelLayout>
    );
}
