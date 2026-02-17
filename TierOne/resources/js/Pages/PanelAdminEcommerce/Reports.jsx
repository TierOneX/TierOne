import PanelLayout from '@/Components/PanelAdminEcommerce/PanelLayout';
import { Head } from '@inertiajs/react';

export default function Reports() {
    // Configuración del Menú
    const menuItems = [
        { title: 'Catálogo', items: [{ label: 'Productos', icon: '📦', link: route('panel.ecommerce.products') }, { label: 'Categorías', icon: '🏷️', link: '#' }] },
        { title: 'Ventas', items: [{ label: 'Órdenes', icon: '📋', link: route('panel.ecommerce.orders'), badge: '4' }, { label: 'Clientes', icon: '👥', link: '#' }] },
        { title: 'Logística', items: [{ label: 'Proveedores', icon: '🚚', link: '#' }, { label: 'Inventario', icon: '📊', link: '#' }] },
        { title: 'Sistema', items: [{ label: 'Reportes', icon: '⚠️', link: route('panel.ecommerce.reports') }, { label: 'Configuración', icon: '⚙️', link: '#' }] }
    ];

    const user = { name: 'Admin User', role: 'Ecommerce Admin', avatar: 'A' };

    const systemStatus = [
        { name: 'Database', status: 'Operational', latency: '24ms' },
        { name: 'Payment Gateway', status: 'Operational', latency: '120ms' },
        { name: 'Email Service', status: 'Operational', latency: '45ms' },
        { name: 'CDN', status: 'Degraded Performance', latency: '450ms' },
    ];

    const errorLogs = [
        { id: 1024, type: 'Error', message: 'Payment failed for Order #2397', time: '10 mins ago' },
        { id: 1023, type: 'Warning', message: 'High memory usage detected', time: '1 hour ago' },
        { id: 1022, type: 'Info', message: 'Daily backup completed', time: '4 hours ago' },
    ];

    return (
        <PanelLayout title="Reportes y Estado del Sistema" menuItems={menuItems} activeItem="Reportes" user={user}>
            <Head title="Reports - Admin Panel" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* System Status */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <span>🖥️</span> Estado del Sistema
                    </h3>
                    <div className="space-y-4">
                        {systemStatus.map((service, index) => (
                            <div key={index} className="flex justify-between items-center pb-2 border-b border-gray-100 last:border-0 last:pb-0">
                                <div>
                                    <p className="font-medium text-gray-700">{service.name}</p>
                                    <p className="text-xs text-gray-500">Latency: {service.latency}</p>
                                </div>
                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${service.status === 'Operational' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                    }`}>
                                    {service.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Error Logs */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <span>📋</span> Logs Recientes
                    </h3>
                    <div className="space-y-3">
                        {errorLogs.map((log) => (
                            <div key={log.id} className="flex gap-3 text-sm">
                                <span className={`font-mono text-xs px-1 rounded ${log.type === 'Error' ? 'bg-red-100 text-red-700' :
                                        log.type === 'Warning' ? 'bg-orange-100 text-orange-700' :
                                            'bg-blue-100 text-blue-700'
                                    }`}>
                                    [{log.type}]
                                </span>
                                <span className="text-gray-600 flex-1">{log.message}</span>
                                <span className="text-gray-400 text-xs whitespace-nowrap">{log.time}</span>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-4 text-center text-sm text-blue-600 font-medium hover:underline">Ver todos los logs</button>
                </div>
            </div>

            {/* User Reports */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-6">Reportes de Usuarios</h3>
                <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                    <p>No hay reportes de usuarios pendientes.</p>
                </div>
            </div>

        </PanelLayout>
    );
}
