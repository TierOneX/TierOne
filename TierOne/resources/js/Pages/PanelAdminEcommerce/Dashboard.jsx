import PanelLayout from '@/Components/PanelAdminEcommerce/PanelLayout';
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

const estadoBadge = (estado) => {
    const map = {
        pendiente: 'bg-orange-100 text-orange-700',
        procesando: 'bg-blue-100 text-blue-700',
        enviada: 'bg-purple-100 text-purple-700',
        entregada: 'bg-green-100 text-green-700',
        cancelada: 'bg-gray-100 text-gray-700',
    };
    return map[estado] ?? 'bg-gray-100 text-gray-700';
};

export default function Dashboard({ stats = {}, ordenes_recientes = [] }) {
    return (
        <PanelLayout title="Dashboard Ecommerce" menuItems={menuItems} activeItem="Dashboard" user={user}>
            <Head title="Admin Dashboard - TierOne" />

            {/* STATS */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon green">$</div>
                    </div>
                    <div className="stat-value">€{Number(stats.ventas_mes ?? 0).toFixed(2)}</div>
                    <div className="stat-label">Ventas del Mes</div>
                </div>

                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon blue">📦</div>
                    </div>
                    <div className="stat-value">{stats.ordenes_activas ?? 0}</div>
                    <div className="stat-label">Órdenes Activas</div>
                </div>

                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon purple">👕</div>
                    </div>
                    <div className="stat-value">{stats.productos_activos ?? 0}</div>
                    <div className="stat-label">Productos Activos</div>
                </div>

                <div className="stat-card warning">
                    <div className="stat-header">
                        <div className="stat-icon orange">⚠️</div>
                    </div>
                    <div className="stat-value">{stats.stock_bajo ?? 0}</div>
                    <div className="stat-label">Productos Vendidos</div>
                </div>
            </div>

            {/* RECENT ORDERS */}
            <section className="section">
                <div className="section-header">
                    <h2 className="section-title">📦 Órdenes Recientes</h2>
                    <Link href={route('panel.ecommerce.orders')} className="section-link">Ver todas</Link>
                </div>

                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>ORDEN</th>
                                <th>CLIENTE</th>
                                <th>FECHA</th>
                                <th>TOTAL</th>
                                <th>ESTADO</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ordenes_recientes.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-8 text-gray-400">
                                        No hay órdenes recientes
                                    </td>
                                </tr>
                            ) : ordenes_recientes.map((orden) => (
                                <tr key={orden.id}>
                                    <td><strong>#{orden.numero}</strong></td>
                                    <td>
                                        <div className="client-info">
                                            <div className="client-avatar">
                                                {orden.cliente?.charAt(0)?.toUpperCase() ?? '?'}
                                            </div>
                                            <span>{orden.cliente}</span>
                                        </div>
                                    </td>
                                    <td>{orden.fecha}</td>
                                    <td><strong>€{Number(orden.total).toFixed(2)}</strong></td>
                                    <td>
                                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${estadoBadge(orden.estado)}`}>
                                            {orden.estado}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </PanelLayout>
    );
}
